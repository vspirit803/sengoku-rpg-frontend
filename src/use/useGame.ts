import { inject, provide } from '@vue/composition-api';
import { Game } from '@src/Game';
const GameSymbol = Symbol();

export function provideGame(game: Game) {
    provide(GameSymbol, game);
}

export function useGame(): Game {
    const game = inject(GameSymbol);
    if (!game) {
        throw new Error('没有获取到Game实例');
    }
    return game as Game;
}
