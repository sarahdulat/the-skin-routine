<template>
  <div class="container">
    <RoutineChart :routines="routines" />
    <RoutineSidebar :routines="routines" />
  </div>
</template>

<script>
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
