<template>
  <main>
    <RoutineChart :routines="routines" />
    <RoutineSidebar :routines="routines" />
  </main>
</template>

<script lang="ts" setup>
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";
import routines from '../assets/routines.json'

</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 0 1rem;
}
</style>
