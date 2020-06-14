<template>
  <div class="battle-faction">
    <v-row class="faction-title" align="center" justify="center">
      <h3 v-text="faction.name"></h3>
    </v-row>
    <div v-for="eachTeam of faction.teams" :key="eachTeam.uuid" class="battle-team">
      <div v-text="eachTeam.name" class="red--text"></div>
      <BattleCharacter
        v-for="eachMember of eachTeam.members"
        :key="eachMember.uuid"
        :character="eachMember"
        @selectTarget="selectTarget"
        @selectFireTarget="selectFireTarget"
        @selectSkill="selectSkill"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { CharacterBattle, FactionBattle, Skill } from 'sengoku-rpg-core';

import BattleCharacter from '@/components/BattleCharacter.vue';
import { useGame } from '@/use';

type Data = { faction: FactionBattle };

/**
 * 战斗阵营
 */
export default defineComponent({
  name: 'BattleFaction',
  components: { BattleCharacter },
  props: { faction: Object },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props: Data, context) {
    const game = useGame();

    function selectTarget(target: CharacterBattle) {
      context.emit('selectTarget', target);
    }
    function selectFireTarget(target: CharacterBattle) {
      context.emit('selectFireTarget', target);
    }
    function selectSkill(target: Skill) {
      context.emit('selectSkill', target);
    }
    return {
      game,
      selectTarget,
      selectFireTarget,
      selectSkill,
    };
  },
});
</script>
<style scoped>
.battle-faction {
  padding: 0;
  box-sizing: content-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  flex-direction: column;
  width: 450px;
  height: 100%;
  position: relative;
}
.faction-title {
  width: 100%;
  position: absolute;
  top: 0;
}
.battle-team {
  width: 100%;
  max-height: 100%;
  padding: 2px;
  background-color: beige;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
