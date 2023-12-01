<template>
  <aside>
    <div v-for="routine in routines" :key="routine.id" class="scroll-container">
      <h2 class="mt-lg">{{ routine.name }}</h2>
      <input type="checkbox" id="toggle" />
      <label for="toggle" class='toggleContainer'>
        <div @click="$store.dispatch('setRoutineTime', 'am')">am <span class="glyph">☀</span></div>
        <div @click="$store.dispatch('setRoutineTime', 'pm')">pm <span class="glyph">⏾</span></div>
      </label>

      <div v-for="step in getSteps(routine)" :key="step.key" class="step mb-lg pb-lg">
        <h3>{{ step.order }}</h3>
        <h4>{{ step.title }}
          <span data-bs-toggle="collapse" :data-bs-target="`#${step.title}`" class="glyph hand collapsed">
            🖙
          </span>
        </h4>
        <div>
          <a :href="step.link" target="_blank">{{ step.product }}</a>
        </div>
        <div class="collapse multi-collapse mt-sm" :id="`${step.title}`">
          <div v-html="step.description"></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">

export default {
  name: "App",
  data() {
    return {
      showStep: false
    }
  },
  props: {
    routines: {
      default() {
        return []
      },
      type: Array
    },
  },
  computed: {
    routineTime() {
      return this.$store.state.routineTime
    },
  },
  methods: {
    getSteps(routine) {
      if (this.routineTime === "am") {
        return routine.steps.am
      } else {
        return routine.steps.pm
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-container {
  max-height: calc(100vh - 155px);
  overflow: scroll;
}

h2 {
  text-decoration: underline;
  font-weight: 400;
}

h3,
h4 {
  display: inline;
  font-weight: 500;
}

.hand {
  display: inline-block;
  transition: all .1s linear;
  cursor: pointer;

  &:not(.collapsed) {
    transform: rotate(90deg);
  }
}

.step:not(:last-child) {
  border-bottom: 0.5px solid var(--color-text);
  padding-bottom: var(--space-md);
}

.toggleContainer {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: fit-content;
  border: 1px solid var(--color-text);
  border-radius: var(--radius-sm);
  background: var(--color-text);
  font-weight: bold;
  color: var(--color-text);
  cursor: pointer;
  width: 90%;
  margin-bottom: var(--space-xl)
}

.toggleContainer::before {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0%;
  border-radius: 0;
  background: var(--color-body);
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
  color: var(--color-body);
  transition: color 0.3s;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

input:checked+.toggleContainer div:last-child {
  color: var(--color-text);
  transition: color 0.3s;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

input+.toggleContainer div:first-child {
  color: var(--color-text);
  transition: color 0.3s;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

input+.toggleContainer div:last-child {
  color: var(--color-body);
  transition: color 0.3s;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
</style>
