import { inject, provide } from '@vue/composition-api';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
const StoreSymbol = Symbol();

type StoreType = {
    settings: {
        bgm: {
            enabled: boolean;
            volume: number;
            audio?: HTMLAudioElement;
        };
    };
};

function generateStore() {
    return new Store<StoreType>({
        plugins: [createPersistedState({ paths: ['settings.bgm.enabled', 'settings.bgm.volume'] })],
        state: {
            settings: {
                bgm: {
                    enabled: false,
                    volume: 50,
                    audio: undefined,
                },
            },
        },
        getters: {},
        mutations: {
            setEnabled(state, payload: { enabled: boolean }) {
                state.settings.bgm.enabled = payload.enabled;
                if (state.settings.bgm.audio) {
                    if (payload.enabled) {
                        state.settings.bgm.audio.play();
                    } else {
                        state.settings.bgm.audio.pause();
                    }
                }
            },
            setVolume(state, payload: { volume: number }) {
                state.settings.bgm.volume = payload.volume;
                state.settings.bgm.audio!.volume = payload.volume / 100;
            },
            setAudio(state, payload: { audio: HTMLAudioElement }) {
                state.settings.bgm.audio = payload.audio;
                if (!state.settings.bgm.enabled) {
                    payload.audio.pause();
                }
            },
        },
        actions: {},
        modules: {},
    });
}

export function provideStore() {
    provide(StoreSymbol, generateStore());
}

export function useStore() {
    const store = inject(StoreSymbol);
    if (!store) {
        throw new Error('没有获取到Store实例');
    }
    return store as Store<StoreType>;
}
