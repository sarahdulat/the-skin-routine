import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const ssrDir = path.join(rootDir, ".ssr");
const template = await readFile(path.join(distDir, "index.html"), "utf8");
const serverEntry = await import(pathToFileURL(path.join(ssrDir, "entry-server.mjs")).href);
const reviewRoutes = serverEntry.publishedReviewRoutes();

function pagePath(route) {
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

function withRenderedPage(appHtml, headHtml) {
  return template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
    .replace("</head>", `    ${headHtml}\n  </head>`)
    .replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
}

for (const route of reviewRoutes) {
  const { appHtml, headHtml } = await serverEntry.renderReview(route);
  const outputPath = pagePath(route);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, withRenderedPage(appHtml, headHtml));
}

const sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
const routePaths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)]
  .map((match) => new URL(match[1], "https://theskinroutine.com").pathname)
  .filter((route) => route !== "/");

for (const route of routePaths) {
  const outputPath = pagePath(route);

  try {
    await access(outputPath);
  } catch {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, template);
  }
}

await rm(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${reviewRoutes.length} review pages.`);
