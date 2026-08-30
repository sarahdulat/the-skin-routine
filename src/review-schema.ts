import type { Post } from "./types";

type SchemaOptions = {
  canonicalUrl: string;
  description: string;
  imageUrl?: string | null;
};

type FeaturedProduct = Post["data"]["products"][number]["product"];

function productSchema(product: FeaturedProduct, imageUrl?: string | null) {
  return {
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    url: product.link,
    ...(imageUrl ? { image: [imageUrl] } : {}),
  };
}

export function buildReviewBlogPostingSchema(post: Post, options: SchemaOptions) {
  const displayTitle = post.data.title[0]?.text ?? post.uid;
  const primaryProduct = post.data.products[0]?.product;
  const mentionedProducts = post.data.products.slice(1).map(({ product }) => productSchema(product));
  const siteUrl = new URL(options.canonicalUrl).origin;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: displayTitle,
    description: options.description,
    url: options.canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.canonicalUrl,
    },
    datePublished: post.first_publication_date,
    dateModified: post.last_publication_date,
    ...(options.imageUrl ? { image: [options.imageUrl] } : {}),
    author: {
      "@type": "Person",
      name: "Sarah Dulat",
      url: `${siteUrl}/about/`,
    },
    publisher: {
      "@type": "Organization",
      name: "The Skin Routine",
      url: `${siteUrl}/`,
    },
    ...(primaryProduct ? { about: productSchema(primaryProduct, options.imageUrl) } : {}),
    ...(mentionedProducts.length > 0 ? { mentions: mentionedProducts } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags } : {}),
    inLanguage: post.lang,
  };
}
