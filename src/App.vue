<template>
    <v-app class="app">
        <v-app-bar app color="primary" dark>
            <v-switch v-model="enabled" @change="setEnabled"></v-switch>{{ enabled }}
            <audio ref="audio" autoplay loop>
                <source src="/assets/audios/main.mp3" type="audio/mp3" />
            </audio>
            <div class="d-flex align-center">
                <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                    transition="scale-transition"
                    width="40"
                />

                <v-img
                    alt="Vuetify Name"
                    class="shrink mt-1 hidden-sm-and-down"
                    contain
                    min-width="100"
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                    width="100"
                />
            </div>
            <v-spacer></v-spacer>
            <v-btn to="/">Home</v-btn>
            <v-btn to="/about">About</v-btn>
            <v-btn to="/illustration">图鉴</v-btn>
            <v-btn to="/battle-select">战斗选择</v-btn>
            <v-btn to="/backpack">物品栏</v-btn>
            <v-btn to="/teams">编队</v-btn>
            <v-btn to="/settings">设置</v-btn>
            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
                <span class="mr-2">Latest Release</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>
        <v-content>
            <v-responsive class="content" :aspect-ratio="16 / 9">
                <keep-alive exclude="Battle"> <router-view></router-view></keep-alive>
            </v-responsive>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import save001 from '@assets/saves/sav001.json';
import { computed, defineComponent, onBeforeUnmount, onMounted, Ref, ref, watch } from '@vue/composition-api';
import { Game, GameSave } from 'sengoku-rpg-core';

import { provideGame, useStore } from '@/use';

console.time('载入游戏配置');
const game = new Game();
console.timeEnd('载入游戏配置');
console.time('载入游戏存档');
const localSave = localStorage.getItem('save001');
if (localSave) {
    const save = JSON.parse(localSave) as GameSave;
    game.loadSave(save);
    console.log('从localStorage读取存档');
} else {
    game.loadSave(save001);
    console.log('读取预设存档');
}
console.timeEnd('载入游戏存档');

export default defineComponent({
    name: 'App',
    setup(props, context) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).game = game;
        const audio: Ref<HTMLAudioElement> = ref(undefined);
        provideGame(game);
        const store = useStore();
        // const enabled = computed(() => {
        //     return store.state.settings.bgm.enabled;
        // });
        const enabled = ref(store.state.settings.bgm.enabled);
        const volume = computed(() => {
            return store.state.settings.bgm.volume;
        });
        onMounted(() => {
            store.commit('setAudio', { audio: audio.value });
        });
        watch(enabled, (newVal) => {
            if (!audio.value) {
                return;
            }
            if (newVal) {
                audio.value.play();
            } else {
                audio.value.pause();
            }
        });
        watch(volume, (newVal) => {
            if (!audio.value) {
                return;
            }
            audio.value.volume = newVal;
        });
        onBeforeUnmount(() => {
            store.commit('setEnabled', { enabled: false });
        });
        function setEnabled(enabled: boolean) {
            store.commit('setEnabled', { enabled: enabled ? true : false });
        }
        return {
            audio,
            enabled,
            volume,
            setEnabled,
        };
    },
});
</script>
<style scoped>
.content {
    padding: 5px;
}
/**宽高比大于16/9, 按高度决定 */
@media screen and (min-aspect-ratio: 16/9) {
    .content {
        border-style: dashed;
        margin: auto;
        height: calc(100vh - 64px);
        width: calc((100vh - 64px) / 9 * 16);
    }
}
/**宽高比小于16/9, 按宽度决定 */
@media screen and (max-aspect-ratio: 16/9) {
    .content {
        border-style: dashed;
        margin: auto;
        height: calc((100vw - 15px) / 16 * 9);
        width: calc(100vw - 15px);
    }
}
</style>
