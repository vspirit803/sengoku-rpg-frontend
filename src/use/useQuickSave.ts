import { useGame } from './useGame';

export function useQuickSave() {
    const game = useGame();
    return () => {
        const saveString = JSON.stringify(game.generateSave());
        localStorage.setItem('save001', saveString);
    };
}
