<template>
    <div class="members-container">
        <template v-for="eachMember of members">
            <div
                v-if="!eachMember.value"
                :key="eachMember.uuid"
                class="team-character d-flex justify-center align-center"
                @click="showAddMemberDialog = true"
            >
                <v-overlay absolute :value="true"> </v-overlay>
                <v-icon x-large>mdi-plus</v-icon>
            </div>
            <div v-else :key="eachMember.uuid" class="team-character">
                <v-img :aspect-ratio="3 / 4" :src="getImage(eachMember.value.id)">
                    <h1>{{ eachMember.name }}</h1>
                </v-img>
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
                        <v-btn color="blue darken-1" text @click="addMember">确认</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script lang="ts">
import { createComponent, inject, ref, Ref, computed, reactive } from '@vue/composition-api';
import { useGame } from '@/use/useGame';
import { Game } from 'sengoku-rpg-core';
import { TeamNormal } from 'sengoku-rpg-core';
import { CharacterNormal } from 'sengoku-rpg-core';

type Data = { team: TeamNormal };

export default createComponent({
    name: 'Team',
    props: { team: Object },
    setup(props: Data) {
        const game = useGame();
        const team = props.team;
        // const members = computed(() => {
        //     const members: Array<{ uuid: symbol; value: CharacterNormal | null }> = [];
        //     members.push(
        //         ...team.members.map((eachMember) => {
        //             return {
        //                 uuid: eachMember.uuid,
        //                 value: eachMember,
        //             };
        //         }),
        //     );
        //     while (members.length < 5) {
        //         members.push({ uuid: Symbol('null'), value: null });
        //     }
        //     return members;
        // });
        // const state: { members: Array<{ uuid: symbol; value: CharacterNormal | null }> } = reactive({
        //     members: [],
        // });
        // state.members.push(
        //     ...team.members.map((eachMember) => {
        //         return {
        //             uuid: eachMember.uuid,
        //             value: Object.seal(eachMember),
        //         };
        //     }),
        // );
        const members: Ref<Array<{ uuid: symbol; value: CharacterNormal | null }>> = ref([]);
        members.value.push(
            ...team.members.map((eachMember) => {
                return {
                    uuid: eachMember.uuid,
                    value: Object.seal(eachMember),
                };
            }),
        );
        while (members.value.length < 5) {
            members.value.push({ uuid: Symbol('null'), value: null });
        }
        const characters = game.characterCenter.characters
            .filter((each) => each.id.startsWith('C'))
            .map((each) => {
                return {
                    id: each.id,
                    name: each.name,
                };
            });
        const showAddMemberDialog = ref(false);
        const addCharacterId: Ref<undefined | string> = ref();

        function getImage(id: string) {
            try {
                return require('@assets/images/' + id + '.png');
            } catch (error) {
                return require('@assets/images/' + 'C9999' + '.png');
            }
        }

        function addMember() {
            if (addCharacterId.value === undefined) {
                return;
            }
            const character = game.characterCenter.getCharacter(addCharacterId.value);
            if (team.members.includes(character)) {
                const index = team.members.indexOf(character);
                team.members.splice(index, 1);
                members.value.splice(index, 1);
                members.value.push({ uuid: Symbol('null'), value: null });
            }
            team.members.push(character);
            const viewIndex = members.value.findIndex((each) => {
                return each.value === null;
            });
            members.value.splice(viewIndex, 1, { uuid: character.uuid, value: Object.seal(character) });
            showAddMemberDialog.value = false;
        }

        return { members, characters, getImage, addMember, showAddMemberDialog, addCharacterId };
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
</style>
