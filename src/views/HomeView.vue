<template>
  <div class="container">
    <RoutineChart />
    <RoutineSidebar />
  </div>
</template>

<script>
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";

export default {
  name: "App",
  components: {
    RoutineChart,
    RoutineSidebar
  }
};
</script>
