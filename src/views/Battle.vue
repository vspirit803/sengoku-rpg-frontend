<template>
    <div class="battle">
        <v-row class="battle-title" align="center" justify="center">
            <div>
                <h2>
                    {{ battle.name }}
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on"> mdi-information-outline</v-icon>
                        </template>
                        <BattleSuccessCondition :condition="battle.successCondition" />
                    </v-tooltip>
                </h2>
                <v-switch v-model="autoMode" label="自动战斗" @change="setAutoMode"></v-switch>
            </div>
        </v-row>
        <div class="battle-factions">
            <BattleFaction
                v-for="each of battle.factions"
                :key="each.uuid"
                :faction="each"
                @selectTarget="selectTarget"
                @selectFireTarget="selectFireTarget"
                @selectSkill="selectSkill"
            />
        </div>
        <v-dialog width="500" v-model="showDialog" attach=".battle" persistent>
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                    战斗胜利
                </v-card-title>
                <v-card-text>
                    {{ successInfo }}
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
import { defineComponent, onBeforeMount, provide, Ref, ref } from '@vue/composition-api';
import {
    BattleBattle,
    CharacterBattle,
    EventData,
    ItemSystem,
    Rarity,
    Skill,
    SubscriberFactory,
    TriggerTiming,
} from 'sengoku-rpg-core';

import BattleFaction from '@/components/BattleFaction.vue';
import BattleSuccessCondition from '@/components/BattleSuccessCondition.vue';
import router from '@/router';
import { useGame, useQuickSave } from '@/use';

export default defineComponent({
    name: 'Battle',
    components: { BattleFaction, BattleSuccessCondition },
    props: {
        battleId: String,
        teamName: String,
    },
    setup(props: { battleId: string; teamName: string }) {
        const game = useGame();
        const quickSave = useQuickSave();
        const selectableCharacters: Ref<Array<CharacterBattle>> = ref([]);
        const actionCharacter: Ref<CharacterBattle | null> = ref(null);
        const fireTarget: Ref<CharacterBattle | null> = ref(null);
        const showDialog = ref(false);
        const battle: Ref<BattleBattle> = ref(undefined);
        const autoMode = ref(false); //自动战斗
        const successInfo = ref('');
        provide('selectableCharacters', selectableCharacters); //可被选中的角色
        provide('actionCharacter', actionCharacter); //正在行动的角色
        provide('fireTarget', fireTarget); //集火目标

        let selectTargetResolve: ((value: boolean) => void) | undefined;
        let selectData: EventData.EventDataSkillSelect | undefined;

        onBeforeMount(() => {
            const team = game.teamCenter.teams.find((each) => each.name === props.teamName)!;
            const battleInstence = game.battleCenter.generateBattle(props.battleId, team);
            battle.value = battleInstence;
            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.BattleStart,
                    callback: (source, data: EventData.EventDataBattleStart) => {
                        const battle = data.battle;
                        console.log(
                            `[${battle.factions[0].name}]与[${battle.factions[1].name}]两个阵营的矛盾终于暴发了,被后世称为[${battle.name}]的战斗正式打响`,
                        );
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
                        successInfo.value = `经过${data.round}回合的鏖战后,[${
                            battle.factions[0].name
                        }]终于取得了胜利\n这场战斗中,击杀了敌军${data.killed.map(({ name }) => name).join(', ')}`;
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
                        return true;
                    },
                    priority: 2,
                }),
            );

            /**行动开始,设置行动角色 */
            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.ActionStart,
                    callback: (source, data) => {
                        actionCharacter.value = data.source;
                        return true;
                    },
                }),
            );

            /**行动结束后 等待一段时间避免看不清 */
            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.ActionEnd,
                    callback: () => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                // actionCharacter.value = null;
                                resolve(true);
                            }, 400);
                        });
                    },
                }),
            );

            /**行动结束,清除行动角色 */
            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.ActionEnd,
                    callback: () => {
                        actionCharacter.value = null;
                        return true;
                    },
                }),
            );

            /**选择技能(todo)和目标 */
            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.SkillSelect,
                    callback: (source, data: EventData.EventDataSkillSelect) => {
                        selectData = data;
                        return new Promise((resolve) => {
                            selectTargetResolve = resolve;
                        });
                    },
                    filter: battleInstence.factions[0].characters,
                }),
            );

            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.ActionStart,
                    callback: (source, data) => {
                        console.log('来到[今川义元]的回合了,回复480HP');
                        data.source.currHp += 480;
                        return true;
                    },
                    filter: battleInstence.characters.find(({ name }) => name === '今川义元'),
                }),
            );

            battleInstence.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber({
                    event: TriggerTiming.ActionStart,
                    callback: (source, data) => {
                        console.log('来到[风樱雪]的回合了,回复50HP');
                        data.source.currHp += 50;
                        return true;
                    },
                    filter: battleInstence.characters.find(({ name }) => name === '风樱雪'),
                }),
            );

            console.time('战斗');
            battleInstence.start();
        });
        function confirm() {
            showDialog.value = false;
            router.back();
        }

        function selectTarget(target: CharacterBattle) {
            selectData!.selectedTarget = target;
            selectableCharacters.value = [];
            selectTargetResolve!(true);
            selectData = undefined;
            selectTargetResolve = undefined;
        }

        function selectFireTarget(target: CharacterBattle) {
            battle.value.setFireTarget(target);
            fireTarget.value = target;
            // if (selectData) {
            //     selectData.selectedTarget = target;
            // }
        }

        function setAutoMode(autoMode: boolean) {
            console.log(`${autoMode ? '开启' : '关闭'}自动模式`);
            battle.value.autoMode = autoMode;
            if (autoMode && selectTargetResolve) {
                console.log('由于现在轮到己方行动,所以进行特殊处理,直接放弃选择');
                selectData!.selectedTarget = undefined;
                selectData!.selectedSkill = undefined;
                selectTargetResolve!(true);
                selectableCharacters.value = [];
                selectData = undefined;
                selectTargetResolve = undefined;
            }
        }

        function selectSkill(skill: Skill) {
            if (!selectData) {
                return;
            }
            selectData.selectedSkill = skill;
            const character = selectData.source;
            const availableTargets = character.enemies.filter((eachCharacter) => eachCharacter.isAlive);
            selectableCharacters.value = availableTargets;
        }

        return {
            battle,
            showDialog,
            confirm,
            selectTarget,
            autoMode,
            successInfo,
            setAutoMode,
            selectFireTarget,
            selectSkill,
        };
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
