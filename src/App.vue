<template>
  <v-app class="app" @click.native.capture.once="startVolume">
    <v-app-bar app color="primary" dark>
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
    <v-main>
      <v-responsive class="content" :aspect-ratio="16 / 9">
        <keep-alive exclude="Battle"> <router-view></router-view></keep-alive>
      </v-responsive>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import save001 from '@assets/saves/sav001.json';
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import { Game, GameSave } from 'sengoku-rpg-core';

import { provideGame, provideStore, useStore } from '@/use';

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
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).game = game;
    const audio: Ref<HTMLAudioElement | undefined> = ref(undefined);
    provideGame(game);
    provideStore();
    const store = useStore();
    onMounted(() => {
      store.commit('setAudio', { audio: audio.value });
      store.commit('setVolume', { volume: store.state.settings.bgm.volume });
    });
    function startVolume() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { audio, enabled } = store.state.settings.bgm;
      // if (enabled) {
      //     audio!.play();
      // }
    }
    return {
      audio,
      startVolume,
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
