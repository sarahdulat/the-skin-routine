import { describe, expect, it } from "vitest";
import { getPostByUID } from "./posts";
import { buildReviewBlogPostingSchema } from "./review-schema";

describe("review structured data", () => {
  it("describes the article and its primary featured product", () => {
    const post = getPostByUID("laneige-lip-sleeping-mask");
    expect(post).not.toBeNull();

    const schema = buildReviewBlogPostingSchema(post!, {
      canonicalUrl: "https://theskinroutine.com/blog/laneige-lip-sleeping-mask/",
      description: post!.data.seo_description!,
      imageUrl: "https://theskinroutine.com/images/reviews/laneige.png",
    });

    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.mainEntityOfPage["@id"]).toBe("https://theskinroutine.com/blog/laneige-lip-sleeping-mask/");
    expect(schema.author).toEqual({
      "@type": "Person",
      name: "Sarah Dulat",
      url: "https://theskinroutine.com/about/",
    });
    expect(schema.about).toMatchObject({
      "@type": "Product",
      "@id": "https://theskinroutine.com/blog/laneige-lip-sleeping-mask/#product",
      name: "Lip Sleeping Mask",
      brand: { "@type": "Brand", name: "LANEIGE" },
      url: "https://theskinroutine.com/blog/laneige-lip-sleeping-mask/",
      sameAs: "https://us.laneige.com/products/lip-sleeping-mask",
      review: {
        "@type": "Review",
        name: "LANEIGE Lip Sleeping Mask review",
        datePublished: post!.first_publication_date,
        itemReviewed: {
          "@id": "https://theskinroutine.com/blog/laneige-lip-sleeping-mask/#product",
        },
        author: {
          "@type": "Person",
          name: "Sarah Dulat",
          url: "https://theskinroutine.com/about/",
        },
      },
    });
  });

  it("lists alternatives as general mentions without creating invalid Product items", () => {
    const post = getPostByUID("laneige-lip-sleeping-mask")!;
    const schema = buildReviewBlogPostingSchema(post, {
      canonicalUrl: "https://theskinroutine.com/blog/laneige-lip-sleeping-mask/",
      description: post.data.seo_description!,
      imageUrl: null,
    });
    const serializedSchema = JSON.stringify(schema);

    expect(schema.mentions).toHaveLength(post.data.products.length - 1);
    expect(schema.mentions?.[0]).toMatchObject({ "@type": "Thing" });
    expect(schema.about?.review).toMatchObject({
      "@type": "Review",
      reviewBody: post.data.seo_description,
    });
    expect(serializedSchema).not.toContain("reviewRating");
    expect(serializedSchema).not.toContain("aggregateRating");
    expect(serializedSchema).not.toContain("offers");
  });
});
