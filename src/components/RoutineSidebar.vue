<template>
  <div class="col-xs-12 col-sm-4">
    <div
      v-for="routine in routines"
      :key="routine.id"
      class="scroll-container overflow-scroll">
      <h2 class="text-decoration-underline mt-3">{{ routine.name }} {{ routineTime }}</h2>
      <div class="button-group">
        <button
          class="btn btn-primary"
          @click="$store.dispatch('setRoutineTime', 'am')">
            a
        </button>
        <button
          class="btn btn-primary"
          @click="$store.dispatch('setRoutineTime', 'pm')">
            p
        </button>
      </div>
      <div
        v-for="step in routine.steps.routineTime"
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
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('routines')

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
    ...mapState([
      'routineTime'
    ])
  },
  methods: {
    ...mapActions([
      setRoutineTime
    ])
  }
};
</script>

<style lang="scss" scoped>
.scroll-container {
  max-height: calc(100vh - 155px);
}
</style>
