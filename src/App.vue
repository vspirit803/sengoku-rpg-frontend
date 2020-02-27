<template>
    <v-app>
        <v-app-bar app color="primary" dark>
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
            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <!-- <v-spacer></v-spacer> -->
            <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
                <span class="mr-2">Latest Release</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import { provide } from '@vue/composition-api';
import { Game } from '@src/Game';
import save001 from '@assets/saves/sav001.json';

console.time('载入游戏配置');
const game = new Game();
console.timeEnd('载入游戏配置');

console.time('载入游戏存档');
game.loadSave(save001);
console.timeEnd('载入游戏存档');
export default createComponent({
    name: 'App',
    setup() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).game = game;
        provide('game', game);
    },
});
</script>
