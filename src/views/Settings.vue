<template>
    <div class="settings">
        <v-sheet :width="400" class="settings-item">
            <v-chip>
                背景音乐
            </v-chip>
            <v-checkbox style="margin: 0;" v-model="enabled" @change="setEnabled"> </v-checkbox>
            <v-slider
                :disabled="!enabled"
                append-icon="mdi-volume-plus"
                prepend-icon="mdi-volume-minus"
                thumb-label
                v-model="volume"
                :min="0"
                :max="100"
                @change="setVolume"
            />
        </v-sheet>
    </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, watch } from '@vue/composition-api';

import { useStore } from '@/use';

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
        onBeforeUnmount(() => {
            store.commit('setEnabled', { enabled: false });
        });
        function setEnabled(enabled: boolean) {
            store.commit('setEnabled', { enabled: enabled ? true : false });
        }
        function setVolume(volume: number) {
            store.commit('setVolume', { volume });
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
<style scoped>
.settings-item {
    margin-top: 32px;
    display: flex;
    align-items: top;
}
</style>