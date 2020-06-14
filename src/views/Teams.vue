<template>
  <div class="team">
    <v-tabs v-model="currTab" vertical>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="eachTeam of teams" :key="eachTeam.uuid" :href="'#' + eachTeam.name">
        {{ eachTeam.name }}
      </v-tab>
      <v-tab-item
        v-for="eachTeam of teams"
        :key="eachTeam.uuid"
        :value="eachTeam.name"
        transition="v-window-y-transition"
        reverse-transition="v-window-y-reverse-transition"
      >
        <Team :team="eachTeam" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

import Team from '@/components/Team.vue';
import { useGame } from '@/use';

export default defineComponent({
  name: 'Teams',
  components: { Team },
  setup() {
    const game = useGame();
    const teams = game.teamCenter.teams;
    const currTab = ref(teams[0].name);

    return {
      teams,
      currTab,
    };
  },
});
</script>
<style scoped>
.team {
  scroll-behavior: smooth;
}
</style>
