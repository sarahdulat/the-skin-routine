import { describe, expect, it } from "vitest";
import routines from "./assets/routines.json";
import { findRoutineBySlugOrId, newestRoutine, routineSlug } from "./routines";

describe("routine helpers", () => {
  it("creates readable routine slugs from routine names", () => {
    const haileyRoutine = routines.find((routine) => routine.routine_name === "Hailey Bieber's Routine");
    const beyonceRoutine = routines.find((routine) => routine.routine_name === "Beyoncé's Routine");

    expect(haileyRoutine).toBeDefined();
    expect(beyonceRoutine).toBeDefined();
    expect(routineSlug(haileyRoutine!)).toBe("hailey-biebers-routine");
    expect(routineSlug(beyonceRoutine!)).toBe("beyonces-routine");
  });

  it("finds routines by slug or legacy numeric id", () => {
    const haileyRoutine = routines.find((routine) => routine.routine_name === "Hailey Bieber's Routine");

    expect(haileyRoutine).toBeDefined();
    expect(findRoutineBySlugOrId(routines, "hailey-biebers-routine")?.id).toBe(haileyRoutine!.id);
    expect(findRoutineBySlugOrId(routines, String(haileyRoutine!.id))?.id).toBe(haileyRoutine!.id);
  });

  it("uses the last non-draft routine as the newest routine", () => {
    const expectedRoutine = [...routines].reverse().find((routine) => !routine.draft);

    expect(newestRoutine(routines)?.id).toBe(expectedRoutine?.id);
  });

  it("returns null when no public newest routine is available", () => {
    const draftOnlyRoutines = routines.slice(0, 2).map((routine) => ({
      ...routine,
      draft: true,
    }));

    expect(newestRoutine(draftOnlyRoutines)).toBeNull();
  });
});
