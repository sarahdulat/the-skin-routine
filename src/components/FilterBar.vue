<template>
  <div class="filter">
    <h6>Filters:</h6>
    <Dropdown v-for="dropdown in dropdowns" :defaultValue="dropdown.defaultValue" :items="dropdown.items" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown from './Dropdown.vue';

export default defineComponent({
  components: { Dropdown },
  props: {
    dropdowns: {
      type: Array as PropType<{ defaultValue: string, items: Array<string> }[]>,
      required: false,
      default: null,
    }
  }
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
