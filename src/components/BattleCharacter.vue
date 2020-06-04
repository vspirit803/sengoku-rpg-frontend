<template>
    <v-dialog v-model="showDetail" width="500">
        <template v-slot:activator="{}">
            <v-card
                class="battle-character my-2 mx-2"
                :class="{
                    'grey--text': !character.isAlive,

                    actioning: isActioning,
                    selectable,
                }"
                @click="select"
                @click.right.prevent="selectFireTarget"
            >
                <v-avatar size="80" tile :class="{ 'fire-target': isFireTarget }">
                    <v-img :aspect-ratio="3 / 4" :src="imageUrl">
                        <template v-slot:placeholder>
                            <v-img :aspect-ratio="3 / 4" src="assets/images/C9999.png"></v-img>
                        </template>
                    </v-img>
                </v-avatar>
                <span v-text="character.name"></span>
                <v-progress-linear
                    background-color="#EF9A9A"
                    class="grey"
                    :value="currVal"
                    :buffer-value="prevVal"
                    color="#FF0000"
                    height="25"
                    reactive
                >
                    <template>
                        <strong>{{ currHp }}/{{ hpMax }}</strong>
                    </template>
                </v-progress-linear>
            </v-card>
        </template>
        <v-card>{{ character.name }}</v-card>
    </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import { CharacterBattle, EventData, SubscriberFactory, TriggerTiming } from 'sengoku-rpg-core';

import { useGame } from '@/use';

type Data = { character: CharacterBattle };

/**
 * 战斗角色
 */
export default defineComponent({
    name: 'BattleCharacter',
    props: { character: Object },
    setup(props: Data, context) {
        const game = useGame();
        const selectableCharacters = inject<Ref<Array<CharacterBattle>>>('selectableCharacters', ref([]));
        const actionCharacter = inject<Ref<CharacterBattle | null>>('actionCharacter', ref(null));
        const fireTarget = inject<Ref<CharacterBattle | null>>('fireTarget', ref(null));
        const { character } = props;
        const selectable = computed(() => selectableCharacters.value.includes(character));
        const isActioning = computed(() => actionCharacter.value === character);
        const isFireTarget = computed(() => fireTarget.value === character);

        const hpMax = character.properties.hp.battleValue;
        const currHp = ref(hpMax);
        const prevHp = ref(hpMax);
        const currVal = computed(() => (currHp.value / hpMax) * 100);
        const prevVal = computed(() => (prevHp.value / hpMax) * 100);
        character.battle!.eventCenter.addSubscriber(
            SubscriberFactory.Subscriber({
                event: TriggerTiming.Attacked,
                callback: (source, data: EventData.EventDataAttacked) => {
                    currHp.value = data.target.currHp;
                    setTimeout(() => {
                        prevHp.value = currHp.value;
                    }, 300);
                    return true;
                },
                filter: character,
                priority: 1,
            }),
        );

        function select() {
            if (!selectable.value) {
                return;
            }
            context.emit('selectTarget', character);
        }

        function selectFireTarget() {
            if (character.isPlayerControl) {
                return;
            }
            context.emit('selectFireTarget', character);
        }

        return {
            game,
            hpMax,
            currHp,
            currVal,
            prevVal,
            imageUrl: 'assets/images/' + character.id + '.png',
            select,
            selectable,
            isActioning,
            showDetail: ref(false),
            selectFireTarget,
            isFireTarget,
        };
    },
});
</script>
<style scoped>
.battle-character {
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
.fire-target {
    background: darkred;
}
.actioning {
    border-color: green;
    padding: 0px;
    border-width: 2px;
    border-style: solid;
}
</style>
