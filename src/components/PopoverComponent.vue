<template>
  <div class="popover-wrapper" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <slot name="trigger"></slot>

    <div v-if="isVisible" class="popover" :style="{ top: `${position.top}px`, left: `${position.left}px` }">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PopoverComponent",
  props: {
    triggerType: {
      type: String,
      default: "hover",
      validator: (value: string) => ["hover", "click"].includes(value),
    },
  },
  data() {
    return {
      isVisible: false,
      position: {
        top: 35,
        left: 0,
      },
    };
  },
  methods: {
    showPopover() {
      this.isVisible = true;
    },
    hidePopover() {
      this.isVisible = false;
    },
    handleClick(event: MouseEvent) {
      if (this.triggerType === "click") {
        this.isVisible = !this.isVisible;
        // this.setPosition(event);
      }
    },
    handleMouseEnter(event: MouseEvent) {
      if (this.triggerType === "hover") {
        this.showPopover();
        // this.setPosition(event);
      }
    },
    handleMouseLeave() {
      if (this.triggerType === "hover") {
        this.hidePopover();
      }
    },
    setPosition(event: MouseEvent) {
      const target = event.currentTarget as HTMLElement;
      if (target) {
        const { top, left, height } = target.getBoundingClientRect();
        this.position = {
          top: top + height + window.scrollY, // Offset to place below the trigger
          left: left + window.scrollX,
        };
      }
    },
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!this.$el.contains(target)) {
        this.isVisible = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  unmounted() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
});
</script>

<style scoped>
.popover-wrapper {
  display: inline-block;
  position: relative;
}

.popover {
  position: absolute;
  padding: var(--space-lg);
  color: var(--color-light);
  background-color: var(--color-dark);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: var(--space-sm);
  z-index: 10;
  width: 500px;
}
</style>
