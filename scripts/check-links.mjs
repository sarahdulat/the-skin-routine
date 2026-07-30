import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["index.html", "public", "src"];
const skipDirs = new Set(["dist", "node_modules", ".git"]);
const fileExtensions = new Set([".html", ".css", ".scss", ".vue", ".ts", ".js", ".json", ".md", ".txt", ".xml"]);
const inactivePatterns = [
  /page not found/i,
  /product not found/i,
  /productnotcarried/i,
  /no longer available/i,
  /currently unavailable/i,
  /item unavailable/i,
  /out of stock/i,
  /sold out/i,
  /discontinued/i,
  /this product is unavailable/i,
];

const files = [];

function extensionFor(file) {
  const match = file.match(/\.[^.]+$/);
  return match?.[0] ?? "";
}

function walk(path) {
  const stat = statSync(path);

  if (stat.isDirectory()) {
    const dirname = path.split("/").pop();
    if (skipDirs.has(dirname)) return;

    for (const item of readdirSync(path)) {
      walk(join(path, item));
    }
    return;
  }

  if (fileExtensions.has(extensionFor(path))) {
    files.push(path);
  }
}

for (const root of roots) {
  walk(root);
}

const urls = new Map();
const urlPattern = /https?:\/\/[^\s"<>\\)]+/g;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const matches = content.matchAll(urlPattern);

  for (const match of matches) {
    const url = match[0]
      .replace(/&quot;.*$/, "")
      .replace(/[),.;']+$/, "");

    if (!urls.has(url)) {
      urls.set(url, new Set());
    }
    urls.get(url).add(file);
  }
}

function isLikelyProductUrl(url) {
  return /amazon|amzn\.to|sephora|ulta|dermstore|laroche-posay|theordinary|supergoop|tatcha|rhodeskin|augustinusbader|isclinical|caudalie|glossier|bioderma|eltamd|laprairie|sisley|aesop|lancer|beautybay|peterthomasroth|colorescience|lorealparis|caretobeauty|shop-apotheke|avene|bluemercury|biologique-recherche|environ|jilliandempsey|duabyab|bibalosangeles|furtunaskin|personalday|theoutset|111skin|blocskincare|unisonhome|apoteket|vintagetradition|basiclab|mynuface|embryolisse|solawave|differin/i.test(url);
}

function classifyStatus(status) {
  if (status >= 200 && status < 400) return "ok";
  if ([401, 403, 429, 503].includes(status)) return "manual";
  return "broken";
}

async function checkUrl(url, files) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14000);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 link-checker for theskinroutine.com",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";
    let inactiveMatch = "";

    if (isLikelyProductUrl(url) && contentType.includes("text/html") && response.ok) {
      const text = (await response.text()).slice(0, 160000);
      inactiveMatch = inactivePatterns.find((pattern) => pattern.test(text))?.source ?? "";
    }

    return {
      url,
      status: response.status,
      finalUrl: response.url,
      category: inactiveMatch ? "inactive-suspected" : classifyStatus(response.status),
      inactiveMatch,
      files: [...files],
    };
  } catch (error) {
    return {
      url,
      status: 0,
      finalUrl: "",
      category: "manual",
      error: error instanceof Error ? error.message : String(error),
      files: [...files],
    };
  } finally {
    clearTimeout(timeout);
  }
}

const entries = [...urls.entries()];
const concurrency = 8;
const results = [];

for (let index = 0; index < entries.length; index += concurrency) {
  const chunk = entries.slice(index, index + concurrency);
  results.push(...await Promise.all(chunk.map(([url, files]) => checkUrl(url, files))));
  process.stderr.write(`Checked ${Math.min(index + concurrency, entries.length)} / ${entries.length}\n`);
}

const priority = {
  broken: 0,
  "inactive-suspected": 1,
  manual: 2,
  ok: 3,
};

results.sort((a, b) => priority[a.category] - priority[b.category] || a.url.localeCompare(b.url));

console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  total: results.length,
  counts: results.reduce((counts, result) => {
    counts[result.category] = (counts[result.category] ?? 0) + 1;
    return counts;
  }, {}),
  results,
}, null, 2));
