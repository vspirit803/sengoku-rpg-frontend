<template>
    <v-card
        class="battle-character my-2 mx-2"
        :class="{ 'grey--text': !character.isAlive, selectable }"
        @click="select"
    >
        <v-avatar size="80" tile>
            <v-img :aspect-ratio="3 / 4" :src="imageUrl">
                <template v-slot:placeholder>
                    <v-img :aspect-ratio="3 / 4" src="assets/images/C9999.png"></v-img>
                </template>
            </v-img>
        </v-avatar>
        <span v-text="character.name"></span>
        <v-progress-linear class="grey" :value="currVal" :buffer-value="prevVal" color="red" height="25" reactive>
            <template>
                <strong>{{ currHp }}/{{ hpMax }}</strong>
            </template>
        </v-progress-linear>
    </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { CharacterBattle } from 'sengoku-rpg-core';
import { EventData, SubscriberFactory, TriggerTiming } from 'sengoku-rpg-core';

import { useGame } from '@/use';

type Data = { character: CharacterBattle; selectable: boolean };

/**
 * 战斗阵营
 */
export default defineComponent({
    name: 'BattleCharacter',
    props: { character: Object, selectable: Boolean },
    setup(props: Data, context) {
        const game = useGame();
        const { character } = props;
        const hpMax = character.properties.hp.battleValue;
        const currHp = ref(hpMax);
        const prevHp = ref(hpMax);
        const currVal = computed(() => {
            return (currHp.value / hpMax) * 100;
        });
        const prevVal = computed(() => {
            return (prevHp.value / hpMax) * 100;
        });
        character.battle!.eventCenter.addSubscriber(
            SubscriberFactory.Subscriber({
                event: TriggerTiming.Attacked,
                callback: (source, data: EventData.EventDataAttacked) => {
                    currHp.value = data.target.currHp;
                    setTimeout(() => {
                        prevHp.value = currHp.value;
                    }, 200);
                    return true;
                },
                filter: character,
                priority: 1,
            }),
        );

        function select() {
            if (!props.selectable) {
                return;
            }
            console.log(`${character.name}被选中`);
            context.emit('selectTarget', character);
        }
        return {
            game,
            hpMax,
            currHp,
            currVal,
            prevVal,
            imageUrl: 'assets/images/' + character.id + '.png',
            select,
        };
    },
});
</script>
<style scoped>
.battle-character {
    box-sizing: border-box;
    padding: 2px;
    cursor: default;
    user-select: none;
}
.selectable {
    border-color: red;
    cursor: pointer;
    padding: 0px;
    border-width: 2px;
    border-style: solid;
}
</style>
