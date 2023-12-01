<template>
  <div class="col-xs-12 col-sm-4">
    <div v-for="routine in routines" :key="routine.id" class="scroll-container overflow-scroll">
      <h2 class="text-decoration-underline mt-3">{{ routine.name }}</h2>
      <div class="btn-group w-100" role="group">
        <input @click="$store.dispatch('setRoutineTime', 'am')" type="radio" class="btn-check" name="btnradio" id="am"
          autocomplete="off" checked>
        <label class="btn btn-lg btn-outline-primary" for="am">am <span class="glyph">☀</span></label>
        <input @click="$store.dispatch('setRoutineTime', 'pm')" type="radio" class="btn-check" name="btnradio" id="pm"
          autocomplete="off">
        <label class="btn btn-lg btn-outline-primary" for="pm">pm <span class="glyph">⏾</span></label>
      </div>

      <div v-for="step in getSteps(routine)" :key="step.key" class="border-bottom mb-3 pb-3">
        <h3 class="d-inline">{{ step.order }}</h3>
        <h4 class="d-inline">{{ step.title }}
          <span data-bs-toggle="collapse" :data-bs-target="`#${step.title}`" class="glyph hand collapsed">
            🖙
          </span>
        </h4>
        <div>
          <a :href="step.link" target="_blank">{{ step.product }}</a>
        </div>
        <div class="collapse multi-collapse mt-1" :id="`${step.title}`">
          <div v-html="step.description"></div>
        </div>
      </div>
    </div>
  </div>
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
}

.toggle-group {
  border: 1px solid black;
  border-radius: 0;

  &:hover {
    border-radius: 0;
  }
}

.hand {
  display: inline-block;
  transition: all .1s linear;
  cursor: pointer;

  &:not(.collapsed) {
    transform: rotate(90deg);
  }
}
</style>
