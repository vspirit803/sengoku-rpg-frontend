import { inject, provide } from '@vue/composition-api';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);
const StoreSymbol = Symbol();

const store = new Store<{
    settings: {
        bgm: {
            enabled: boolean;
            volume: number;
            audio?: HTMLAudioElement;
        };
    };
}>({
    state: {
        settings: {
            bgm: {
                enabled: false,
                volume: 0.5,
                audio: undefined,
            },
        },
    },
    getters: {},
    mutations: {
        setEnabled(state, payload: { enabled: boolean }) {
            state.settings.bgm.enabled = payload.enabled;
        },
        setVolume(state, payload: { volume: number }) {
            state.settings.bgm.volume = payload.volume;
        },
        setAudio(state, payload: { audio: HTMLAudioElement }) {
            console.log(payload);
            state.settings.bgm.audio = payload.audio;
        },
    },
    actions: {},
    modules: {},
});

export function provideStore() {
    provide(StoreSymbol, store);
}

export function useStore() {
    // const store = inject(StoreSymbol);
    // if (!store) {
    //     throw new Error('没有获取到Store实例');
    // }
    return store;
}
