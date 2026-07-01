<template>
  <aside>
    <div class="scroll-container">
      <div class="routine-header my-lg">
        <h2>{{ store.currentRoutine.name }}</h2>
        <div v-if="firstSource" class="sources" aria-label="Routine sources">
          <a v-if="!hasMultipleSources" class="source-pill" :href="firstSource.link" target="_blank"
            rel="noopener noreferrer">
            <img v-if="firstSource.favicon" :src="firstSource.favicon"
              :alt="`${firstSource.site || firstSource.label} icon`" />
            <span>Sources</span>
          </a>
          <div v-if="hasMultipleSources" class="source-overflow">
            <button class="source-pill" type="button" :aria-label="`${sources.length} routine sources`">
              <img v-if="firstSource.favicon" :src="firstSource.favicon"
                :alt="`${firstSource.site || firstSource.label} icon`" />
              <span>Sources</span>
              <span class="source-count">+{{ additionalSourceCount }}</span>
            </button>
            <div class="source-popover" role="tooltip">
              <a v-for="source in sources" :key="source.link" class="source-card" :href="source.link" target="_blank"
                rel="noopener noreferrer">
                <img v-if="source.image" class="source-image" :src="source.image"
                  :alt="source.headline || source.label" />
                <span class="source-card-content">
                  <span class="source-site">
                    <img v-if="source.favicon" :src="source.favicon" :alt="`${source.site || source.label} icon`" />
                    <span>{{ source.site || source.label }}</span>
                  </span>
                  <span class="source-headline">{{ source.headline || source.label }}</span>
                  <span v-if="source.summary" class="source-summary">{{ source.summary }}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <input type="checkbox" id="toggle" />
      <label for="toggle" class='toggleContainer'>
        <div @click="store.setRoutineTime('am')">am <span class="glyph">☀</span></div>
        <div @click="store.setRoutineTime('pm')">pm <span class="glyph">⏾</span></div>
      </label>

      <div v-for="step in steps" :key="step.order" class="step mb-lg pb-lg">
        <h3>{{ step.order }}</h3>
        <h4>
          <span>{{ step.title }}</span>
          <button class="glyph hand" type="button" :class="{ expanded: isStepExpanded(step.order) }"
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

type RoutineSource = {
  label: string;
  link: string;
  site?: string;
  favicon?: string;
  image?: string;
  headline?: string;
  summary?: string;
};

type RoutineWithSources = typeof store.currentRoutine & {
  sources?: RoutineSource[];
};

const routineTime = computed(() => store.routineTime);
const steps = computed(() => Object.values(store.currentRoutine.steps[routineTime.value]));
const sources = computed(() => {
  return (store.currentRoutine as RoutineWithSources).sources ?? [];
});
const firstSource = computed(() => sources.value[0] ?? null);
const hasMultipleSources = computed(() => sources.value.length > 1);
const additionalSourceCount = computed(() => Math.max(sources.value.length - 1, 0));
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

.routine-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;

  h2 {
    margin: 0;
  }
}

.sources {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  line-height: var(--lineHeight-xs);
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 1.75rem;
  padding: 0 var(--space-md);
  border: 1px solid var(--color-dark);
  border-radius: 999px;
  background: var(--color-light);
  color: var(--color-dark);
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  line-height: var(--lineHeight-xs);
  text-decoration: none;
  white-space: nowrap;

  img {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }
}

.source-count {
  padding-left: var(--space-sm);
  border-left: 1px solid currentColor;
}

.source-overflow {
  position: relative;
}

.source-popover {
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-sm));
  display: none;
  width: min(24rem, calc(100vw - 2rem));
  overflow: hidden;
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  color: var(--color-dark);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.source-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4.75rem;
  gap: var(--space-md);
  padding: var(--space-md);
  color: var(--color-dark);
  text-decoration: none;

  &:hover {
    background: rgba(200, 82, 56, 0.08);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(52, 58, 64, 0.18);
  }
}

.source-image {
  grid-column: 2;
  grid-row: 1;
  width: 4.75rem;
  height: 4.75rem;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.source-card-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 0;
  grid-column: 1;
  grid-row: 1;
}

.source-site {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-dark);
  opacity: 0.75;

  img {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
  }
}

.source-headline {
  font-weight: 500;
  line-height: var(--lineHeight-sm);
}

.source-summary {
  display: -webkit-box;
  overflow: hidden;
  line-height: var(--lineHeight-xs);
  color: var(--color-dark);
  opacity: 0.82;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.source-overflow:hover .source-popover,
.source-overflow:focus-within .source-popover {
  display: block;
}

.step {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: var(--space-md);
  align-items: start;

  >div {
    grid-column: 1 / -1;
  }

  h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    margin-top: var(--space-md);
    margin-bottom: var(--space-sm);

    &::after {
      content: "";
      flex: 1;
      border-bottom: 0.5px solid var(--color-dark);
      order: 1;
    }

    span {
      min-width: 0;
    }

    .hand {
      order: 2;
    }
  }

  h3 {
    margin-top: var(--space-sm);
    margin-bottom: var(--space-sm);
  }
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
  // border-bottom: 0.5px solid var(--color-dark);
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
  width: 99%;
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
