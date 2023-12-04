import { InjectionKey } from 'vue';
import { Store, createStore, useStore as baseUseStore } from 'vuex'
import routines from '../assets/routines.json'

interface State {
  routines: typeof routines;
  routineTime: "am" | "pm";
  currentRoutine: typeof routines[0];
}

export const key: InjectionKey<Store<State>> = Symbol()

export default createStore({
  state: {
    routines,
    currentRoutine: routines[0],
    routineTime: 'am',
  },
  mutations: {
    setRoutineTime(state, time) {
      state.routineTime = time
    },
    setCurrentRoutine(state, currentRoutine) {
      state.currentRoutine = currentRoutine
    }
  },
  actions: {
    setRoutineTime(context, time) {
      context.commit('setRoutineTime', time)
    },
    setCurrentRoutine(context, currentRoutine) {
      context.commit('setCurrentRoutine', currentRoutine)
    } 
  }
})

export function useStore () {
  return baseUseStore(key)
}