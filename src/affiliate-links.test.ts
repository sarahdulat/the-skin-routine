import { describe, expect, it } from "vitest";
import {
  externalLinkRel,
  isAffiliateUrl,
  isExternalUrl,
  qualifyExternalLinksInHtml,
} from "./affiliate-links";
import routines from "./assets/routines.json";

type RoutineStep = {
  description?: string;
};

describe("affiliate link qualification", () => {
  it.each([
    "https://amzn.to/example",
    "https://tidd.ly/example",
    "https://sovrn.co/example",
    "https://www.amazon.com/dp/example?tag=theskinrout07-20",
  ])("recognizes %s as an affiliate URL", (url) => {
    expect(isAffiliateUrl(url)).toBe(true);
    expect(externalLinkRel(url)).toContain("sponsored");
  });

  it("does not mark ordinary editorial links as sponsored", () => {
    expect(externalLinkRel("https://www.reddit.com/r/SkincareAddiction/"))
      .toBe("noopener noreferrer");
  });

  it("adds sponsored without removing an existing rel value", () => {
    const html = '<a href="https://amzn.to/example" target="_blank" rel="noopener noreferrer">Buy</a>';

    expect(qualifyExternalLinksInHtml(html))
      .toContain('rel="noopener noreferrer sponsored"');
  });

  it("opens ordinary external links safely in a new tab", () => {
    const html = '<a href="https://example.com/product">Product</a>';

    expect(qualifyExternalLinksInHtml(html))
      .toBe('<a href="https://example.com/product" target="_blank" rel="noopener noreferrer">Product</a>');
  });

  it("overrides an external link target while preserving existing rel values", () => {
    const html = '<a href="https://example.com/product" target="_self" rel="nofollow">Product</a>';

    expect(qualifyExternalLinksInHtml(html))
      .toContain('target="_blank" rel="nofollow noopener noreferrer"');
  });

  it("leaves relative and same-site links in the current tab", () => {
    const html = [
      '<a href="/blog/product-review/">Review</a>',
      '<a href="https://theskinroutine.com/blog/product-review/">Review</a>',
      '<a href="https://www.theskinroutine.com/blog/product-review/">Review</a>',
    ].join("");

    expect(qualifyExternalLinksInHtml(html)).toBe(html);
    expect(isExternalUrl("/blog/product-review/")).toBe(false);
    expect(isExternalUrl("https://theskinroutine.com/blog/product-review/")).toBe(false);
    expect(isExternalUrl("https://www.theskinroutine.com/blog/product-review/")).toBe(false);
  });

  it("qualifies every external link embedded in routine descriptions", () => {
    const descriptions = routines.flatMap((routine) => (
      Object.values(routine.steps).flatMap((steps) => (
        (Array.isArray(steps) ? steps : Object.values(steps)) as RoutineStep[]
      ))
    ));

    descriptions.forEach(({ description }) => {
      const container = document.createElement("div");
      container.innerHTML = qualifyExternalLinksInHtml(description ?? "");

      container.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
        const href = link.getAttribute("href") ?? "";
        if (!isExternalUrl(href)) return;

        expect(link.target, href).toBe("_blank");
        expect(link.relList.contains("noopener"), href).toBe(true);
        expect(link.relList.contains("noreferrer"), href).toBe(true);

        if (isAffiliateUrl(href)) {
          expect(link.relList.contains("sponsored"), href).toBe(true);
        }
      });
    });
  });
});
