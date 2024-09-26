<template>
  <main>
    <div class="chart">
      <FilterBar />
      <RoutineChart :routines="routines" />
    </div>
    <RoutineSidebar :routines="routines" />
  </main>
</template>

<script lang="ts" setup>
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";
import routines from '../assets/routines.json'
import FilterBar from "../components/FilterBar.vue";

</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
}
</style>
