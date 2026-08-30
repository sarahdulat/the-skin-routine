import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import routines from "./assets/routines.json";
import { getAllPosts } from "./posts";
import { routineSlug } from "./routines";

type ReviewFrontmatter = {
  uid?: unknown;
  title?: unknown;
  summary?: unknown;
  seo_title?: unknown;
  seo_description?: unknown;
  date?: unknown;
  first_publication_date?: unknown;
  last_publication_date?: unknown;
  tags?: unknown;
  brands?: unknown;
  product_types?: unknown;
  featured_products?: unknown;
  pregnancy_safe?: unknown;
  draft?: unknown;
  image?: unknown;
  image_alt?: unknown;
};

const reviewFiles = import.meta.glob("./content/reviews/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseMarkdownFile(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Review Markdown files must include frontmatter.");
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function parseFrontmatter(source: string): ReviewFrontmatter {
  const frontmatter: Record<string, unknown> = {};
  const lines = source.split("\n");

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyMatch) {
      index += 1;
      continue;
    }

    const [, key, inlineValue] = keyMatch;
    const valueLines = [];

    if (inlineValue.trim()) {
      valueLines.push(inlineValue.trim());
      index += 1;
    } else {
      index += 1;

      while (index < lines.length && !lines[index].match(/^([A-Za-z0-9_-]+):\s*(.*)$/)) {
        valueLines.push(lines[index]);
        index += 1;
      }
    }

    frontmatter[key] = parseFrontmatterValue(valueLines.join("\n").trim());
  }

  return frontmatter;
}

function parseFrontmatterValue(rawValue: string) {
  if (!rawValue) return "";

  const jsonLikeValue = rawValue.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(jsonLikeValue);
  } catch {
    return rawValue;
  }
}

function reviewSlugFromPath(filePath: string) {
  return path.basename(filePath, ".md");
}

function isSlug(value: unknown) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isValidDate(value: unknown) {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function publicFileExists(publicPath: string) {
  return existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

describe("content validation", () => {
  it("keeps every review markdown file in the expected frontmatter shape", () => {
    const parsedReviews = Object.entries(reviewFiles).map(([filePath, source]) => ({
      filePath,
      slug: reviewSlugFromPath(filePath),
      ...parseMarkdownFile(source),
    }));

    expect(parsedReviews.length).toBeGreaterThan(0);

    for (const review of parsedReviews) {
      const frontmatter = review.frontmatter;

      expect(isSlug(frontmatter.uid), `${review.filePath} uid`).toBe(true);
      expect(isNonEmptyString(frontmatter.title), `${review.filePath} title`).toBe(true);
      expect(isNonEmptyString(frontmatter.summary), `${review.filePath} summary`).toBe(true);
      expect(isNonEmptyString(frontmatter.seo_title), `${review.filePath} seo_title`).toBe(true);
      expect(isNonEmptyString(frontmatter.seo_description), `${review.filePath} seo_description`).toBe(true);
      expect(isValidDate(frontmatter.date), `${review.filePath} date`).toBe(true);
      expect(isValidDate(frontmatter.first_publication_date), `${review.filePath} first_publication_date`).toBe(true);
      expect(isValidDate(frontmatter.last_publication_date), `${review.filePath} last_publication_date`).toBe(true);
      expect(Array.isArray(frontmatter.tags), `${review.filePath} tags`).toBe(true);
      expect(Array.isArray(frontmatter.brands), `${review.filePath} brands`).toBe(true);
      expect(Array.isArray(frontmatter.product_types), `${review.filePath} product_types`).toBe(true);
      expect(typeof frontmatter.pregnancy_safe, `${review.filePath} pregnancy_safe`).toBe("boolean");
      expect(typeof frontmatter.draft, `${review.filePath} draft`).toBe("boolean");
      expect(isNonEmptyString(frontmatter.image), `${review.filePath} image`).toBe(true);
      expect(review.body.length, `${review.filePath} body`).toBeGreaterThan(0);

      if (!frontmatter.draft) {
        expect(isNonEmptyString(frontmatter.image_alt), `${review.filePath} image_alt`).toBe(true);
      }
    }
  });

  it("keeps featured_products formatted as an array of complete product records", () => {
    Object.entries(reviewFiles).forEach(([filePath, source]) => {
      const { frontmatter } = parseMarkdownFile(source);

      if (frontmatter.featured_products === undefined) return;

      expect(Array.isArray(frontmatter.featured_products), `${filePath} featured_products`).toBe(true);

      for (const product of frontmatter.featured_products as Record<string, unknown>[]) {
        expect(isNonEmptyString(product.brand), `${filePath} featured_products brand`).toBe(true);
        expect(isNonEmptyString(product.name), `${filePath} featured_products name`).toBe(true);
        expect(isNonEmptyString(product.link), `${filePath} featured_products link`).toBe(true);
      }
    });
  });

  it("publishes only unique review slugs with existing local images", () => {
    const posts = getAllPosts();
    const slugs = posts.map((post) => post.uid);

    expect(new Set(slugs).size).toBe(slugs.length);

    for (const post of posts) {
      expect(post.data.title[0]?.text, `${post.uid} title`).toBeTruthy();
      expect(post.data.summary[0]?.text, `${post.uid} summary`).toBeTruthy();
      expect(post.data.image.url, `${post.uid} image`).toMatch(/^\/images\//);
      expect(publicFileExists(post.data.image.url), `${post.uid} image file`).toBe(true);
      expect(post.data.products.every(({ product }) => product.brand && product.name && product.link), `${post.uid} products`).toBe(true);
    }
  });

  it("keeps routine ids and slugs unique with valid public step data", () => {
    const ids = routines.map((routine) => routine.id);
    const slugs = routines.map((routine) => routineSlug(routine));

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const routine of routines.filter((routine) => !routine.draft)) {
      expect(routine.routine_name, `${routine.id} routine_name`).toBeTruthy();
      expect(routine.point_description, `${routine.id} point_description`).toBeTruthy();
      expect(routine.time, `${routine.id} time`).toBeGreaterThanOrEqual(0);
      expect(routine.time, `${routine.id} time`).toBeLessThanOrEqual(12);
      expect(routine.cost, `${routine.id} cost`).toBeGreaterThanOrEqual(0);
      expect(routine.cost, `${routine.id} cost`).toBeLessThanOrEqual(12);
      expect(Array.isArray(routine.age_range), `${routine.id} age_range`).toBe(true);
      expect(Array.isArray(routine.skin_concern), `${routine.id} skin_concern`).toBe(true);

      for (const time of ["am", "pm"] as const) {
        routine.steps[time].forEach((step, index) => {
          expect(step.time, `${routine.routine_name} ${time} step ${index + 1} time`).toBe(time);
          expect(step.title, `${routine.routine_name} ${time} step ${index + 1} title`).toBeTruthy();
          expect(step.product, `${routine.routine_name} ${time} step ${index + 1} product`).toBeTruthy();
          expect(step.link, `${routine.routine_name} ${time} step ${index + 1} link`).toMatch(/^https?:\/\//);
          expect(step.description, `${routine.routine_name} ${time} step ${index + 1} description`).toBeTruthy();
        });
      }
    }
  });

  it("keeps draft reviews and routines out of sitemap and RSS output", () => {
    const sitemap = readFileSync(path.join(process.cwd(), "public/sitemap.xml"), "utf8");
    const rss = readFileSync(path.join(process.cwd(), "public/rss.xml"), "utf8");
    const publishedPostUids = getAllPosts().map((post) => post.uid);
    const publishedRoutineSlugs = routines
      .filter((routine) => !routine.draft)
      .map((routine) => routineSlug(routine));

    for (const uid of publishedPostUids) {
      expect(sitemap, `${uid} sitemap`).toContain(`/blog/${uid}/`);
      expect(rss, `${uid} rss`).toContain(`/blog/${uid}/`);
    }

    for (const routineSlugValue of publishedRoutineSlugs) {
      expect(sitemap, `${routineSlugValue} sitemap`).toContain(`/routine/${routineSlugValue}/`);
    }

    Object.entries(reviewFiles).forEach(([filePath, source]) => {
      const { frontmatter } = parseMarkdownFile(source);
      if (!frontmatter.draft) return;

      const uid = String(frontmatter.uid ?? reviewSlugFromPath(filePath));
      expect(sitemap, `${uid} draft sitemap`).not.toContain(`/blog/${uid}/`);
      expect(rss, `${uid} draft rss`).not.toContain(`/blog/${uid}/`);
    });

    routines.filter((routine) => routine.draft).forEach((routine) => {
      expect(sitemap, `${routine.routine_name} draft sitemap`).not.toContain(`/routine/${routineSlug(routine)}/`);
    });
  });
});
