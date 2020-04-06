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
        <v-progress-linear
            class="grey"
            :value="(currHp / hpMax) * 100"
            :buffer-value="oldVal"
            color="red"
            height="25"
            reactive
        >
            <template>
                <strong>{{ currHp }}/{{ hpMax }}</strong>
            </template>
        </v-progress-linear>
    </v-card>
</template>

<script lang="ts">
import { createComponent, inject, ref, Ref } from '@vue/composition-api';
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
        const character = props.character;
        const hpMax = props.character.properties.hp.battleValue;
        const currHp = ref(hpMax);
        const oldVal = ref(100);
        character.battle!.eventCenter.addSubscriber(
            SubscriberFactory.Subscriber(
                TriggerTiming.Attacked,
                (source, data) => {
                    oldVal.value = (currHp.value / hpMax) * 100;
                    currHp.value = data.target.currHp;
                    setTimeout(() => {
                        oldVal.value = (currHp.value / hpMax) * 100;
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
            oldVal,
            imageUrl: 'assets/images/' + character.id + '.png',
        };
    },
});
</script>
<style scoped></style>