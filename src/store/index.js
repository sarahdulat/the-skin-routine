import { createStore } from 'vuex'
import routinesModule from './modules/routines'

const modules = {
  routines: routinesModule
}

export default createStore({
  state: {
    routineTime: 'am'
  },
  mutations: {
    setRoutineTime(state, time) {
      state.routineTime = time
    }
  },
  actions: {
    setRoutineTime(context, time) {
      context.commit('setRoutineTime', time)
    }
  },
  getters: {

  }
})
