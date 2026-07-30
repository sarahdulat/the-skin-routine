import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const siteUrl = (process.env.SITE_URL ?? "https://www.theskinroutine.com").replace(/\/$/, "");

function escapeXml(value) {
  return String(value)
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

function toRssDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function toAbsoluteUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  return `${siteUrl}${String(value).startsWith("/") ? "" : "/"}${value}`;
}

async function getReviewItems() {
  const reviewsDir = path.join(rootDir, "src/content/reviews");
  const files = (await readdir(reviewsDir)).filter((file) => file.endsWith(".md"));

  const items = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(reviewsDir, file), "utf8");
      const frontmatter = readFrontmatter(source);
      if (frontmatter.draft) return null;

      const uid = frontmatter.uid ?? file.replace(/\.md$/, "");
      const link = `${siteUrl}/blog/${uid}`;
      const pubDate = frontmatter.first_publication_date ?? frontmatter.date ?? new Date().toISOString();
      const updatedDate = frontmatter.last_publication_date ?? pubDate;

      return {
        title: frontmatter.title ?? uid,
        description: frontmatter.summary ?? "",
        link,
        guid: link,
        pubDate,
        updatedDate,
        image: toAbsoluteUrl(frontmatter.image),
        imageAlt: frontmatter.image_alt ?? frontmatter.title ?? "",
        categories: [...(frontmatter.tags ?? []), ...(frontmatter.brands ?? []), ...(frontmatter.product_types ?? [])],
      };
    }),
  );

  return items
    .filter(Boolean)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

function toItem(item) {
  const enclosure = item.image
    ? `
      <enclosure url="${escapeXml(item.image)}" type="image/${path.extname(item.image).slice(1) || "jpeg"}" />`
    : "";
  const categories = item.categories
    .map((category) => `
      <category>${escapeXml(category)}</category>`)
    .join("");

  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRssDate(item.pubDate)}</pubDate>
      <lastBuildDate>${toRssDate(item.updatedDate)}</lastBuildDate>${enclosure}${categories}
    </item>`;
}

const items = await getReviewItems();
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Skin Routine Reviews</title>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>Latest skincare product reviews from The Skin Routine.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.map(toItem).join("\n")}
  </channel>
</rss>
`;

await writeFile(path.join(rootDir, "public/rss.xml"), rss);
console.log(`Generated public/rss.xml with ${items.length} items.`);
