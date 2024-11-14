<template>
  <div class="toggle-switch" :class="{ 'toggle-on': isOn }" role="switch" :aria-checked="isOn" tabindex="0"
    @click="toggle" @keydown.space.prevent="toggle" @keydown.enter.prevent="toggle">
    <div class="toggle-knob"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomToggle",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isOn: this.modelValue, // Initialize isOn with the modelValue prop
    };
  },
  watch: {
    // Watch for changes in modelValue from the parent and update isOn
    modelValue(newValue: boolean) {
      this.isOn = newValue;
    },
  },
  methods: {
    toggle() {
      this.isOn = !this.isOn;
      this.$emit("update:modelValue", this.isOn); // Emit the new value to the parent
    },
  },
});
</script>

<style scoped>
.toggle-switch {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 4px 2px 5px;
  transition: background-color 0.3s;
  vertical-align: sub;
}

.toggle-switch.toggle-on {
  background-color: var(--color-link);
}

.toggle-knob {
  width: 15px;
  height: 15px;
  background-color: var(--color-body);
  border-radius: 50%;
  position: absolute;
  left: 2px;
  transition: left 0.3s;
}

.toggle-switch.toggle-on .toggle-knob {
  left: 23px;
}
</style>
