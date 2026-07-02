<template>
  <main>
    <div class="chart">
      <FilterBar :dropdowns="[age_range, skin_concern]" v-model:pregnancy-safe-only="pregnancySafeOnly" />
      <RoutineChart :routines="filteredRoutines" />
    </div>
    <RoutineSidebar :routines="routines" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { LocationQueryValue } from "vue-router";
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";
import routines from '../assets/routines.json'
import FilterBar from "../components/FilterBar.vue";
import { store, Routine } from "../store";

const skinConcernValueByLabel: Record<string, string> = {
  "Acne Prone": "acne_prone",
  "Fine Lines & Wrinkles": "fine_lines_and_wrinkles",
  "Dry Skin": "dry_skin",
  "Sensitive": "sensitive",
  "Dark Spots & Sun Damage": "dark_spots_and_sun_damage",
};

const getSelectedQueryValue = (value: LocationQueryValue | LocationQueryValue[]) => {
  return Array.isArray(value) ? value[0] : value;
};

const matchesFilter = (routineValues: string[], selectedValue: string | null | undefined) => {
  return selectedValue == null || selectedValue === "all" || routineValues.includes(selectedValue);
};

export default defineComponent({
  name: 'home',
  components: {
    FilterBar,
    RoutineSidebar,
    RoutineChart
  },
  data() {
    return {
      routines,
      pregnancySafeOnly: false,
      age_range: { defaultValue: 'Age Range', items: ['20s', '30s', '40s', '50s', '60s', '70s', '80s'] },
      skin_concern: { defaultValue: 'Skin Concern', items: ['Acne Prone', 'Fine Lines & Wrinkles', 'Dry Skin', 'Sensitive', 'Dark Spots & Sun Damage'] }
    }
  },
  computed: {
    filteredRoutines(): Routine[] {
      const selectedAgeRange = getSelectedQueryValue(this.$route.query["Age Range"]);
      const selectedSkinConcernLabel = getSelectedQueryValue(this.$route.query["Skin Concern"]);
      const selectedSkinConcern = selectedSkinConcernLabel ? skinConcernValueByLabel[selectedSkinConcernLabel] : null;

      return this.routines.filter((routine) => {
        return matchesFilter(routine.age_range, selectedAgeRange)
          && matchesFilter(routine.skin_concern, selectedSkinConcern)
          && (!this.pregnancySafeOnly || routine.pregnancy_safe);
      });
    },
  },
  watch: {
    filteredRoutines: {
      handler(filteredRoutines: Routine[]) {
        if (filteredRoutines.length > 0 && !filteredRoutines.some((routine) => routine.id === store.currentRoutine.id)) {
          store.setCurrentRoutine(filteredRoutines[0]);
        }
      },
      immediate: true,
    },
  }
});

</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.chart {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
