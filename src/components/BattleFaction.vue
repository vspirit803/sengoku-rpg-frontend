<template>
    <div class="battle-faction">
        <div v-text="faction.name"></div>
        <div v-for="eachTeam of faction.teams" :key="eachTeam.uuid" class="battle-team">
            <div v-text="eachTeam.name" class="red--text"></div>
            <BattleCharacter v-for="eachMember of eachTeam.members" :key="eachMember.uuid" :character="eachMember" />
        </div>
    </div>
</template>

<script lang="ts">
import { createComponent, inject, ref, Ref } from '@vue/composition-api';
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
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;

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
    border-style: dotted;
    width: 150px;
    min-width: 150px;
    height: 100%;
}
.battle-team {
    width: 100%;
    border-style: dotted;
    border-color: aqua;
    border-width: 1px;
}
</style>
