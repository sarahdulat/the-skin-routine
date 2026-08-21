import { describe, expect, it } from "vitest";
import { searchSite } from "./search";

describe("site search", () => {
  it("returns no results for an empty search", () => {
    expect(searchSite("   ")).toEqual({ posts: [], routines: [] });
  });

  it("finds review posts by product and brand terms", () => {
    const results = searchSite("laneige lip mask");

    expect(results.posts[0]?.id).toBe("laneige-lip-sleeping-mask");
    expect(results.posts[0]?.path).toBe("/blog/laneige-lip-sleeping-mask");
  });

  it("finds routines by routine title and step text", () => {
    const titleResults = searchSite("hailey bieber");
    const stepResults = searchSite("rhode glazing milk");

    expect(titleResults.routines.some((routine) => routine.title === "Hailey Bieber's Routine")).toBe(true);
    expect(stepResults.routines.some((routine) => routine.title === "Hailey Bieber's Routine")).toBe(true);
  });

  it("requires every search term to match", () => {
    const results = searchSite("laneige asteroid");

    expect(results.posts).toHaveLength(0);
    expect(results.routines).toHaveLength(0);
  });

  it("limits each result group to six items", () => {
    const results = searchSite("routine");

    expect(results.posts.length).toBeLessThanOrEqual(6);
    expect(results.routines.length).toBeLessThanOrEqual(6);
  });

  it("sorts routine results alphabetically", () => {
    const results = searchSite("routine");
    const routineTitles = results.routines.map((routine) => routine.title);

    expect(routineTitles).toEqual([...routineTitles].sort((a, b) => a.localeCompare(b)));
  });
});
