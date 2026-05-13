<template>
  <div ref="trigger" class="popover-wrapper" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <slot name="trigger"></slot>

    <Teleport to="body">
      <div v-if="isVisible" ref="popover" class="popover" :style="popoverStyle" @click.stop>
        <slot name="content"></slot>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";

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
      popoverStyle: {
        top: "0px",
        left: "0px",
      },
    };
  },
  methods: {
    showPopover() {
      this.isVisible = true;
      this.setPosition();
    },
    hidePopover() {
      this.isVisible = false;
    },
    handleClick(event: MouseEvent) {
      if (this.triggerType === "click") {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
          this.setPosition();
        }
      }
    },
    handleMouseEnter(event: MouseEvent) {
      if (this.triggerType === "hover") {
        this.showPopover();
      }
    },
    handleMouseLeave() {
      if (this.triggerType === "hover") {
        this.hidePopover();
      }
    },
    async setPosition() {
      await nextTick();

      const trigger = this.$refs.trigger as HTMLElement | undefined;
      const popover = this.$refs.popover as HTMLElement | undefined;

      if (!trigger || !popover) return;

      const viewportPadding = 8;
      const offset = 8;
      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const availableRight = window.innerWidth - popoverRect.width - viewportPadding;
      const availableBottom = window.innerHeight - popoverRect.height - viewportPadding;
      const preferredLeft = triggerRect.left;
      const preferredTop = triggerRect.bottom + offset;
      const left = Math.min(Math.max(preferredLeft, viewportPadding), Math.max(availableRight, viewportPadding));
      const top = Math.min(Math.max(preferredTop, viewportPadding), Math.max(availableBottom, viewportPadding));

      this.popoverStyle = {
        top: `${top}px`,
        left: `${left}px`,
      };
    },
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      const popover = this.$refs.popover as HTMLElement | undefined;

      if (!this.$el.contains(target) && !popover?.contains(target)) {
        this.isVisible = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
    window.addEventListener("resize", this.setPosition);
  },
  unmounted() {
    document.removeEventListener("click", this.handleOutsideClick);
    window.removeEventListener("resize", this.setPosition);
  },
});
</script>

<style scoped>
.popover-wrapper {
  display: inline-block;
  position: relative;
}

.popover {
  position: fixed;
  padding: var(--space-lg);
  color: var(--color-light);
  background-color: var(--color-dark);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: var(--space-sm);
  z-index: 10;
  width: min(500px, calc(100vw - 16px));
  max-height: calc(100vh - 16px);
  overflow: auto;
}
</style>
