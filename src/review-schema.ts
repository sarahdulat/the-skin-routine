import type { Post } from "./types";

type SchemaOptions = {
  canonicalUrl: string;
  description: string;
  imageUrl?: string | null;
};

type FeaturedProduct = Post["data"]["products"][number]["product"];

function mentionedProductSchema(product: FeaturedProduct) {
  return {
    "@type": "Thing",
    name: `${product.brand} ${product.name}`,
    url: product.link,
  };
}

function productSchema(
  product: FeaturedProduct,
  options: SchemaOptions,
  productId: string,
  review: Record<string, unknown>,
) {
  return {
    "@type": "Product",
    "@id": productId,
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    url: options.canonicalUrl,
    sameAs: product.link,
    ...(options.imageUrl ? { image: [options.imageUrl] } : {}),
    review,
  };
}

export function buildReviewBlogPostingSchema(post: Post, options: SchemaOptions) {
  const displayTitle = post.data.title[0]?.text ?? post.uid;
  const primaryProduct = post.data.products[0]?.product;
  const mentionedProducts = post.data.products.slice(1).map(({ product }) => mentionedProductSchema(product));
  const siteUrl = new URL(options.canonicalUrl).origin;
  const productId = `${options.canonicalUrl}#product`;
  const author = {
    "@type": "Person",
    name: "Sarah Dulat",
    url: `${siteUrl}/about/`,
  };
  const publisher = {
    "@type": "Organization",
    name: "The Skin Routine",
    url: `${siteUrl}/`,
  };
  const review = {
    "@type": "Review",
    name: `${displayTitle} review`,
    reviewBody: options.description,
    datePublished: post.first_publication_date,
    itemReviewed: {
      "@id": productId,
    },
    author,
    publisher,
  };

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
    author,
    publisher,
    ...(primaryProduct ? { about: productSchema(primaryProduct, options, productId, review) } : {}),
    ...(mentionedProducts.length > 0 ? { mentions: mentionedProducts } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags } : {}),
    inLanguage: post.lang,
  };
}
