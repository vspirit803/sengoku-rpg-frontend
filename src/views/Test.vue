<template>
    <div>
        <div class="test">
            <div class="left" :style="style"></div>
            <div class="right"></div>
        </div>
        <v-slider v-model="value" min="0" max="100"></v-slider>
        <!-- <span abc~></span> -->
        <!-- <span abc@></span> -->
        <!-- <span abc#></span> -->
        <!-- <span abc$></span> -->
    </div>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api';
export default defineComponent({
    name: 'Test',
    components: {},
    setup() {
        const value = ref(0);
        const style = computed(() => {
            return {
                'clip-path': `ellipse(${Math.round((value.value / 100) * 300 * 2)}px ${Math.round(
                    (value.value / 100) * 150 * 2,
                )}px at 00% 00%)`,
            };
        });
        return { value, style };
    },
});
</script>
<style scoped>
.test {
    position: relative;
    width: 1080px;
    height: 720px;
    background-color: chartreuse;
}
.left {
    position: absolute;
    left: 0;
    top: 0;
    width: 300px;
    height: 150px;
    z-index: 2;
    background-color: blue;
}
.right {
    position: absolute;
    left: 0;
    top: 0;
    width: 300px;
    height: 150px;
    z-index: 1;
    background-color: red;
}
</style>
