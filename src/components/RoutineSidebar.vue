<template>
  <div class="col-xs-12 col-sm-4">
    <div
      v-for="routine in routines"
      :key="routine.id"
      class="scroll-container overflow-scroll">
      <h2 class="text-decoration-underline mt-3">{{ routine.name }}</h2>
      <div class="button-group">
        <button
          class="btn btn-primary"
          @click="$store.dispatch('setRoutineTime', 'am')">
            am
        </button>
        <button
          class="btn btn-primary"
          @click="$store.dispatch('setRoutineTime', 'pm')">
            pm
        </button>
      </div>
      <div
        v-for="step in getSteps(routine)"
        :key="step.key"
        class="border-bottom mb-3">
        <h3 class="d-inline">{{ step.order }}</h3>
        <h4 class="d-inline">{{ step.title }} <span class="glyph">🖟</span></h4>
        <div>
          <a :href="step.link" target="_blank">{{ step.product }}</a>
        </div>
        <div v-html="step.description">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  data () {
    return {

    }
  },
  props: {
    routines: {
      default () {
        return []
      },
      type: Array
    },
  },
  computed: {
    routineTime () {
      return this.$store.state.routineTime
    },
  },
  methods: {
    getSteps (routine) {
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
</style>
