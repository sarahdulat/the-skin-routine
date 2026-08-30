import { describe, expect, it } from "vitest";
import { getPageSeo } from "./page-seo";

describe("page SEO", () => {
  it("provides unique metadata for indexable static pages", () => {
    const home = getPageSeo("/");
    const about = getPageSeo("/about/");
    const blog = getPageSeo("/blog/");

    expect(home?.canonicalPath).toBe("/");
    expect(home?.noindex).toBe(false);
    expect(new Set([home?.title, about?.title, blog?.title]).size).toBe(3);
    expect([home, about, blog].every((page) => Boolean(page?.description))).toBe(true);
  });

  it("canonicalizes and noindexes filtered page variants", () => {
    const filteredBlog = getPageSeo("/blog/?Brands=LANEIGE&Tag=review");
    const filteredHome = getPageSeo("/?Age+Range=30s");

    expect(filteredBlog?.canonicalPath).toBe("/blog/");
    expect(filteredBlog?.noindex).toBe(true);
    expect(filteredHome?.canonicalPath).toBe("/");
    expect(filteredHome?.noindex).toBe(true);
  });

  it("uses the selected routine for routine metadata", () => {
    const routine = getPageSeo("/routine/sarahs-routine/");
    const longRoutine = getPageSeo("/routine/beyonces-routine/");

    expect(routine?.title).toBe("Sarah's Routine | The Skin Routine");
    expect(routine?.description).toContain("microcurrent");
    expect(routine?.canonicalPath).toBe("/routine/sarahs-routine/");
    expect(longRoutine?.description.length).toBeLessThanOrEqual(160);
  });

  it("leaves reviews to review metadata and excludes the removed FAQ page", () => {
    expect(getPageSeo("/blog/laneige-lip-sleeping-mask/")).toBeNull();
    expect(getPageSeo("/faq/")).toBeNull();
  });

  it("does not generate indexable metadata for missing routines or pages", () => {
    expect(getPageSeo("/routine/not-a-real-routine/")).toBeNull();
    expect(getPageSeo("/not-a-real-page/")).toBeNull();
  });
});
