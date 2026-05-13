<!-- Popover.vue -->
<template>
  <div v-if="visible" ref="popover" class="popover" :style="popoverStyle" @click.stop>
    <slot /> <!-- You can pass custom content to the popover -->
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch, PropType } from "vue";

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
    const popover = ref<HTMLElement | null>(null);
    const popoverStyle = ref({
      left: "0px",
      top: "0px",
    });

    const updatePosition = async () => {
      await nextTick();

      if (!popover.value) return;

      const offset = 12;
      const viewportPadding = 8;
      const { width, height } = popover.value.getBoundingClientRect();
      const availableRight = window.innerWidth - width - viewportPadding;
      const availableBottom = window.innerHeight - height - viewportPadding;
      const preferredLeft = props.position.x + offset;
      const preferredTop = props.position.y + offset;
      const left = Math.min(Math.max(preferredLeft, viewportPadding), Math.max(availableRight, viewportPadding));
      const top = Math.min(Math.max(preferredTop, viewportPadding), Math.max(availableBottom, viewportPadding));

      popoverStyle.value = {
        left: `${left}px`,
        top: `${top}px`,
      };
    };

    watch(() => [props.position.x, props.position.y, props.visible], updatePosition, { immediate: true });

    return {
      popover,
      popoverStyle,
    };
  },
});
</script>

<style scoped>
.popover {
  position: fixed;
  color: var(--color-light);
  background: var(--color-dark);
  border: 1px solid var(--color-dark);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: min(320px, calc(100vw - 16px));
}
</style>
