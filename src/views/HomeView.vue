<template>
  <main>
    <RoutineChart :routines="routines" />
    <RoutineSidebar :routines="routines" />
  </main>
</template>

<script lang="ts">
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";

import routines from '../assets/routines.json'

export default {
  name: "App",
  components: {
    RoutineChart,
    RoutineSidebar
  },
  data() {
    return {
      routines: routines,
    };
  },
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 0 1rem;
}
</style>
