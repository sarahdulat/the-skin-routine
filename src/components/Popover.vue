<!-- Popover.vue -->
<template>
  <div v-if="visible" class="popover" :style="popoverStyle" @click.stop>
    <slot /> <!-- You can pass custom content to the popover -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";

export default defineComponent({
  name: "Popover",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Object as PropType<{ x: number; y: number }>,
      required: true,
    },
  },
  setup(props) {
    const popoverStyle = ref({
      left: `${props.position.x}px`,
      top: `${props.position.y}px`,
    });

    watch(() => props.position, (newPos) => {
      popoverStyle.value = {
        left: `${newPos.x}px`,
        top: `${newPos.y}px`,
      };
    });

    return {
      popoverStyle,
    };
  },
});
</script>

<style scoped>
.popover {
  position: absolute;
  color: var(--color-body);
  background: var(--color-text);
  border: 1px solid #ccc;
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
