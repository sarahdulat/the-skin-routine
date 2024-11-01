<template>
  <div class="dropdown-container">
    <!-- Accessible styled select dropdown -->
    <select id="dropdown" class="dropdown-select" v-model="selectedItem" @change="emitSelection">
      <option v-for="(item, index) in items" :key="index" :value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";

export default defineComponent({
  name: "AccessibleDropdown",
  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },
    items: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const selectedItem = ref<string | null>(props.modelValue);

    const emitSelection = () => {
      emit("update:modelValue", selectedItem.value);
    };

    return {
      selectedItem,
      emitSelection,
    };
  },
});
</script>

<style scoped>
/* Dropdown container */
.dropdown-container {
  margin: 0 var(--space-md);
  display: inline;
}

/* Styled select dropdown */
.dropdown-select {
  appearance: none;
  /* Remove native dropdown arrow */
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-text);
  background-color: var(--color-body);
  cursor: pointer;
  position: relative;
  box-shadow: 1px 3px 0 var(--color-text);
}

.dropdown-select:hover {
  background-color: rgba(241, 101, 68, 0.05)
}

/* Add a custom arrow */
.dropdown-select::after {
  content: "▼";
  position: absolute;
  right: var(--space-md);
  pointer-events: none;
}

/* Dropdown arrow custom styling */
.dropdown-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='none' d='M0 0h20v20H0z'/%3E%3Cpath fill='%343A40' d='M5.5 7.5l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-sm) center;
  background-size: var(--space-lg);
}

.dropdown-select:focus {
  outline: none;
}
</style>
