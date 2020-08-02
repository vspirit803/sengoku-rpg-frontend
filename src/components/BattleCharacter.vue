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
        ref="characterCard"
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
              <v-hover v-for="eachSkill of character.skills" :key="eachSkill.id" v-slot:default="{ hover }">
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
import { computed, defineComponent, inject, onMounted, Ref, ref, watch } from '@vue/composition-api';
import { CharacterBattle, EventData, Skill, SubscriberFactory, TriggerTiming } from 'sengoku-rpg-core';

import { useGame, useLabel } from '@/use';

type Data = { character: CharacterBattle };

/**
 * 战斗角色
 */
export default defineComponent({
  name: 'BattleCharacter',
  props: { character: Object },
  setup(props: Data, context) {
    const game = useGame();
    const selectableCharacters = inject<Ref<Array<CharacterBattle>>>('selectableCharacters')!;
    const actionCharacter = inject<Ref<CharacterBattle | null>>('actionCharacter')!;
    const fireTarget = inject<Ref<CharacterBattle | null>>('fireTarget')!;
    const { character } = props;
    const selectable = computed(() => selectableCharacters.value.includes(character));
    const isActioning = computed(() => actionCharacter.value === character);
    const isFireTarget = computed(() => fireTarget.value === character);
    const selectedSkill: Ref<Skill | null> = ref(null);
    const characterCard: Ref<{ $el: HTMLElement } | undefined> = ref(undefined);
    let addLabel: (damage: number, color?: string) => void;

    const hpMax = character.properties.hp.battleValue;
    const currHp = ref(hpMax);
    const prevHp = ref(hpMax);
    const currVal = computed(() => (currHp.value / hpMax) * 100);
    const prevVal = computed(() => (prevHp.value / hpMax) * 100);

    onMounted(() => {
      addLabel = useLabel(characterCard.value!.$el);
    });

    character.battle!.eventCenter.addSubscriber(
      SubscriberFactory.Subscriber({
        event: TriggerTiming.Damaged,
        callback: (source, data: EventData.EventDataDamaged) => {
          currHp.value = data.target.currHp;
          const { isCrit } = data;
          addLabel(data.finalDamage!, isCrit ? 'red' : undefined);

          setTimeout(() => {
            prevHp.value = currHp.value;
          }, 1000);
          return true;
        },
        filter: character,
        priority: 0,
      }),
    );

    character.battle!.eventCenter.addSubscriber(
      SubscriberFactory.Subscriber({
        event: TriggerTiming.Treated,
        callback: (source, data: EventData.EventDataTreated) => {
          currHp.value = data.target.currHp;
          addLabel(data.finalDamage!, 'green');

          setTimeout(() => {
            prevHp.value = currHp.value;
          }, 1000);
          return true;
        },
        filter: character,
        priority: 0,
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

    watch(
      isActioning,
      (newVal) => {
        if (newVal) {
          selectSkill(selectedSkill.value ?? character.skills[0]);
        }
      },
      { immediate: true },
    );

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
      characterCard,
    };
  },
});
</script>
<style scoped>
.battle-character {
  position: relative;
  padding: 2px;
  cursor: default;
  user-select: none;
}

.battle-character /deep/ .damage-span {
  position: absolute;
  font-size: x-large;
  font-weight: bolder;
  bottom: 20px;
  width: 100%;
  text-align: center;
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
