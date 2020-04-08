<template>
    <div class="illustration">
        <v-tabs v-model="currTab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="`#tab-characters`">人物 {{ characterUnlockRatio }}</v-tab>
            <v-tab :href="`#tab-enemies`">敌人</v-tab>
        </v-tabs>
        <v-tabs-items v-model="currTab">
            <v-tab-item class="tab-characters" value="tab-characters">
                <vue-custom-scrollbar class="my-scroll-bar">
                    <div flat tile class="characters-container">
                        <IllustrationCharacter
                            class="character"
                            v-for="eachCharacter of characters"
                            :key="eachCharacter.id"
                            :character="eachCharacter"
                        >
                        </IllustrationCharacter>
                    </div>
                </vue-custom-scrollbar>
            </v-tab-item>
            <v-tab-item class="tab-enemies" value="tab-enemies">
                <v-card flat tile>啦啦啦啦啦 </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script lang="ts">
import { createComponent, inject, ref } from '@vue/composition-api';
import { Game } from '@src/Game';
import IllustrationCharacter from '@/components/IllustrationCharacter.vue';
import vueCustomScrollbar from 'vue-custom-scrollbar';
export default createComponent({
    name: 'Illustration',
    components: { IllustrationCharacter, vueCustomScrollbar },
    setup() {
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
        const allCharacters = game.characterCenter.charactersConfiguration.filter((eachCharacter) =>
            eachCharacter.id.startsWith('C'),
        );
        const characters = allCharacters.map((eachCharacter) => {
            const unlocked = game.characterCenter.charactersMap.has(eachCharacter.id);
            return { ...eachCharacter, unlocked };
        });
        const currTab = ref('tab-characters');

        const characterUnlockRatio =
            ((characters.filter((eachCharacter) => eachCharacter.unlocked).length / characters.length) * 100).toFixed(
                2,
            ) + '%';

        return {
            characters,
            currTab,
            characterUnlockRatio,
        };
    },
});
</script>
<style scoped>
.characters-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.my-scroll-bar {
    width: 100%;
    height: 100%;
}
.character {
    position: relative;
    width: calc(100% / 8);
    flex-wrap: wrap;
    flex-grow: 0;
    border-style: solid;
}
.illustration {
    height: 100%;
}
.tab-characters {
    height: calc(100vh - 64px - 48px);
}
</style>
<style>
.illustration .ps__rail-y {
    z-index: 5;
}
.illustration .ps__thumb-y {
    background-color: black;
}
</style>
