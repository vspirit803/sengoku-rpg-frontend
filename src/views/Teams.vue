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
                <!-- <div class="members-container">
                    <span v-for="eachMember of members" :key="eachMember.uuid">
                        <template v-if="eachMember.value">{{ eachMember.value.name }}</template>
                        <span v-else>空</span>
                    </span>
                </div> -->
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script lang="ts">
import { createComponent, inject, ref, computed } from '@vue/composition-api';
import { Game } from '@src/Game';
import { TeamNormal } from '@src/Team';
import { CharacterNormal } from '@src/Character';
import Team from '@/components/Team.vue';

export default createComponent({
    name: 'Teams',
    components: { Team },
    setup() {
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
        const teams = computed(() => {
            return game.teamCenter.teams;
        });
        const currTab = ref(teams.value[0].name);
        const currTeam = computed(() => {
            return teams.value.find((eachTeam) => eachTeam.name === currTab.value)!;
        });
        const members = computed(() => {
            const members: Array<{ uuid: symbol; value: CharacterNormal | null }> = [];
            members.push(
                ...currTeam.value.members.map((eachMember) => {
                    return {
                        uuid: eachMember.uuid,
                        value: eachMember,
                    };
                }),
            );
            while (members.length < 5) {
                members.push({ uuid: Symbol('null'), value: null });
            }
            return members;
        });

        return {
            teams,
            currTeam,
            currTab,
            members,
        };
    },
});
</script>
<style scoped>
.team {
    scroll-behavior: smooth;
}
</style>
