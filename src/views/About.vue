<template>
    <div class="about">
        <h1>This is an about page</h1>
        <v-chip>存档版本:{{ version }}</v-chip>
    </div>
</template>
<script lang="ts">
import { createComponent, inject } from '@vue/composition-api';
import { Game } from '@src/Game';

export default createComponent({
    name: 'About',
    props: {},
    setup() {
        if (!inject('game')) {
            throw new Error('没有获取到Game实例');
        }
        const game = inject('game') as Game;
        const version = game.generateSave().version;
        return {
            version,
        };
    },
});
</script>
