import { describe, expect, it } from "vitest";
import { externalLinkRel, isAffiliateUrl, qualifyAffiliateLinksInHtml } from "./affiliate-links";

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

    expect(qualifyAffiliateLinksInHtml(html))
      .toContain('rel="noopener noreferrer sponsored"');
  });
});
