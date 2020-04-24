<template>
    <div class="about">
        <h1>This is an about page</h1>
        <v-chip>存档版本:{{ version }}</v-chip>
    </div>
</template>
<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api';
import { useGame } from '@/use/useGame';
import { Game } from 'sengoku-rpg-core';

export default defineComponent({
    name: 'About',
    props: {},
    setup() {
        const game = useGame();
        const version = game.generateSave().version;
        return {
            version,
        };
    },
});
</script>
