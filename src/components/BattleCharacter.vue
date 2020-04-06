<template>
    <v-card class="battle-character my-2 mx-2" :class="{ 'grey--text': !character.isAlive }">
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
import { createComponent, inject, ref, computed } from '@vue/composition-api';
import { Game } from '@src/Game';
import { CharacterBattle } from '@src/Character';
import { TriggerTiming, EventData, SubscriberFactory } from '@src/EventCenter';

type Data = { character: CharacterBattle };

/**
 * 战斗阵营
 */
export default createComponent({
    name: 'BattleCharacter',
    props: { character: Object },
    setup(props: Data) {
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
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
            SubscriberFactory.Subscriber(
                TriggerTiming.Attacked,
                (source, data: EventData.EventDataAttacked) => {
                    currHp.value = data.target.currHp;
                    setTimeout(() => {
                        prevHp.value = currHp.value;
                    }, 200);
                    return true;
                },
                character,
                1,
            ),
        );
        return {
            game,
            hpMax,
            currHp,
            currVal,
            prevVal,
            imageUrl: 'assets/images/' + character.id + '.png',
        };
    },
});
</script>
<style scoped></style>
