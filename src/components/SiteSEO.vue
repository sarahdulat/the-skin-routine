<template></template>

<script lang="ts" setup>
import { watchEffect } from "vue";
import { useRoute } from "vue-router";
import { absoluteUrl, getPageSeo, SITE_NAME } from "../page-seo";
import { getPostByUID } from "../posts";

const route = useRoute();

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

function setMeta(attribute: "name" | "property", key: string, content: string) {
  ensureMeta(attribute, key).content = content;
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head
    .querySelectorAll(`meta[${attribute}="${key}"][data-seo-managed="true"]`)
    .forEach((element) => element.remove());
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

function removeCanonical() {
  document.head
    .querySelectorAll('link[rel="canonical"][data-seo-managed="true"]')
    .forEach((element) => element.remove());
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

function removeJsonLd() {
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-seo-managed="true"]')
    .forEach((element) => element.remove());
}

function clearArticleMetadata() {
  document.head
    .querySelectorAll('meta[property^="article:"][data-seo-managed="true"]')
    .forEach((element) => element.remove());
}

function setNotFoundMetadata() {
  const title = `Page Not Found | ${SITE_NAME}`;
  const description = "The requested page could not be found. Explore skincare routines and honest product reviews from The Skin Routine.";

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", "noindex,follow");
  removeCanonical();

  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", SITE_NAME);
  removeMeta("property", "og:url");
  removeMeta("property", "og:image");
  removeMeta("property", "og:image:alt");

  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  removeMeta("name", "twitter:image");
  removeMeta("name", "twitter:image:alt");
  clearArticleMetadata();
  removeJsonLd();
}

watchEffect(() => {
  if (typeof document === "undefined") return;

  const fullPath = route.fullPath;
  const reviewSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;

  if (route.name === "blog-post" && reviewSlug && getPostByUID(reviewSlug)) return;

  const seo = getPageSeo(fullPath);
  if (!seo) {
    setNotFoundMetadata();
    return;
  }

  const canonicalUrl = absoluteUrl(seo.canonicalPath);

  document.title = seo.title;
  setMeta("name", "description", seo.description);
  setMeta("name", "robots", seo.noindex ? "noindex,follow" : "index,follow");
  setCanonical(canonicalUrl);

  setMeta("property", "og:title", seo.socialTitle);
  setMeta("property", "og:description", seo.description);
  setMeta("property", "og:type", seo.type);
  setMeta("property", "og:url", canonicalUrl);
  setMeta("property", "og:site_name", SITE_NAME);

  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", seo.socialTitle);
  setMeta("name", "twitter:description", seo.description);
  removeMeta("property", "og:image");
  removeMeta("property", "og:image:alt");
  removeMeta("name", "twitter:image");
  removeMeta("name", "twitter:image:alt");
  clearArticleMetadata();

  setJsonLd({
    "@context": "https://schema.org",
    "@type": seo.canonicalPath === "/" ? "WebSite" : "WebPage",
    name: seo.socialTitle,
    url: canonicalUrl,
    description: seo.description,
    isPartOf: seo.canonicalPath === "/" ? undefined : {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  });
});
</script>
