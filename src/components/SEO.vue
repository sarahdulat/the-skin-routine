<template></template>

<script lang="ts">
import { defineComponent, PropType, watchEffect } from "vue";
import { Post } from "../types";
import { buildReviewBlogPostingSchema } from "../review-schema";

const defaultSiteUrl = "https://theskinroutine.com";
const defaultTitle = "The Skin Routine";
const defaultDescription = "Skincare routines and product reviews.";

function getSiteUrl() {
  return (import.meta.env.VITE_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
}

function absoluteUrl(value: string) {
  if (/^https?:\/\//.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? "" : "/"}${value}`;
}

function canonicalPath(path: string) {
  return path === "/" ? path : `${path.replace(/\/$/, "")}/`;
}

function ensureMeta(attribute: "name" | "property", key: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"][data-seo-managed="true"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    element.dataset.seoManaged = "true";
    document.head.appendChild(element);
  }

  return element;
}

function setMeta(attribute: "name" | "property", key: string, content: string | null | undefined) {
  const element = ensureMeta(attribute, key);
  element.content = content ?? "";
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"][data-seo-managed="true"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    element.dataset.seoManaged = "true";
    document.head.appendChild(element);
  }

  element.href = url;
}

function setJsonLd(data: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-seo-managed="true"]');

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seoManaged = "true";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

function removeManagedArticleTags() {
  document.head
    .querySelectorAll('meta[property="article:tag"][data-seo-managed="true"]')
    .forEach((element) => element.remove());
}

function addArticleTags(tags: string[]) {
  removeManagedArticleTags();

  for (const tag of tags) {
    const element = document.createElement("meta");
    element.setAttribute("property", "article:tag");
    element.dataset.seoManaged = "true";
    element.content = tag;
    document.head.appendChild(element);
  }
}

export default defineComponent({
  name: "SEO",
  props: {
    post: {
      type: Object as PropType<Post | null>,
      required: false,
      default: null,
    },
  },
  setup(props) {
    watchEffect(() => {
      if (typeof document === "undefined") return;

      const post = props.post;
      const displayTitle = post?.data.title?.[0]?.text ?? defaultTitle;
      const title = post?.data.seo_title || displayTitle;
      const description = post?.data.seo_description || post?.data.summary?.[0]?.text || defaultDescription;
      const path = post ? `/blog/${post.uid}` : "/";
      const canonicalUrl = absoluteUrl(canonicalPath(path));
      const imageUrl = post?.data.image.url ? absoluteUrl(post.data.image.url) : null;
      const imageAlt = post?.data.image.alt ?? displayTitle;

      document.title = post ? `${title} | The Skin Routine` : title;

      setMeta("name", "description", description);
      setMeta("name", "robots", "index,follow");
      setCanonical(canonicalUrl);

      setMeta("property", "og:title", title);
      setMeta("property", "og:description", description);
      setMeta("property", "og:type", post ? "article" : "website");
      setMeta("property", "og:url", canonicalUrl);
      setMeta("property", "og:site_name", "The Skin Routine");
      setMeta("property", "og:image", imageUrl);
      setMeta("property", "og:image:alt", imageAlt);

      setMeta("name", "twitter:card", imageUrl ? "summary_large_image" : "summary");
      setMeta("name", "twitter:title", title);
      setMeta("name", "twitter:description", description);
      setMeta("name", "twitter:image", imageUrl);
      setMeta("name", "twitter:image:alt", imageAlt);

      if (post) {
        setMeta("property", "article:published_time", post.first_publication_date);
        setMeta("property", "article:modified_time", post.last_publication_date);
        addArticleTags(post.tags);
        setJsonLd(buildReviewBlogPostingSchema(post, {
          canonicalUrl,
          description,
          imageUrl,
        }));
      } else {
        removeManagedArticleTags();
        setJsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "The Skin Routine",
          url: canonicalUrl,
          description,
        });
      }
    });

    return {};
  },
});
</script>
