<template>
    <div class="settings">
        <v-checkbox v-model="checkbox" :label="`Checkbox 1: ${checkbox.toString()}`"></v-checkbox>
        背景音乐<v-switch style="display: inline-block;" v-model="enabled" @change="setEnabled" />
        <v-slider
            :disabled="!enabled"
            thumb-label
            style="width: 300px; display: inline-block;"
            v-model="volume"
            :min="0"
            :max="100"
            @change="setVolume"
        />
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, Ref, ref, watch } from '@vue/composition-api';

import { provideGame, useStore } from '@/use';

export default defineComponent({
    name: 'Settings',
    props: {},
    setup() {
        const store = useStore();
        const enabled = ref(store.state.settings.bgm.enabled);
        const audio = store.state.settings.bgm.audio!;
        const volume = ref(store.state.settings.bgm.volume);
        watch(enabled, (newVal) => {
            if (newVal) {
                audio.play();
            } else {
                audio.pause();
            }
        });
        watch(volume, (newVal) => {
            audio.volume = newVal / 100;
        });
        onBeforeUnmount(() => {
            store.commit('setEnabled', { enabled: false });
        });
        function setEnabled(enabled: boolean) {
            store.commit('setEnabled', { enabled: enabled ? true : false });
        }
        function setVolume(volume: number) {
            console.log(volume);
            store.commit('setVolume', { volume: volume / 100 });
        }
        return {
            enabled,
            setEnabled,
            volume,
            setVolume,
        };
    },
});
</script>
