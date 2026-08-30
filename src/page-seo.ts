import routines from "./assets/routines.json";
import { findRoutineBySlugOrId } from "./routines";

export const SITE_NAME = "The Skin Routine";
export const DEFAULT_SITE_URL = "https://theskinroutine.com";

export type PageSeo = {
  title: string;
  socialTitle: string;
  description: string;
  canonicalPath: string;
  noindex: boolean;
  type: "website" | "profile";
};

export function getSiteUrl() {
  return (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(value: string) {
  if (/^https?:\/\//.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? "" : "/"}${value}`;
}

export function canonicalPath(path: string) {
  return path === "/" ? path : `${path.replace(/\/$/, "")}/`;
}

function hasQuery(url: URL) {
  return [...url.searchParams.keys()].length > 0;
}

function metaDescription(value: string, maxLength = 160) {
  if (value.length <= maxLength) return value;

  const shortened = value.slice(0, maxLength - 1).replace(/\s+\S*$/, "").replace(/[,:;.!?]+$/, "");
  return `${shortened}…`;
}

export function getPageSeo(urlValue: string): PageSeo | null {
  const url = new URL(urlValue, DEFAULT_SITE_URL);
  const path = canonicalPath(url.pathname);
  const noindex = hasQuery(url);

  if (/^\/blog\/[^/]+\/$/.test(path)) return null;

  if (path === "/") {
    return {
      title: "Skincare Routines & Product Reviews | The Skin Routine",
      socialTitle: "The Skin Routine",
      description: "Explore practical skincare routines and honest product reviews for different ages, concerns, budgets, and levels of commitment.",
      canonicalPath: "/",
      noindex,
      type: "website",
    };
  }

  if (path === "/about/") {
    return {
      title: "About Sarah Dulat | The Skin Routine",
      socialTitle: "About The Skin Routine",
      description: "Meet Sarah Dulat and learn how The Skin Routine grew from detailed advice for friends into an international skincare resource.",
      canonicalPath: "/about/",
      noindex,
      type: "profile",
    };
  }

  if (path === "/blog/") {
    return {
      title: "Honest Skincare Product Reviews | The Skin Routine",
      socialTitle: "Skincare Product Reviews",
      description: "Read detailed, first-hand skincare product reviews with ingredients, alternatives, pregnancy-safety notes, and clear repurchase verdicts.",
      canonicalPath: "/blog/",
      noindex,
      type: "website",
    };
  }

  const routineSlug = path.match(/^\/routine\/([^/]+)\/$/)?.[1];
  const routine = findRoutineBySlugOrId(routines, routineSlug);

  if (routine && !routine.draft) {
    return {
      title: `${routine.routine_name} | The Skin Routine`,
      socialTitle: routine.routine_name,
      description: metaDescription(routine.point_description),
      canonicalPath: `/routine/${routineSlug}/`,
      noindex,
      type: "website",
    };
  }

  return null;
}
