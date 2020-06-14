<template>
  <div class="members-container">
    <template v-for="index of 5">
      <div v-if="index <= members.length" :key="members[index - 1].uuid" class="team-character">
        <v-img :aspect-ratio="3 / 4" :src="getImage(members[index - 1].id)" lazy-src="assets/images/C9999.png">
          <v-btn @click="(selectedCharacterId = members[index - 1].id), (showAddMemberDialog = true)">
            替换
          </v-btn>
          <v-btn @click="removeMember(members[index - 1])">
            离队
          </v-btn>
          <h1 class="character-name">{{ members[index - 1].name }}</h1>
        </v-img>
      </div>
      <div
        v-else
        :key="getKey(index)"
        class="team-character d-flex justify-center align-center"
        @click="(selectedCharacterId = undefined), (showAddMemberDialog = true)"
      >
        <v-overlay absolute :value="true"> </v-overlay>
        <v-icon x-large>mdi-plus</v-icon>
      </div>
    </template>
    <v-row justify="center">
      <v-dialog v-model="showAddMemberDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">添加成员</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-autocomplete
                v-model="addCharacterId"
                clearable
                :items="characters"
                item-value="id"
                item-text="name"
                label="选择要添加的角色"
              ></v-autocomplete>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="showAddMemberDialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="editMember">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';
import { CharacterNormal, TeamNormal } from 'sengoku-rpg-core';

import { useCharacterCenter, useQuickSave } from '@/use';

type Data = { team: TeamNormal };

export default defineComponent({
  name: 'Team',
  props: { team: TeamNormal },
  setup(props: Data) {
    const quickSave = useQuickSave();
    const team = props.team;
    const characterCenter = useCharacterCenter();
    type TeamCharacter = { uuid: symbol; id: string; name: string };
    const members: Ref<Array<TeamCharacter>> = ref(
      team.members.map((each) => {
        return {
          uuid: each.uuid,
          id: each.id,
          name: each.name,
        };
      }),
    );
    const characters = characterCenter.characters
      .filter((each) => each.id.startsWith('C'))
      .map((each) => {
        return {
          id: each.id,
          name: each.name,
        };
      });
    const showAddMemberDialog = ref(false);
    const selectedCharacterId: Ref<undefined | string> = ref();
    const addCharacterId: Ref<undefined | string> = ref();

    function getImage(id: string) {
      return 'assets/images/' + id + '.png';
    }

    function removeMember(character: TeamCharacter) {
      const member = characterCenter.getCharacter(character.id);
      team.removeMember(member);
      members.value.splice(
        members.value.findIndex((each) => each.id === character.id),
        1,
      );
    }

    function addMember(character: CharacterNormal) {
      team.addMember(character);
      members.value.push({
        uuid: character.uuid,
        id: character.id,
        name: character.name,
      });
    }

    function swapMember(memberA: CharacterNormal, memberB: CharacterNormal) {
      const indexA = members.value.findIndex((each) => each.uuid === memberA.uuid);
      const indexB = members.value.findIndex((each) => each.uuid === memberB.uuid);
      members.value.splice(indexA, 1, {
        uuid: memberB.uuid,
        id: memberB.id,
        name: memberB.name,
      });
      members.value.splice(indexB, 1, {
        uuid: memberA.uuid,
        id: memberA.id,
        name: memberA.name,
      });
    }

    function editMember() {
      if (addCharacterId.value === undefined) {
        return;
      }

      const memberAfter = characterCenter.getCharacter(addCharacterId.value);
      if (selectedCharacterId.value === undefined) {
        //选中的是空白位置,增加
        if (team.includes(memberAfter.id)) {
          //已经存在于队伍中,先删除
          removeMember(memberAfter);
        }
        addMember(memberAfter);
      } else {
        //选中有角色的位置,替换
        const memberBefore = characterCenter.getCharacter(selectedCharacterId.value);
        if (team.includes(memberAfter.id)) {
          //已经存在了,互换位置
          swapMember(memberBefore, memberAfter);
        } else {
          removeMember(memberBefore);
          addMember(memberAfter);
        }
      }
      quickSave();

      showAddMemberDialog.value = false;
      addCharacterId.value = undefined;
      selectedCharacterId.value = undefined;
    }

    return {
      members,
      characters,
      getImage,
      editMember,
      removeMember,
      showAddMemberDialog,
      selectedCharacterId,
      addCharacterId,
      getKey: (id: string) => Symbol(id),
    };
  },
});
</script>
<style scoped>
.members-container {
  width: auto;
  padding: 0;
  box-sizing: content-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.team-character {
  position: relative;
  z-index: 1;
  /* height: 403px; */
  /* width: 303px; */
  width: 20%;
  box-sizing: border-box;
  flex-wrap: wrap;
  border-style: solid;
  border-width: 1.5px;
}
.character-name {
  writing-mode: vertical-lr;
  width: 40px;
}
</style>
