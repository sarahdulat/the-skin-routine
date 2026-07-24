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

  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return null;

        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();

        try {
          return [key, JSON.parse(rawValue)];
        } catch {
          return [key, rawValue];
        }
      })
      .filter(Boolean),
  );
}

async function getReviewUrls() {
  const reviewsDir = path.join(rootDir, "src/content/reviews");
  const files = (await readdir(reviewsDir)).filter((file) => file.endsWith(".md")).sort();

  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(reviewsDir, file), "utf8");
      const frontmatter = readFrontmatter(source);
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
}

function toUrlEntry(entry) {
  return `  <url>
    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

const urls = [...staticUrls, ...(await getReviewUrls())];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(toUrlEntry).join("\n")}
</urlset>
`;

await writeFile(path.join(rootDir, "public/sitemap.xml"), sitemap);
console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);
