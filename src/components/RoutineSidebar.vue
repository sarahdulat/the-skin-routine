<template>
  <aside>
    <div class="scroll-container">
      <h2 class="mt-lg">{{ store.currentRoutine.name }}</h2>
      <input type="checkbox" id="toggle" />
      <label for="toggle" class='toggleContainer'>
        <div @click="store.setRoutineTime('am')">am <span class="glyph">☀</span></div>
        <div @click="store.setRoutineTime('pm')">pm <span class="glyph">⏾</span></div>
      </label>

      <div v-for="step in steps" :key="step.order" class="step mb-lg pb-lg">
        <h3>{{ step.order }}</h3>
        <h4>{{ step.title }}
          <button class="glyph hand me-md" type="button" :class="{ expanded: isStepExpanded(step.order) }"
            :aria-expanded="isStepExpanded(step.order)" :aria-controls="`step-description-${step.order}`"
            @click="toggleStep(step.order)">🖙</button>
        </h4>
        <div class="pt-md">
          <a :href="step.link" target="_blank" rel="noopener noreferrer">{{ step.product }}</a>
          <button class="px-sm ms-md">Buy</button>
        </div>
        <div v-show="isStepExpanded(step.order)" class="mt-sm" :id="`step-description-${step.order}`">
          <div v-html="step.description"></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { store } from '../store'

const routineTime = computed(() => store.routineTime);
const steps = computed(() => Object.values(store.currentRoutine.steps[routineTime.value]));
const expandedSteps = ref(new Set<string>());

const resetExpandedSteps = () => {
  expandedSteps.value = new Set(steps.value[0] ? [steps.value[0].order] : []);
};

const isStepExpanded = (order: string) => expandedSteps.value.has(order);

const toggleStep = (order: string) => {
  const nextExpandedSteps = new Set(expandedSteps.value);

  if (nextExpandedSteps.has(order)) {
    nextExpandedSteps.delete(order);
  } else {
    nextExpandedSteps.add(order);
  }

  expandedSteps.value = nextExpandedSteps;
};

watch(steps, resetExpandedSteps, { immediate: true });
</script>

<style lang="scss" scoped>
aside {
  border-left: var(--color-dark) solid 1px;
  padding: 0 var(--space-xl);
}

.scroll-container {
  max-height: calc(100vh - 150px);
  overflow: scroll;
}

h3,
h4 {
  display: inline;
  font-weight: 500;
}

a {
  color: var(--color-primary);
}

button {
  background-color: transparent;
  border-radius: var(--space-sm);
  border: 1px solid black;
  cursor: pointer;

  &:hover {
    background-color: rgba(241, 101, 68, 0.05);
  }
}

.hand {
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  display: inline-block;
  cursor: pointer;
  padding: 0;
  line-height: 0;
  transition: transform .1s linear;
  font-size: var(--fontSize-xl);

  &.expanded {
    transform: rotate(90deg);
  }
}

.step:not(:last-child) {
  border-bottom: 0.5px solid var(--color-dark);
  padding-bottom: var(--space-md);
}

.toggleContainer {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: fit-content;
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  font-weight: 500;
  color: var(--color-dark);
  cursor: pointer;
  width: 90%;
  margin-bottom: var(--space-xl);
  box-shadow: 1px 3px 0px var(--color-dark);
}

.toggleContainer::before {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0%;
  border-radius: 0;
  background: var(--color-dark);
  transition: all 0.3s;
}

input:checked+.toggleContainer::before {
  left: 50%;
}

.toggleContainer div {
  padding: var(--space-md);
  text-align: center;
  z-index: 1;
}

input {
  display: none;
}

input:checked+.toggleContainer div:first-child {
  color: var(--color-dark);
  transition: color 0.3s;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

input:checked+.toggleContainer div:last-child {
  color: var(--color-light);
  transition: color 0.3s;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

input+.toggleContainer div:first-child {
  color: var(--color-light);
  transition: color 0.3s;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

input+.toggleContainer div:last-child {
  color: var(--color-dark);
  transition: color 0.3s;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
</style>
