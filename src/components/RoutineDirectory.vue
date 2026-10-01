<template>
  <details ref="directory" class="routine-directory">
    <summary class="directory-toggle type-ui-label" aria-label="Browse routine directory">
      <i class="bi bi-card-list directory-mobile-icon" aria-hidden="true"></i>
      <span class="directory-desktop-label">Routine Directory</span>
      <span class="directory-mobile-label">Routines</span>
    </summary>

    <div class="directory-menu">
      <div class="category-filters" aria-label="Filter routine directory">
        <button type="button" :class="{ active: activeCategory === null }" @click="activeCategory = null">
          All
        </button>
        <button v-for="category in routineDirectoryCategories" :key="category.value" type="button"
          :class="{ active: activeCategory === category.value }" @click="activeCategory = category.value">
          {{ category.label }}
        </button>
      </div>

      <nav class="routine-links" aria-label="Routine directory">
        <router-link v-for="routine in visibleRoutines" :key="routine.id"
          :to="{ name: 'routine', params: { routineSlug: routineSlug(routine) } }" @click="selectRoutine">
          {{ routine.routine_name }}
        </router-link>
      </nav>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Routine } from "../store";
import {
  matchesRoutineDirectoryCategory,
  routineDirectoryCategories,
  routineSlug,
  type RoutineDirectoryCategory,
} from "../routines";

const props = defineProps<{
  routines: Routine[];
}>();

const emit = defineEmits<{
  select: [];
}>();

const directory = ref<HTMLDetailsElement | null>(null);
const activeCategory = ref<RoutineDirectoryCategory | null>(null);

const visibleRoutines = computed(() => props.routines
  .filter((routine) => !routine.draft)
  .filter((routine) => !activeCategory.value || matchesRoutineDirectoryCategory(routine, activeCategory.value))
  .sort((a, b) => a.routine_name.localeCompare(b.routine_name)));

function selectRoutine() {
  if (directory.value) directory.value.open = false;
  emit("select");
}

function closeOnOutsideClick(event: PointerEvent) {
  const target = event.target;

  if (target instanceof Node && directory.value?.open && !directory.value.contains(target)) {
    directory.value.open = false;
  }
}

onMounted(() => document.addEventListener("pointerdown", closeOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeOnOutsideClick));
</script>

<style scoped lang="scss">
.routine-directory {
  position: relative;
}

.directory-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  box-sizing: border-box;
  height: 33px;
  padding: var(--space-md) var(--space-xl) var(--space-md) var(--space-md);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background-color: var(--color-light);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='none' d='M0 0h20v20H0z'/%3E%3Cpath fill='%343A40' d='M5.5 7.5l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-sm) center;
  background-size: var(--space-lg);
  color: var(--color-dark);
  box-shadow: 1px 3px 0 var(--color-dark);
  cursor: pointer;
  font-family: var(--font-family-sans-serif);
  font-size: 13.3333px;
  line-height: 15px;
  list-style: none;
  white-space: nowrap;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background-color: rgba(241, 101, 68, 0.05);
  }
}

.directory-mobile-icon,
.directory-mobile-label {
  display: none;
}

.directory-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + var(--space-md));
  right: 0;
  width: min(34rem, calc(100vw - 2 * var(--space-lg)));
  max-height: min(34rem, calc(100vh - 8rem));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  box-shadow: 1px 3px 0 var(--color-dark);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-dark);
}

.category-filters button {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  color: var(--color-dark);
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  line-height: var(--lineHeight-xs);

  &.active,
  &:hover {
    background: var(--color-dark);
    color: var(--color-light);
  }
}

.routine-links {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--space-md) var(--space-lg);
}

.routine-links a {
  display: block;
  padding: var(--space-md) 0;
  border-bottom: 1px solid rgba(52, 58, 64, 0.22);
  color: var(--color-dark);
  font-family: var(--font-family-sans-serif);
  text-decoration: none;

  &:last-child {
    border-bottom: 0;
  }

  &:hover,
  &:focus-visible {
    color: var(--color-primary);
  }
}

@media (max-width: 768px) {
  .routine-directory {
    width: 100%;
  }

  .directory-toggle {
    width: 100%;
    padding: var(--space-sm) var(--space-lg) var(--space-sm) var(--space-sm);
    font-size: var(--fontSize-sm);
    line-height: 23px;
  }

  .directory-desktop-label {
    display: none;
  }

  .directory-mobile-icon,
  .directory-mobile-label {
    display: inline;
  }

  .directory-menu {
    right: 0;
    left: auto;
    width: min(34rem, calc(100vw - 2 * var(--space-lg)));
    max-height: min(28rem, calc(100vh - 7rem));
  }

  .category-filters {
    gap: var(--space-sm);
    padding: var(--space-md);
  }
}

@media (max-width: 430px) {
  .directory-mobile-label {
    display: none;
  }
}
</style>
