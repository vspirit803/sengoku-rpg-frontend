<template>
    <div class="battle-faction">
        <v-row class="faction-title" align="center" justify="center">
            <h3 v-text="faction.name"></h3>
        </v-row>
        <div v-for="eachTeam of faction.teams" :key="eachTeam.uuid" class="battle-team">
            <div v-text="eachTeam.name" class="red--text"></div>
            <BattleCharacter v-for="eachMember of eachTeam.members" :key="eachMember.uuid" :character="eachMember" />
        </div>
    </div>
</template>

<script lang="ts">
import { createComponent, inject, ref, Ref } from '@vue/composition-api';
import { useGame } from '@/use/useGame';
import { Game } from '@src/Game';
import { TeamNormal } from '@src/Team';
import { FactionBattle } from '@src/Faction';
import BattleCharacter from '@/components/BattleCharacter.vue';

type Data = { faction: FactionBattle };

/**
 * 战斗阵营
 */
export default createComponent({
    name: 'BattleFaction',
    components: { BattleCharacter },
    props: { faction: Object },
    setup(props: Data) {
        const game = useGame();

        return {
            game,
        };
    },
});
</script>
<style scoped>
.battle-faction {
    padding: 0;
    box-sizing: content-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    flex-direction: column;
    width: 300px;
    height: 100%;
    position: relative;
}
.faction-title {
    width: 100%;
    position: absolute;
    top: 0;
}
.battle-team {
    width: 100%;
    max-height: 100%;
    padding: 2px;
    background-color: beige;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>
