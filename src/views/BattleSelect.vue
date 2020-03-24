<template>
    <div class="battle-select">
        <v-banner single-line>选择战役</v-banner>
        <v-item-group v-model="battleId" mandatory>
            <v-container>
                <v-row>
                    <v-col v-for="each of battles" :key="each.id" cols="12" md="4">
                        <v-item v-slot:default="{ active, toggle }" :value="each.id">
                            <v-card
                                :color="active ? 'primary' : ''"
                                class="d-flex align-center"
                                dark
                                height="100"
                                @click="toggle"
                            >
                                <h1>{{ each.name }}</h1>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
        <v-banner single-line>选择参战队伍</v-banner>
        <v-item-group v-model="team" mandatory>
            <v-container>
                <v-row>
                    <v-col v-for="each of teams" :key="each.uuid" cols="12" md="3">
                        <v-item v-slot:default="{ active, toggle }" :value="each.instence">
                            <v-card
                                :color="active ? 'primary' : ''"
                                class="d-flex align-center"
                                dark
                                height="100"
                                @click="toggle"
                            >
                                <h1>{{ each.name }}</h1>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
        <v-btn @click="startBattle">开始战斗</v-btn>
        <v-snackbar v-model="showSnackbar" :top="true">
            {{ snackbarText }}
            <v-btn dark text @click="showSnackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { createComponent, inject, ref, Ref } from '@vue/composition-api';
import { Game } from '@src/Game';
import { EventData, SubscriberFactory, TriggerTiming } from '@src/EventCenter';
import { ItemSystem } from '@src/Item';
import { Rarity } from '@src/Common';
import { TeamNormal } from '@src/Team';
import router from '../router';

export default createComponent({
    name: 'BattleSelect',
    setup() {
        const battleId = ref('');
        const team: Ref<undefined | TeamNormal> = ref();
        const showSnackbar = ref(false);
        const snackbarText = ref('');
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
        const battles = game.battleCenter.battles.map((each) => {
            const { id, name } = each;
            return {
                id,
                name,
            };
        });
        const teams = game.teamCenter.teams.map((each) => {
            return {
                name: each.name,
                uuid: each.uuid,
                instence: Object.seal(each),
            };
        });
        function startBattle() {
            if (!battleId.value) {
                snackbarText.value = '请选择战斗';
                showSnackbar.value = true;
                return;
            }
            // const team = game.teamCenter.teams[0];
            const battleRouterProps = { battleId: battleId.value, teamName: team.value!.name };
            router.push({ name: 'battle', params: battleRouterProps });
            // const battle = game.battleCenter.generateBattle(battleId.value, team.value);
            // battle.eventCenter.addSubscriber(
            //     SubscriberFactory.Subscriber(
            //         TriggerTiming.BattleStart,
            //         (source, data: EventData.EventDataBattleStart) => {
            //             const battle = data.battle;
            //             console.log(
            //                 `[${battle.factions[0].name}]与[${battle.factions[1].name}]两个阵营的矛盾终于暴发了,被后世称为[${battle.name}]的战斗正式打响`,
            //             );
            //             console.log('胜利条件:');
            //             console.log(battle.successCondition.getFormatedDescription());
            //             return true;
            //         },
            //         undefined,
            //         2,
            //     ),
            // );

            // battle.eventCenter.addSubscriber(
            //     SubscriberFactory.Subscriber(
            //         TriggerTiming.BattleSuccess,
            //         (source, data: EventData.EventDataBattleSuccess) => {
            //             const battle = data.battle;
            //             snackbarText.value = `经过${data.round}回合的鏖战后,[${battle.factions[0].name}]终于取得了胜利`;
            //             showSnackbar.value = true;
            //             console.log(
            //                 `经过${data.round}回合的鏖战后,[${battle.factions[0].name}]终于取得了胜利`,
            //                 `\n这场战斗中,击杀了敌军${data.killed.join(', ')}`,
            //             );
            //             return true;
            //         },
            //         undefined,
            //         2,
            //     ),
            // );

            // console.time('战斗');
            // battle.start().then(() => {
            //     const equipmentsConfiguration = game.backpack.equipmentCenter.equipmentsConfiguration;
            //     const equipmentConfiguration =
            //         equipmentsConfiguration[Math.floor(Math.random() * equipmentsConfiguration.length)];
            //     const equipment = game.backpack.equipmentCenter.generateEquipment(equipmentConfiguration);
            //     game.backpack.equipmentCenter.addEquipment(equipment);
            //     game.backpack.addItem(
            //         new ItemSystem({ id: 'money', name: '金钱', count: 20, rarity: Rarity.Immortal }),
            //     );
            //     console.timeEnd('战斗');
            // });
        }
        return { battles, team, teams, battleId, startBattle, showSnackbar, snackbarText };
    },
});
</script>
<style scoped>
.battle-select {
}
</style>
