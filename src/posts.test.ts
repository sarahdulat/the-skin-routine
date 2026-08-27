import { describe, expect, it } from "vitest";
import { getAdjacentPosts, getAllPosts, getPostByUID, getPostsByFilters } from "./posts";

describe("post helpers", () => {
  it("returns published posts newest first", () => {
    const posts = getAllPosts();

    expect(posts.length).toBeGreaterThan(0);

    const publicationTimes = posts.map((post) => new Date(post.first_publication_date).getTime());
    const sortedPublicationTimes = [...publicationTimes].sort((a, b) => b - a);

    expect(publicationTimes).toEqual(sortedPublicationTimes);
  });

  it("hides draft posts from the public post list", () => {
    const draftUids = [
      "la-roche-posay-toleriane-purifying-foaming-face-wash",
      "supergoop-glow-stick-spf-50",
      "the-ordinary-natural-moisturizing-factors-ha",
    ];

    expect(getAllPosts().map((post) => post.uid)).not.toEqual(expect.arrayContaining(draftUids));
  });

  it("finds a post by uid and returns null for a missing post", () => {
    const laneigePost = getPostByUID("laneige-lip-sleeping-mask");

    expect(laneigePost?.data.title[0]?.text).toBe("LANEIGE Lip Sleeping Mask");
    expect(laneigePost?.data.seo_title).toBe("LANEIGE Lip Sleeping Mask Review");
    expect(laneigePost?.data.seo_description).toContain("overnight hydration");
    expect(getPostByUID("not-a-real-post")).toBeNull();
  });

  it("provides unique SEO titles and descriptions for every published review", () => {
    const posts = getAllPosts();
    const seoTitles = posts.map((post) => post.data.seo_title);
    const seoDescriptions = posts.map((post) => post.data.seo_description);

    expect(seoTitles.every(Boolean)).toBe(true);
    expect(seoDescriptions.every(Boolean)).toBe(true);
    expect(new Set(seoTitles).size).toBe(posts.length);
    expect(new Set(seoDescriptions).size).toBe(posts.length);
  });

  it("filters posts by brand, product type, tag, and pregnancy-safe status", () => {
    const spfPosts = getPostsByFilters({ productTypes: "SPF" });
    const pregnancySafeSpfPosts = getPostsByFilters({ productTypes: "SPF", pregnancySafeOnly: true });
    const laneigePosts = getPostsByFilters({ brands: "LANEIGE", tag: "lip care" });

    expect(spfPosts.map((post) => post.uid)).toEqual(expect.arrayContaining([
      "la-roche-posay-anthelios-uvmune-400-anti-dark-spots-fluid-50",
      "supergoop-bright-eyed-100-mineral-eye-cream-spf-40",
    ]));
    expect(pregnancySafeSpfPosts.every((post) => post.data.pregnancy_safe)).toBe(true);
    expect(laneigePosts.map((post) => post.uid)).toEqual(["laneige-lip-sleeping-mask"]);
  });

  it("returns adjacent posts according to newest-first archive order", () => {
    const posts = getAllPosts();
    const middlePost = posts[1];
    const adjacentPosts = getAdjacentPosts(middlePost.uid);

    expect(adjacentPosts.nextPost?.uid).toBe(posts[0]?.uid);
    expect(adjacentPosts.prevPost?.uid).toBe(posts[2]?.uid);
    expect(getAdjacentPosts("not-a-real-post")).toEqual({ prevPost: null, nextPost: null });
  });
});
