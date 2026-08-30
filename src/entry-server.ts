import { renderToString } from "@vue/server-renderer";
import { createSkinRoutineApp } from "./create-app";
import routines from "./assets/routines.json";
import { absoluteUrl, getPageSeo, getSiteUrl, SITE_NAME, type PageSeo } from "./page-seo";
import { getAllPosts, getPostByUID } from "./posts";
import { newestRoutine, routineSlug } from "./routines";
import { buildReviewBlogPostingSchema } from "./review-schema";
import { store } from "./store";

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
  const canonicalUrl = `${getSiteUrl()}/blog/${post.uid}/`;
  const imageUrl = absoluteUrl(post.data.image.url);
  const imageAlt = post.data.image.alt || displayTitle;
  const jsonLd = buildReviewBlogPostingSchema(post, {
    canonicalUrl,
    description,
    imageUrl,
  });

  return [
    `<title>${escapeAttribute(`${title} | ${SITE_NAME}`)}</title>`,
    meta("name", "description", description),
    meta("name", "robots", "index,follow"),
    `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" data-seo-managed="true">`,
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:type", "article"),
    meta("property", "og:url", canonicalUrl),
    meta("property", "og:site_name", SITE_NAME),
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

function pageHead(seo: PageSeo) {
  const canonicalUrl = absoluteUrl(seo.canonicalPath);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seo.canonicalPath === "/" ? "WebSite" : "WebPage",
    name: seo.socialTitle,
    url: canonicalUrl,
    description: seo.description,
    ...(seo.canonicalPath === "/" ? {} : {
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
    }),
  };

  return [
    `<title>${escapeAttribute(seo.title)}</title>`,
    meta("name", "description", seo.description),
    meta("name", "robots", seo.noindex ? "noindex,follow" : "index,follow"),
    `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" data-seo-managed="true">`,
    meta("property", "og:title", seo.socialTitle),
    meta("property", "og:description", seo.description),
    meta("property", "og:type", seo.type),
    meta("property", "og:url", canonicalUrl),
    meta("property", "og:site_name", SITE_NAME),
    meta("name", "twitter:card", "summary"),
    meta("name", "twitter:title", seo.socialTitle),
    meta("name", "twitter:description", seo.description),
    `<script type="application/ld+json" data-seo-managed="true">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}

function notFoundHead() {
  const title = `Page Not Found | ${SITE_NAME}`;
  const description = "The requested page could not be found. Explore skincare routines and honest product reviews from The Skin Routine.";

  return [
    `<title>${escapeAttribute(title)}</title>`,
    meta("name", "description", description),
    meta("name", "robots", "noindex,follow"),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", SITE_NAME),
    meta("name", "twitter:card", "summary"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
  ].join("\n    ");
}

export function publishedReviewRoutes() {
  return getAllPosts().map((post) => `/blog/${post.uid}/`);
}

export function publishedRoutineRoutes() {
  return routines
    .filter((routine) => !routine.draft)
    .map((routine) => `/routine/${routineSlug(routine)}/`);
}

export function publishedPageRoutes() {
  return [
    "/",
    "/about/",
    "/blog/",
    ...publishedReviewRoutes(),
    ...publishedRoutineRoutes(),
  ];
}

export async function renderPage(url: string) {
  const slug = url.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  const seo = slug ? null : getPageSeo(url);

  if (!slug && !seo) throw new Error(`Cannot pre-render unknown URL: ${url}`);

  store.setCurrentRoutine(newestRoutine(routines));
  store.setRoutineTime("am");

  const { app, router } = createSkinRoutineApp(true);
  await router.push(url);
  await router.isReady();

  return {
    appHtml: await renderToString(app),
    headHtml: slug ? reviewHead(slug) : pageHead(seo as PageSeo),
  };
}

export async function renderNotFoundPage() {
  store.setCurrentRoutine(newestRoutine(routines));
  store.setRoutineTime("am");

  const { app, router } = createSkinRoutineApp(true);
  await router.push("/404/");
  await router.isReady();

  return {
    appHtml: await renderToString(app),
    headHtml: notFoundHead(),
  };
}
