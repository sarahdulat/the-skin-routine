import { reactive } from 'vue';
import routines from '../assets/routines.json'

export type Routine = typeof routines[number];

interface State {
  routines: typeof routines;
  routineTime: "am" | "pm";
  currentRoutine: Routine;
}

export const store = reactive<State & {
  setRoutineTime(time: State["routineTime"]): void;
  setCurrentRoutine(currentRoutine: Routine): void;
}>({
  // state
  routines,
  currentRoutine: routines[0],
  routineTime: 'am',

  // actions
  setRoutineTime(time: "am" | "pm") {
    this.routineTime = time
  },
  setCurrentRoutine(currentRoutine: Routine) {
    this.currentRoutine = currentRoutine
  }
})
