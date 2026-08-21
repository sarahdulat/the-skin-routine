import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const siteUrl = (process.env.SITE_URL ?? "https://www.theskinroutine.com").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
  { path: "/about", lastmod: today, changefreq: "monthly", priority: "0.6" },
  { path: "/blog/", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/faq", lastmod: today, changefreq: "monthly", priority: "0.5" },
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function readFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split("\n");

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

function parseFrontmatterValue(rawValue) {
  if (!rawValue) return "";

  const jsonLikeValue = rawValue.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(jsonLikeValue);
  } catch {
    return rawValue;
  }
}

function routineSlug(routine) {
  return routine.routine_name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getReviewUrls() {
  const reviewsDir = path.join(rootDir, "src/content/reviews");
  const files = (await readdir(reviewsDir)).filter((file) => file.endsWith(".md")).sort();

  const urls = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(reviewsDir, file), "utf8");
      const frontmatter = readFrontmatter(source);
      if (frontmatter.draft) return null;

      const uid = frontmatter.uid ?? file.replace(/\.md$/, "");
      const lastmod = String(frontmatter.last_publication_date ?? frontmatter.date ?? today).slice(0, 10);

      return {
        path: `/blog/${uid}`,
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
      };
    }),
  );

  return urls.filter(Boolean);
}

async function getRoutineUrls() {
  const routinesPath = path.join(rootDir, "src/assets/routines.json");
  const routines = JSON.parse(await readFile(routinesPath, "utf8"));

  return routines
    .filter((routine) => !routine.draft)
    .map((routine) => ({
      path: `/routine/${routineSlug(routine)}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.6",
    }));
}

function toUrlEntry(entry) {
  return `  <url>
    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

const urls = [...staticUrls, ...(await getReviewUrls()), ...(await getRoutineUrls())];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(toUrlEntry).join("\n")}
</urlset>
`;

await writeFile(path.join(rootDir, "public/sitemap.xml"), sitemap);
console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);
