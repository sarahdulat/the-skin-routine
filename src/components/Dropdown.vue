<template>
  <div class="dropdown" @click="toggleDropdown">
    <!-- Dropdown Button -->
    <button class="dropdown-button">
      {{ selectedItem ? selectedItem : dropdownType }}
      <span :class="dropdownOpen ? 'arrow-up' : 'arrow-down'"></span>
    </button>

    <!-- Dropdown Menu -->
    <ul v-if="dropdownOpen" class="dropdown-menu">
      <li v-for="(item, index) in options" :key="index" @click="selectItem(item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'StyledDropdown',
  props: {
    dropdownType: {
      type: String,
      required: true,
    },
  },
  setup() {
    const dropdownOpen = ref(false); // Controls dropdown visibility
    const selectedItem = ref<string | null>(null); // Stores selected item
    const options = ref<string[]>(["Option 1", "Option 2", "Option 3"]); // Dropdown options

    // Toggle dropdown visibility
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    // Select an item from the dropdown
    const selectItem = (item: string) => {
      selectedItem.value = item;
      dropdownOpen.value = false; // Close the dropdown after selection
    };

    return {
      dropdownOpen,
      selectedItem,
      options,
      toggleDropdown,
      selectItem,
    };
  },
});
</script>

<style scoped>
/* Dropdown Container */
.dropdown {
  position: relative;
  display: inline-block;
  margin: 0 var(--space-md);
}

/* Dropdown Button */
.dropdown-button {
  background-color: var(--color-body);
  color: var(--color-text);
  padding: var(--space-md) var(--space-lg);
  border: var(--color-text) 1px solid;
  box-shadow: 1px 3px 0px var(--color-text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Dropdown Arrow */
.arrow-down::before {
  content: "▼";
  margin-left: 10px;
}

.arrow-up::before {
  content: "▲";
  margin-left: 10px;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  background-color: var(--color-body);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  border-radius: 4px;
  z-index: 1;
}

/* Dropdown Menu Item */
.dropdown-menu li {
  padding: var(--space-md);
  cursor: pointer;
  border-bottom: 1px solid var(--color-text);
}

/* Last item without border */
.dropdown-menu li:last-child {
  border-bottom: none;
}

/* Hover state for dropdown items */
.dropdown-menu li:hover {
  background-color: var(--color-body);
  filter: brightness(99%);
}
</style>
