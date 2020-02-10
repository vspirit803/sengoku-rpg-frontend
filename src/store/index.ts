import Vue from 'vue';
import Vuex from 'vuex';

import { Game } from '@src/Game';
// import { EventData, SubscriberFactory, TriggerTiming } from '@src/EventCenter';
import save001 from '@assets/saves/sav001.json';

console.time('载入游戏配置');
const game = new Game();
console.timeEnd('载入游戏配置');

console.time('载入游戏存档');
game.loadSave(save001);
console.timeEnd('载入游戏存档');

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {
        game: () => {
            return game;
        },
    },
    mutations: {},
    actions: {},
    modules: {},
});
