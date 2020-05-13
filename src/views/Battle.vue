<template>
    <div class="battle">
        <v-row class="battle-title" align="center" justify="center">
            <h2>{{ battle.name }}</h2>
        </v-row>
        <div class="battle-factions">
            <BattleFaction v-for="each of battle.factions" :key="each.uuid" :faction="each" />
        </div>
        <v-dialog width="500" v-model="showDialog" attach=".battle" persistent>
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                    战斗胜利
                </v-card-title>
                <v-card-text>
                    胜利了
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="confirm">
                        知道了
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, Ref, ref } from '@vue/composition-api';
import {
    BattleBattle,
    BattleCenter,
    CharacterBattle,
    EventData,
    ItemSystem,
    Rarity,
    SubscriberFactory,
    TriggerTiming,
} from 'sengoku-rpg-core';

import BattleFaction from '@/components/BattleFaction.vue';
import router from '@/router';
import { useGame, useQuickSave } from '@/use';

type BattleVm = {
    name: string;
    factions: {
        name: string;
        teams: {
            name: string;
            members: {
                selectable: boolean;
                instence: CharacterBattle;
            }[];
        }[];
    }[];
};

function battleBattle2Vm(battle: BattleBattle): BattleVm {
    return {
        name: battle.name,
        factions: battle.factions.map((each) => {
            return {
                name: each.name,
                teams: each.teams.map((eachTeam) => {
                    return {
                        name: eachTeam.name,
                        members: eachTeam.members.map((eachMember) => {
                            return {
                                instence: eachMember,
                                selectable: false,
                            };
                        }),
                    };
                }),
            };
        }),
    };
}

export default defineComponent({
    name: 'Battle',
    components: { BattleFaction },
    props: {
        battleId: String,
        teamName: String,
    },
    setup(props: { battleId: string; teamName: string }) {
        const game = useGame();
        const quickSave = useQuickSave();
        // const battle: Ref<BattleBattle> = ref(undefined);
        const battle: Ref<BattleVm> = ref(undefined);

        const showDialog = ref(false);

        const characters = computed(() => {
            return battle.value.factions
                .map((eachFaction) => {
                    return eachFaction.teams
                        .map((eachTeam) => eachTeam.members)
                        .reduce((prev, curr) => [...prev, ...curr], []);
                })
                .reduce((prev, curr) => [...prev, ...curr], []);
        });
        onBeforeMount(() => {
            const team = game.teamCenter.teams.find((each) => each.name === props.teamName)!;
            const battleInstence = Object.seal(game.battleCenter.generateBattle(props.battleId, team));
            battle.value = battleBattle2Vm(battleInstence);
            // battle.value = Object.seal(game.battleCenter.generateBattle(props.battleId, team));
            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.BattleStart,
                    callback: (source, data: EventData.EventDataBattleStart) => {
                        const battle = data.battle;
                        console.log(
                            `[${battle.factions[0].name}]与[${battle.factions[1].name}]两个阵营的矛盾终于暴发了,被后世称为[${battle.name}]的战斗正式打响`,
                        );
                        console.log('胜利条件:');
                        console.log(battle.successCondition.getFormatedDescription());
                        return true;
                    },
                    priority: 2,
                }),
            );

            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.BattleSuccess,
                    callback: (source, data: EventData.EventDataBattleSuccess) => {
                        const battle = data.battle;
                        console.log(
                            `经过${data.round}回合的鏖战后,[${battle.factions[0].name}]终于取得了胜利`,
                            `\n这场战斗中,击杀了敌军${data.killed.join(', ')}`,
                        );
                        return true;
                    },
                    priority: 2,
                }),
            );

            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.ActionEnd,
                    callback: () => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 200);
                        });
                    },
                }),
            );

            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.SkillSelect,
                    callback: (source, data: EventData.EventDataSkillSelect) => {
                        const character = data.source;
                        const availableTargets = character.enemies.filter((eachCharacter) => eachCharacter.isAlive);

                        availableTargets.forEach((eachTarget) => {
                            const target = characters.value.find((each) => each.instence.uuid === eachTarget.uuid)!;
                            target.selectable = true;
                        });
                        const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                        data.selectedTarget = target;
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                characters.value.forEach((each) => {
                                    each.selectable = false;
                                });
                                resolve(true);
                            }, 2000);
                        });
                        // return true;
                    },
                }),
            );

            console.time('战斗');
            battleInstence.start().then(() => {
                const equipmentsConfiguration = game.backpack.equipmentCenter.equipmentsConfiguration;
                const equipmentConfiguration =
                    equipmentsConfiguration[Math.floor(Math.random() * equipmentsConfiguration.length)];
                const equipment = game.backpack.equipmentCenter.generateEquipment(equipmentConfiguration);
                game.backpack.equipmentCenter.addEquipment(equipment);
                game.backpack.addItem(
                    new ItemSystem({ id: 'money', name: '金钱', count: 20, rarity: Rarity.Immortal }),
                );
                console.timeEnd('战斗');
                quickSave();
                showDialog.value = true;
            });
        });
        function confirm() {
            showDialog.value = false;
            router.back();
        }

        return { battle, showDialog, confirm };
    },
});
</script>
<style scoped>
.battle {
    height: 100%;
    position: relative;
}
.battle-title {
    position: absolute;
    width: 100%;
    height: 40px;
}
.battle-factions {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
}
</style>
