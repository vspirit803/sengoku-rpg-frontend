<template>
    <v-responsive :aspect-ratio="3 / 4" v-if="!character.unlocked" class="illustration-character">
        <div style="width:100%; height:100%;" class="d-flex justify-center align-center">
            <v-overlay absolute :value="true"> </v-overlay>
            <span v-text="name"></span>
            <v-icon x-large>mdi-lock</v-icon>
        </div>
    </v-responsive>

    <!-- <div v-if="!character.unlocked" class="illustration-character d-flex justify-center align-center">
        <v-overlay absolute :value="true"> </v-overlay>
        <v-icon x-large>mdi-lock</v-icon>
    </div> -->

    <div v-else class="illustration-character">
        <v-hover v-slot:default="{ hover }" :close-delay="80">
            <v-img max-height="100%" :src="imageUrl" lazy-src="assets/images/C9999.png">
                <v-fade-transition>
                    <h1 v-if="!hover" class="character-name transition-slow-in-fast-out">
                        {{ character.name }}
                    </h1>
                </v-fade-transition>
                <v-expand-transition>
                    <div v-if="hover" class="property-panel transition-fast-in-fast-out grey white--text">
                        <h2 class="text-center">{{ character.name }}</h2>
                        <div
                            v-for="eachProperty in Object.keys(character.properties)"
                            :key="eachProperty"
                            class="property"
                        >
                            <span style="width:40%; display:inline-block;">
                                <v-icon :color="getPropertyColor(eachProperty)">
                                    {{ getPropertyIcon(eachProperty) }}
                                </v-icon>
                                {{ getPropertyName(eachProperty) }}
                            </span>
                            <span class="text-right" style="width:20%; display:inline-block;">
                                {{ getPropertyBaseValue(eachProperty) }}
                            </span>
                            <span
                                style="display:inline-block;"
                                v-if="character.properties[eachProperty].increaseValue !== 0"
                            >
                                + {{ character.properties[eachProperty].increaseValue }}/级
                            </span>
                        </div>
                    </div>
                </v-expand-transition>
            </v-img>
        </v-hover>
    </div>
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api';
import { CharacterConfiguration } from '@src/Character';
import propertiesName from '@assets/configurations/properties.json';

type Property = 'atk' | 'def' | 'critRate' | 'critMultiply' | 'missRate' | 'hp' | 'speed';

interface Data {
    character: CharacterConfiguration & { unlocked: boolean };
}

export default createComponent({
    name: 'IllustrationCharacter',
    props: { character: Object },
    setup(props: Data) {
        const character = props.character;
        const imageUrl = 'assets/images/' + character.id + '.png';

        function getPropertyBaseValue(property: Property): string {
            const value = character.properties[property].baseValue;
            let valueStr: string;
            if (propertiesName[property].format === 'percent') {
                valueStr = value * 100 + '%';
            } else {
                valueStr = value.toString();
            }
            return valueStr;
        }
        return {
            getPropertyBaseValue,
            imageUrl,
            name: character.name,
            getPropertyName(property: Property): string {
                return propertiesName[property].text;
            },
            getPropertyIcon(property: Property): string {
                return propertiesName[property].icon;
            },
            getPropertyColor(property: Property): string {
                return propertiesName[property].color;
            },
        };
    },
});
</script>
<style scoped>
.character-name {
    writing-mode: vertical-lr;
    width: 40px;
}
.property-panel {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0px;
    opacity: 0.85;
}
.property {
    white-space: pre;
}
.illustration-character {
    position: relative;
    z-index: 1;
    /* height: 403px;
    width: 303px; */
    box-sizing: border-box;
    flex-wrap: wrap;
    border-style: solid;
    border-width: 1.5px;
}
</style>
