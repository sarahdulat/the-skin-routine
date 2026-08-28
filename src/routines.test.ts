import { describe, expect, it } from "vitest";
import routines from "./assets/routines.json";
import { findRoutineBySlugOrId, findRoutineProductMentions, newestRoutine, routineSlug, withoutRoutineSelection } from "./routines";

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

  it("removes a stale routine selection while preserving active filters", () => {
    expect(withoutRoutineSelection({
      routine: "sarahs-routine",
      "Age Range": "30s",
      "Skin Concern": "Dry Skin",
      PregnancySafe: "true",
    })).toEqual({
      "Age Range": "30s",
      "Skin Concern": "Dry Skin",
      PregnancySafe: "true",
    });
  });

  it("finds routines where a featured product is mentioned", () => {
    const mentions = findRoutineProductMentions(routines, [
      {
        brand: "LANEIGE",
        name: "Lip Sleeping Mask",
      },
    ]);

    expect(mentions.length).toBeGreaterThan(0);
    expect(mentions.some((mention) => mention.routine.routine_name === "Kate Moss's Routine")).toBe(true);
    expect(mentions.every((mention) => !mention.routine.draft)).toBe(true);
  });

  it("does not match generic product category wording as a product mention", () => {
    const mentions = findRoutineProductMentions(routines, [
      {
        brand: "The INKEY List",
        name: "Retinol Eye Cream",
      },
    ]);

    expect(mentions.map((mention) => mention.routine.routine_name)).not.toEqual(expect.arrayContaining([
      "Hailey Bieber's Routine",
      "Korean Skincare Routine for Your 30s–40s",
      "Sarah's Routine",
    ]));
  });

  it("matches a product when the exact product link appears in a routine description", () => {
    const mentions = findRoutineProductMentions(routines, [
      {
        brand: "The INKEY List",
        name: "Retinol Eye Cream",
        link: "https://www.theinkeylist.com/products/retinol-eye-cream",
      },
    ]);

    expect(mentions.map((mention) => mention.routine.routine_name)).toEqual(["Sarah's Routine"]);
  });

  it("matches NuFACE when it is the actual step product or closely mentioned in a description", () => {
    const mentions = findRoutineProductMentions(routines, [
      {
        brand: "NuFACE",
        name: "MINI+ Starter Kit",
        link: "https://sovrn.co/8lrchet",
      },
    ]);

    expect(mentions.map((mention) => mention.routine.routine_name)).toEqual([
      "Bella Hadid's Routine",
      "Sabrina Carpenter's Routine",
      "Sarah's Routine",
    ]);
  });

  it("matches ACM Azéane routines when the actual step product uses a close name variant", () => {
    const mentions = findRoutineProductMentions(routines, [
      {
        brand: "ACM",
        name: "Azéane Cream 15% Azelaic Acid",
        link: "https://www.caretobeauty.com/us/acm-laboratoire-azeane-cream-15-azelaic-acid-30ml/",
      },
    ]);

    expect(mentions.map((mention) => mention.routine.routine_name)).toEqual([
      "French Pharmacy Routine for Your 20s",
      "Sarah's Pregnancy Safe Routine",
      "Sarah's Routine",
    ]);
  });

  it("does not show non-regional products in Korean or French themed routine mentions", () => {
    const mentions = findRoutineProductMentions(routines, [
      {
        brand: "Supergoop!",
        name: "Bright-Eyed 100% Mineral Eye Cream SPF 40",
        link: "https://supergoop.com/products/bright-eyed-100-mineral-eye-cream-spf-40",
      },
    ]);
    const routineNames = mentions.map((mention) => mention.routine.routine_name);

    expect(routineNames).not.toEqual(expect.arrayContaining([
      "French Pharmacy Routine for Your 20s",
      "French Pharmacy Routine for Your 30s–40s",
      "French Pharmacy Routine for Your 50s+",
      "Korean Skincare Routine for Your 20s",
      "Korean Skincare Routine for Your 30s–40s",
    ]));
  });
});
