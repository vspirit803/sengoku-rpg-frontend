<template>
    <div class="battle">
        <span>{{ battle.name }}</span>
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
import { createComponent, inject, ref, Ref, onBeforeMount } from '@vue/composition-api';
import { Game } from '@src/Game';
import { EventData, SubscriberFactory, TriggerTiming } from '@src/EventCenter';
import { TeamBattle } from '@src/Team';
import { BattleBattle } from '@src/Battle';
import BattleFaction from '@/components/BattleFaction.vue';
import router from '@/router';

export default createComponent({
    name: 'Battle',
    components: { BattleFaction },
    props: {
        battleId: String,
        teamName: String,
    },
    setup(props: { battleId: string; teamName: string }) {
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
        const battle: Ref<BattleBattle> = ref(undefined);
        const showDialog = ref(false);
        onBeforeMount(() => {
            const team = game.teamCenter.teams.find((each) => each.name === props.teamName)!;
            battle.value = Object.seal(game.battleCenter.generateBattle(props.battleId, team));
            battle.value.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber(
                    TriggerTiming.BattleStart,
                    (source, data: EventData.EventDataBattleStart) => {
                        const battle = data.battle;
                        console.log(
                            `[${battle.factions[0].name}]与[${battle.factions[1].name}]两个阵营的矛盾终于暴发了,被后世称为[${battle.name}]的战斗正式打响`,
                        );
                        console.log('胜利条件:');
                        console.log(battle.successCondition.getFormatedDescription());
                        return true;
                    },
                    undefined,
                    2,
                ),
            );

            battle.value.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber(
                    TriggerTiming.BattleSuccess,
                    (source, data: EventData.EventDataBattleSuccess) => {
                        const battle = data.battle;
                        console.log(
                            `经过${data.round}回合的鏖战后,[${battle.factions[0].name}]终于取得了胜利`,
                            `\n这场战斗中,击杀了敌军${data.killed.join(', ')}`,
                        );
                        return true;
                    },
                    undefined,
                    2,
                ),
            );

            battle.value.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber(
                    TriggerTiming.ActionEnd,
                    (source, data: EventData.EventDataActionEnd) => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 500);
                        });
                    },
                    undefined,
                    2,
                ),
            );

            console.time('战斗');
            battle.value.start().then(() => {
                // router.back();
                // const equipmentsConfiguration = game.backpack.equipmentCenter.equipmentsConfiguration;
                // const equipmentConfiguration =
                //     equipmentsConfiguration[Math.floor(Math.random() * equipmentsConfiguration.length)];
                // const equipment = game.backpack.equipmentCenter.generateEquipment(equipmentConfiguration);
                // game.backpack.equipmentCenter.addEquipment(equipment);
                // game.backpack.addItem(new ItemSystem({ id: 'money', name: '金钱', count: 20, rarity: Rarity.Immortal }));
                console.timeEnd('战斗');
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
.battle-factions {
    display: flex;
    width: 100%;
    justify-content: space-between;
}
</style>
