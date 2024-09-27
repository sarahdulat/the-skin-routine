<template>
  <div class="filter">
    <h6>Filters:</h6>
    <Dropdown v-model="selectedOption" :items="dropdownItems" />
    <Dropdown v-model="selectedOption" :items="dropdownItems" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Dropdown from './Dropdown.vue';

export default defineComponent({
  components: { Dropdown },
  setup() {
    const selectedOption = ref<string>("All"); // Default value for the dropdown
    const dropdownItems = ref(["All", "Option 1", "Option 2", "Option 3"]); // Dropdown options

    return {
      selectedOption,
      dropdownItems,
    };
  },
});
</script>


<style lang="scss" scoped>
.filter {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-text);
  background-color: var(--color-body);

  h6 {
    display: inline;
  }

}
</style>
