<template>
    <div class="battle-select">
        <v-autocomplete
            :items="battles"
            :filter="customFilter"
            label="选择战斗"
            item-value="id"
            item-text="name"
            v-model="battleId"
            style="width: 200px"
            :allow-overflow="false"
        ></v-autocomplete>
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
import { createComponent, inject, ref } from '@vue/composition-api';
import { Game } from '@src/Game';
import { EventData, SubscriberFactory, TriggerTiming } from '@src/EventCenter';
import { ItemSystem } from '@src/Item';
import { Rarity } from '@src/Common';

export default createComponent({
    name: 'BattleSelect',
    setup() {
        const battleId = ref('');
        const showSnackbar = ref(false);
        const snackbarText = ref('');
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
        const battles = game.battleCenter.battles;
        function customFilter(item: { name: string }, queryText: string) {
            const name = item.name;
            return name.indexOf(queryText) > -1;
        }
        function startBattle() {
            if (!battleId.value) {
                snackbarText.value = '请选择战斗';
                showSnackbar.value = true;
                return;
            }
            const battle = game.battleCenter.generateBattle(battleId.value);
            battle.eventCenter.addSubscriber(
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

            battle.eventCenter.addSubscriber(
                SubscriberFactory.Subscriber(
                    TriggerTiming.BattleSuccess,
                    (source, data: EventData.EventDataBattleSuccess) => {
                        const battle = data.battle;
                        snackbarText.value = `经过${data.round}回合的鏖战后,[${battle.factions[0].name}]终于取得了胜利`;
                        showSnackbar.value = true;
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

            console.time('战斗');
            battle.start().then(() => {
                const equipmentsConfiguration = game.backpack.equipmentCenter.equipmentsConfiguration;
                const equipmentConfiguration =
                    equipmentsConfiguration[Math.floor(Math.random() * equipmentsConfiguration.length)];
                const equipment = game.backpack.equipmentCenter.generateEquipment(equipmentConfiguration);
                game.backpack.equipmentCenter.addEquipment(equipment);
                game.backpack.addItem(
                    new ItemSystem({ id: 'money', name: '金钱', count: 20, rarity: Rarity.Immortal }),
                );
                console.timeEnd('战斗');
            });
        }
        return { battles, customFilter, battleId, startBattle, showSnackbar, snackbarText };
    },
});
</script>
<style scoped>
.battle-select {
}
</style>
