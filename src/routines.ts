import type { Routine } from "./store";

export function routineSlug(routine: Routine) {
  return routine.routine_name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function findRoutineBySlugOrId(routines: Routine[], slugOrId: string | null | undefined) {
  if (!slugOrId) return null;

  const routineId = Number(slugOrId);

  if (Number.isFinite(routineId)) {
    return routines.find((routine) => routine.id === routineId) ?? null;
  }

  return routines.find((routine) => routineSlug(routine) === slugOrId) ?? null;
}
