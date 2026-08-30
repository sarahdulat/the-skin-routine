import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const ssrDir = path.join(rootDir, ".ssr");
const template = await readFile(path.join(distDir, "index.html"), "utf8");
const serverEntry = await import(pathToFileURL(path.join(ssrDir, "entry-server.mjs")).href);
const routes = serverEntry.publishedPageRoutes();

function pagePath(route) {
  return route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route.replace(/^\//, ""), "index.html");
}

function withRenderedPage(appHtml, headHtml) {
  return template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
    .replace("</head>", `    ${headHtml}\n  </head>`)
    .replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
}

function withoutClientScript(html) {
  return html.replace(/\s*<script type="module"[^>]*src="[^"]+"><\/script>/i, "");
}

for (const route of routes) {
  const { appHtml, headHtml } = await serverEntry.renderPage(route);
  const outputPath = pagePath(route);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, withRenderedPage(appHtml, headHtml));
}

const notFoundPage = await serverEntry.renderNotFoundPage();
await writeFile(
  path.join(distDir, "404.html"),
  withoutClientScript(withRenderedPage(notFoundPage.appHtml, notFoundPage.headHtml)),
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length} pages plus a dedicated 404 page.`);
