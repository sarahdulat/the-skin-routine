<template>
  <main>
    <div class="chart">
      <FilterBar :dropdowns="[age_range, skin_concern]" />
      <RoutineChart :routines="routines" />
    </div>
    <RoutineSidebar :routines="routines" />
  </main>
</template>

<script lang="ts">
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";
import routines from '../assets/routines.json'
import FilterBar from "../components/FilterBar.vue";

export default {
  name: 'home',
  components: {
    FilterBar,
    RoutineSidebar,
    RoutineChart
  },
  data() {
    return {
      routines: routines,
      age_range: { defaultValue: 'Age Range', items: ['20s', '30s', '40s', '50s', '60s', '70s'] },
      skin_concern: { defaultValue: 'Skin Concern', items: ['Acne Prone', 'Fine Lines & Wrinkles', 'Dry Skin', 'Sensitive'] }
    }
  }
}

</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
}
</style>
