<template>
  <aside>
    <div class="scroll-container">
      <h2 class="mt-lg">{{ store.state.currentRoutine.name }}</h2>
      <input type="checkbox" id="toggle" />
      <label for="toggle" class='toggleContainer'>
        <div @click="$store.dispatch('setRoutineTime', 'am')">am <span class="glyph">☀</span></div>
        <div @click="$store.dispatch('setRoutineTime', 'pm')">pm <span class="glyph">⏾</span></div>
      </label>

      <div v-for="step in steps" :key="step.order" class="step mb-lg pb-lg">
        <h3>{{ step.order }}</h3>
        <h4>{{ step.title }}
          <span class="glyph hand collapsed">
            🖙
          </span>
        </h4>
        <div>
          <a :href="step.link" target="_blank" rel="noopener noreferrer">{{ step.product }}</a>
          <button class="px-sm ms-md">Buy</button>
        </div>
        <div class="collapse multi-collapse mt-sm" :id="`${step.title}`">
          <div v-html="step.description"></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from '../store'

const store = useStore()
const routineTime = computed(() => store.state.routineTime);
const steps = computed(() => store.state.currentRoutine.steps[routineTime.value]);
</script>

<style lang="scss" scoped>
aside {
  border-left: var(--color-dark) solid 1px;
  padding: 0 var(--space-xl);
}

.scroll-container {
  max-height: calc(100vh - 145px);
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
  cursor: pointer;

  &:hover {
    background-color: rgba(241, 101, 68, 0.05);
  }
}

.hand {
  display: inline-block;
  transition: all .1s linear;
  cursor: pointer;
  display: inline-block;

  &:not(.collapsed) {
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
  font-weight: bold;
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
