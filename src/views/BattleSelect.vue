<template>
    <div class="battle-select">
        <v-banner single-line>选择战役</v-banner>
        <v-item-group v-model="battleId" mandatory>
            <v-container>
                <v-row>
                    <v-col v-for="each of battles" :key="each.id" cols="12" md="4">
                        <v-item v-slot:default="{ active, toggle }" :value="each.id">
                            <v-card
                                :color="active ? 'primary' : ''"
                                class="d-flex align-center"
                                dark
                                height="100"
                                @click="toggle"
                            >
                                <h1>{{ each.name }}</h1>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
        <v-banner single-line>选择参战队伍</v-banner>
        <v-item-group v-model="teamName" mandatory>
            <v-container>
                <v-row>
                    <v-col v-for="each of teams" :key="each.uuid" cols="12" md="3">
                        <v-item v-slot:default="{ active, toggle }" :value="each.name">
                            <v-card
                                :color="active ? 'primary' : ''"
                                class="d-flex align-center"
                                dark
                                height="100"
                                @click="toggle"
                            >
                                <h1>{{ each.name }}</h1>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
        <v-btn @click="startBattle">开始战斗</v-btn>
        <v-snackbar v-model="showSnackbar" :top="true">
            {{ snackbarText }}
            <v-btn dark text @click="showSnackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@vue/composition-api';

import router from '@/router';
import { useGame } from '@/use';
export default defineComponent({
    name: 'BattleSelect',
    setup() {
        const game = useGame();
        const battleId = ref('');
        const teamName: Ref<string> = ref('');
        const showSnackbar = ref(false);
        const snackbarText = ref('');
        const battles = game.battleCenter.battles.map(({ id, name }) => ({ id, name }));
        const teams = game.teamCenter.teams.map(({ name, uuid }) => ({ name, uuid }));
        function startBattle() {
            if (!battleId.value) {
                snackbarText.value = '请选择战斗';
                showSnackbar.value = true;
                return;
            }
            const battleRouterProps = { battleId: battleId.value, teamName: teamName.value };
            router.push({ name: 'battle', params: battleRouterProps });
        }
        return { battles, teamName, teams, battleId, startBattle, showSnackbar, snackbarText };
    },
});
</script>
<style scoped></style>
