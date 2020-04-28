import { useGame } from './useGame';

export function useQuickSave() {
    return () => {
        const game = useGame();
        const saveString = JSON.stringify(game.generateSave());
        localStorage.setItem('save001', saveString);
    };
}
