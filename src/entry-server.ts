import { renderToString } from "@vue/server-renderer";
import { createSkinRoutineApp } from "./create-app";
import { getAllPosts, getPostByUID } from "./posts";

const defaultSiteUrl = "https://theskinroutine.com";

function siteUrl() {
  return (import.meta.env.VITE_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
}

function absoluteUrl(value: string) {
  if (/^https?:\/\//.test(value)) return value;
  return `${siteUrl()}${value.startsWith("/") ? "" : "/"}${value}`;
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function meta(attribute: "name" | "property", key: string, content: string) {
  return `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" data-seo-managed="true">`;
}

function reviewHead(slug: string) {
  const post = getPostByUID(slug);
  if (!post) throw new Error(`Cannot pre-render missing review: ${slug}`);

  const displayTitle = post.data.title[0].text;
  const title = post.data.seo_title || displayTitle;
  const description = post.data.seo_description || post.data.summary[0].text;
  const canonicalUrl = `${siteUrl()}/blog/${post.uid}/`;
  const imageUrl = absoluteUrl(post.data.image.url);
  const imageAlt = post.data.image.alt || displayTitle;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: displayTitle,
    description,
    url: canonicalUrl,
    datePublished: post.first_publication_date,
    dateModified: post.last_publication_date,
    image: [imageUrl],
    author: {
      "@type": "Person",
      name: "Sarah Dulat",
    },
    publisher: {
      "@type": "Organization",
      name: "The Skin Routine",
    },
  };

  return [
    `<title>${escapeAttribute(`${title} | The Skin Routine`)}</title>`,
    meta("name", "description", description),
    `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" data-seo-managed="true">`,
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:type", "article"),
    meta("property", "og:url", canonicalUrl),
    meta("property", "og:site_name", "The Skin Routine"),
    meta("property", "og:image", imageUrl),
    meta("property", "og:image:alt", imageAlt),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    meta("name", "twitter:image", imageUrl),
    meta("name", "twitter:image:alt", imageAlt),
    meta("property", "article:published_time", post.first_publication_date),
    meta("property", "article:modified_time", post.last_publication_date),
    ...post.tags.map((tag) => meta("property", "article:tag", tag)),
    `<script type="application/ld+json" data-seo-managed="true">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}

export function publishedReviewRoutes() {
  return getAllPosts().map((post) => `/blog/${post.uid}/`);
}

export async function renderReview(url: string) {
  const slug = url.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  if (!slug) throw new Error(`Not a review URL: ${url}`);

  const { app, router } = createSkinRoutineApp(true);
  await router.push(url);
  await router.isReady();

  return {
    appHtml: await renderToString(app),
    headHtml: reviewHead(slug),
  };
}
