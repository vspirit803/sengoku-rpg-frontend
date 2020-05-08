import { TeamNormal } from 'sengoku-rpg-core';

import { useGame } from './useGame';

/**
 * 队伍
 */
export function useTeams(): Array<TeamNormal> {
    return useGame().teamCenter.teams;
}
