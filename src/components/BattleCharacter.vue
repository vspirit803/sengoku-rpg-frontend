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
                :ripple="false"
                @click="select"
                @click.right="selectFireTarget"
            >
                <div class="d-flex">
                    <v-avatar size="120" class="flex-grow-0" tile :class="{ 'fire-target': isFireTarget }">
                        <v-img :aspect-ratio="3 / 4" :src="imageUrl">
                            <template v-slot:placeholder>
                                <v-img :aspect-ratio="3 / 4" src="assets/images/C9999.png"></v-img>
                            </template>
                        </v-img>
                    </v-avatar>
                    <div class="flex-grow-1">
                        <span v-text="character.name"></span>
                        <div v-if="isActioning" class="d-flex justify-space-around">
                            <v-hover
                                v-for="eachSkill of character.skills"
                                :key="eachSkill.id"
                                v-slot:default="{ hover }"
                            >
                                <v-img
                                    :class="{
                                        [`elevation-${hover ? 12 : 2}`]: true,
                                        'selected-skill': selectedSkill === eachSkill,
                                    }"
                                    class="ma-1 flex-grow-0 skill"
                                    :width="64"
                                    @click="eachSkill.type !== 'passive' && selectSkill(eachSkill)"
                                    :src="`assets/skills/${eachSkill.id}.png`"
                                >
                                </v-img>
                            </v-hover>
                        </div>
                    </div>
                </div>
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
import { computed, defineComponent, inject, Ref, ref, watch } from '@vue/composition-api';
import { CharacterBattle, EventData, Skill, SubscriberFactory, TriggerTiming } from 'sengoku-rpg-core';

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
        const selectedSkill: Ref<Skill | null> = ref(character.skills[0]);

        const hpMax = character.properties.hp.battleValue;
        const currHp = ref(hpMax);
        const prevHp = ref(hpMax);
        const currVal = computed(() => (currHp.value / hpMax) * 100);
        const prevVal = computed(() => (prevHp.value / hpMax) * 100);

        character.battle!.eventCenter.addSubscriber(
            SubscriberFactory.Subscriber({
                event: TriggerTiming.Damaged,
                callback: (source, data: EventData.EventDataDamaged) => {
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
        function selectSkill(skill: Skill) {
            selectedSkill.value = skill;
            context.emit('selectSkill', skill);
        }

        watch(isActioning, (newVal) => {
            if (newVal && selectedSkill.value) {
                context.emit('selectSkill', selectedSkill.value);
            }
        });

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
            selectSkill,
            selectedSkill,
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
    padding: 0;
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

.selected-skill {
    border-style: dashed;
    border-width: 2px;
    border-color: red;
    margin: 2px !important;
}
</style>
