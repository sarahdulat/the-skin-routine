<script setup lang="ts">
import Dropdown from './Dropdown.vue';
</script>

<template>
  <div class="filter">
    <h6>Filters:</h6>
    <Dropdown dropdownType="Age Range: All" />
    <Dropdown dropdownType="Skin Concern: All" />
  </div>
</template>

<style lang="scss" scoped>
.filter {
  position: sticky;
  top: 85px;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-text);

  h6 {
    display: inline;
  }

}
</style>
