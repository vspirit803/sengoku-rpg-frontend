<template>
  <div class="battle-success-condition">{{ conditionDescription }}</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Condition } from 'sengoku-rpg-core';

type Data = { condition: Condition };

/**
 * 战斗胜利条件
 */
export default defineComponent({
  name: 'BattleSuccessCondition',
  props: { condition: Object },
  setup(props: Data) {
    const { condition } = props;
    const conditionDescription = condition.getFormatedDescription();
    return { conditionDescription };
  },
});
</script>
<style scoped>
.battle-success-condition {
  white-space: pre-wrap;
}
</style>
