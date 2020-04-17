<template>
    <v-tooltip v-if="item" bottom>
        <template v-slot:activator="{ on }">
            <div v-on="on" class="item">
                <span dark> {{ item.name }}</span>
                <span v-if="item.count !== 1" class="item-num">{{ item.count }}</span>
            </div>
        </template>
        <span> {{ item.name }}*{{ item.count }}</span>
    </v-tooltip>
    <div v-else class="item"></div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { ItemType, ItemBase, ItemSystem } from 'sengoku-rpg-core';

interface Data {
    item: ItemBase | null;
}
export default defineComponent({
    name: 'Item',
    components: {},
    props: { item: Object },
    setup(props: Data) {
        const item = props.item;
        return {};
    },
});
</script>
<style scoped>
.item-common {
    border-color: #b0c3d9;
}
.item-rare {
    border-color: #5e98d9;
}
.item-mythical {
    border-color: #8847ff;
}
.item-legendary {
    border-color: #d32ce6;
}
.item-ancient {
    border-color: #eb4b4b;
}
.item-immortal {
    border-color: #e4ae33;
}
.item {
    width: 64px;
    height: 64px;
    margin: 2px;
    position: relative;

    border-width: 3px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    /* box-sizing: content-box; */
}
.item-none {
    border-width: 1px;
    border-style: dotted;
}
.item-num {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: scale(0.8);
}
</style>
