import { reactive } from 'vue';
import routines from '../assets/routines.json'

interface State {
  routines: typeof routines;
  routineTime: "am" | "pm";
  currentRoutine: typeof routines[0];
}

export const store = reactive({
  // state
  routines,
  currentRoutine: routines[0],
  routineTime: 'am',

  // actions
  setRoutineTime(time: "am" | "pm") {
    this.routineTime = time
  },
  setCurrentRoutine(currentRoutine: typeof routines[0]) {
    currentRoutine = currentRoutine
  }
})
