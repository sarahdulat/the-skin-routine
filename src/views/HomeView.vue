<template>
  <main>
    <div class="chart">
      <h1 v-if="!isRoutinePage" class="visually-hidden">Find Your Skincare Routine</h1>
      <FilterBar :dropdowns="[age_range, skin_concern]" v-model:pregnancy-safe-only="pregnancySafeOnly" />
      <RoutineChart :routines="filteredRoutines" />
    </div>
    <RoutineSidebar :is-routine-page="isRoutinePage" :not-found="isInvalidRoutinePage" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { LocationQueryValue, RouteLocationNormalizedLoaded } from "vue-router";
import RoutineChart from "../components/RoutineChart.vue";
import RoutineSidebar from "../components/RoutineSidebar.vue";
import routines from '../assets/routines.json'
import FilterBar from "../components/FilterBar.vue";
import { store, Routine } from "../store";
import { findRoutineBySlugOrId, newestRoutine, withoutRoutineSelection } from "../routines";

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

const getRoutineSlugFromQuery = (value: LocationQueryValue | LocationQueryValue[]) => {
  return getSelectedQueryValue(value) ?? null;
};

const getRoutineSlugFromRoute = (route: RouteLocationNormalizedLoaded) => {
  const routeRoutineSlug = Array.isArray(route.params.routineSlug) ? route.params.routineSlug[0] : route.params.routineSlug;

  if (routeRoutineSlug) return routeRoutineSlug;

  return getRoutineSlugFromQuery(route.query.routine);
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
    isRoutinePage(): boolean {
      return this.$route.name === "routine";
    },
    publishedRoutines(): Routine[] {
      return this.routines.filter((routine) => !routine.draft);
    },
    selectedRoutineSlug(): string | null {
      return getRoutineSlugFromRoute(this.$route);
    },
    isInvalidRoutinePage(): boolean {
      return this.isRoutinePage
        && Boolean(this.selectedRoutineSlug)
        && !findRoutineBySlugOrId(this.publishedRoutines, this.selectedRoutineSlug);
    },
    filteredRoutines(): Routine[] {
      const selectedAgeRange = getSelectedQueryValue(this.$route.query["Age Range"]);
      const selectedSkinConcernLabel = getSelectedQueryValue(this.$route.query["Skin Concern"]);
      const selectedSkinConcern = selectedSkinConcernLabel ? skinConcernValueByLabel[selectedSkinConcernLabel] : null;

      return this.publishedRoutines.filter((routine) => {
        return matchesFilter(routine.age_range, selectedAgeRange)
          && matchesFilter(routine.skin_concern, selectedSkinConcern)
          && (!this.pregnancySafeOnly || routine.pregnancy_safe);
      });
    },
  },
  watch: {
    filteredRoutines: {
      handler(filteredRoutines: Routine[]) {
        if (this.isInvalidRoutinePage) {
          store.setCurrentRoutine(null);
          return;
        }

        const selectedRoutine = findRoutineBySlugOrId(filteredRoutines, this.selectedRoutineSlug);

        if (selectedRoutine) {
          store.setCurrentRoutine(selectedRoutine);
          return;
        }

        if (this.selectedRoutineSlug) {
          this.$router.replace({
            name: "home",
            query: withoutRoutineSelection({ ...this.$route.query }),
          });
        }

        if (filteredRoutines.length === 0) {
          store.setCurrentRoutine(null);
          return;
        }

        if (!store.currentRoutine || !filteredRoutines.some((routine) => routine.id === store.currentRoutine?.id)) {
          store.setCurrentRoutine(newestRoutine(filteredRoutines));
        }
      },
      immediate: true,
    },
    selectedRoutineSlug() {
      if (this.isInvalidRoutinePage) {
        store.setCurrentRoutine(null);
        return;
      }

      const selectedRoutine = findRoutineBySlugOrId(this.filteredRoutines, this.selectedRoutineSlug);

      if (selectedRoutine) {
        store.setCurrentRoutine(selectedRoutine);
      } else if (!store.currentRoutine && this.filteredRoutines.length > 0) {
        store.setCurrentRoutine(newestRoutine(this.filteredRoutines));
      }
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

@media (max-width: 768px) {
  main {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .chart {
    grid-template-rows: auto 28rem;
    min-height: auto;
    overflow: visible;
  }
}
</style>
