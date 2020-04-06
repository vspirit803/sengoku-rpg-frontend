<template>
    <div class="illustration">
        <v-tabs v-model="currTab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="`#tab-characters`">人物 {{ characterUnlockRatio }}</v-tab>
            <v-tab :href="`#tab-enemies`">敌人</v-tab>
            <v-tab-item class="tab-characters" value="tab-characters">
                <GeminiScrollbar class="my-scroll-bar">
                    <div flat tile class="characters-container">
                        <IllustrationCharacter
                            class="character"
                            v-for="eachCharacter of characters"
                            :key="eachCharacter.id"
                            :character="eachCharacter"
                        >
                        </IllustrationCharacter>
                    </div>
                </GeminiScrollbar>
            </v-tab-item>
            <v-tab-item value="tab-enemies">
                <v-card flat tile> </v-card>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script lang="ts">
import { createComponent, inject } from '@vue/composition-api';
import { Game } from '@src/Game';
import IllustrationCharacter from '@/components/IllustrationCharacter.vue';

export default createComponent({
    name: 'Illustration',
    components: { IllustrationCharacter },
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

        const characterUnlockRatio =
            ((characters.filter((eachCharacter) => eachCharacter.unlocked).length / characters.length) * 100).toFixed(
                2,
            ) + '%';

        return {
            characters,
            currTab: 'tab-characters',
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
