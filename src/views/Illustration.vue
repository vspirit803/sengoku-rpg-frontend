<template>
    <div class="illustration">
        <v-tabs v-model="currTab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="`#tab-characters`">人物 {{ characterUnlockRatio }}</v-tab>
            <v-tab :href="`#tab-enemies`">敌人</v-tab>
            <v-tab :href="`#tab-equipments`">装备</v-tab>
            <v-tab :href="`#tab-events`">事件</v-tab>
        </v-tabs>
        <v-tabs-items v-model="currTab">
            <v-tab-item class="tab-content tab-characters" value="tab-characters">
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
            <v-tab-item class="tab-content tab-enemies" value="tab-enemies">
                <v-card flat tile>敌人图鉴 </v-card>
            </v-tab-item>
            <v-tab-item class="tab-content tab-equipments" value="tab-equipments">
                <v-card flat tile>装备图鉴 </v-card>
            </v-tab-item>
            <v-tab-item class="tab-content tab-events" value="tab-events">
                <v-card flat tile>事件图鉴 </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api';
import IllustrationCharacter from '@/components/IllustrationCharacter.vue';
import vueCustomScrollbar from 'vue-custom-scrollbar';
import { useCharacterCenter } from '@/use';
export default createComponent({
    name: 'Illustration',
    components: { IllustrationCharacter, vueCustomScrollbar },
    setup() {
        const characterCenter = useCharacterCenter();
        const allCharacters = characterCenter.charactersConfiguration.filter((eachCharacter) =>
            eachCharacter.id.startsWith('C'),
        );
        const characters = allCharacters.map((eachCharacter) => {
            const unlocked = characterCenter.charactersMap.has(eachCharacter.id);
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
}
.my-scroll-bar {
    width: 100%;
    height: 100%;
}
.character {
    position: relative;
    width: calc(100% / 6);
    flex-wrap: wrap;
    flex-grow: 0;
    border-style: solid;
}
.illustration {
    height: 100%;
}
.tab-content {
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
