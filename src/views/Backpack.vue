<template>
    <div class="backpack">
        <v-tabs v-model="currTab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="`#equipment`">装备</v-tab>
            <v-tab :href="`#system`">系统</v-tab>
            <v-tab-item value="equipment">
                <div class="items-container">
                    <Item v-for="eachItem of equipments" :key="eachItem.uuid" :item="eachItem" />
                    <template v-if="equipments.length < size">
                        <Item
                            v-for="eachIndex of size - equipments.length"
                            :key="getNullSymbol(eachIndex)"
                            :item="null"
                        />
                    </template>
                </div>
            </v-tab-item>
            <v-tab-item value="system">
                <div class="items-container">
                    <Item v-for="eachItem of systemItems" :key="eachItem.uuid" :item="eachItem" />
                    <template v-if="systemItems.length < size">
                        <Item
                            v-for="eachIndex of size - systemItems.length"
                            :key="getNullSymbol(eachIndex)"
                            :item="null"
                        />
                    </template>
                </div>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script lang="ts">
import { createComponent, ref, Ref, computed, onActivated } from '@vue/composition-api';
import { useGame } from '@/use/useGame';
import { ItemType, ItemBase, ItemSystem, ItemEquipment } from 'sengoku-rpg-core';
import Item from '@/components/Item.vue';

export default createComponent({
    name: 'Backpack',
    components: { Item },
    setup() {
        const game = useGame();
        const currTab = ref('system');
        const allItems: Ref<Array<ItemBase>> = ref([]);
        const systemItems = computed(() => {
            return allItems.value.filter((each) => each.type === ItemType.System) as Array<ItemSystem>;
        });
        const equipments = computed(() => {
            return game.backpack.equipmentCenter.equipments;
        });

        const items = computed(() => {
            if (currTab.value === 'system') {
                return systemItems;
            }
            if (currTab.value === 'equipment') {
                return equipments;
            }
            return [];
        });

        onActivated(() => {
            allItems.value = game.backpack.items.map((each) => {
                return { ...each };
            });
        });

        return {
            currTab,
            systemItems,
            equipments,
            items,
            size: 100,
            getNullSymbol() {
                return Symbol('null');
            },
        };
    },
});
</script>
<style scoped>
.backpack {
    scroll-behavior: smooth;
}
.items-container {
    width: 560px;
    padding: 0;
    box-sizing: content-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
</style>
