import fs from "node:fs";
import path from "node:path";

const SITE_ORIGIN = "https://theskinroutine.com";
const SITE_HOSTNAME = "theskinroutine.com";
const DEFAULT_FILES = ["src/assets/routines.json"];
const AFFILIATE_HOSTS = new Set(["amzn.to", "sovrn.co", "tidd.ly"]);

const files = process.argv.slice(2);
const targets = files.length > 0 ? files : DEFAULT_FILES;

function parsedUrl(value) {
  try {
    return new URL(value, SITE_ORIGIN);
  } catch {
    return null;
  }
}

function normalizedHostname(url) {
  return url.hostname.toLowerCase().replace(/^www\./, "");
}

function isExternalUrl(value) {
  const url = parsedUrl(value);

  return Boolean(
    url
    && ["http:", "https:"].includes(url.protocol)
    && normalizedHostname(url) !== SITE_HOSTNAME
  );
}

function isAffiliateUrl(value) {
  const url = parsedUrl(value);
  if (!url) return false;

  const hostname = normalizedHostname(url);
  return AFFILIATE_HOSTS.has(hostname)
    || (hostname.startsWith("amazon.") && url.searchParams.has("tag"));
}

function qualifyExternalLinks(html) {
  let updatedCount = 0;

  const updatedHtml = html.replace(/<a\b[^>]*>/gi, (anchor) => {
    const hrefMatch = anchor.match(/\bhref=(['"])(.*?)\1/i);
    const href = hrefMatch?.[2];

    if (!href || !isExternalUrl(href)) return anchor;

    const targetMatch = anchor.match(/\btarget=(['"])(.*?)\1/i);
    let updatedAnchor = targetMatch
      ? anchor.replace(targetMatch[0], `target=${targetMatch[1]}_blank${targetMatch[1]}`)
      : anchor.replace(/>$/, ' target="_blank">');

    const requiredRelValues = ["noopener", "noreferrer"];
    if (isAffiliateUrl(href)) requiredRelValues.push("sponsored");

    const relMatch = updatedAnchor.match(/\brel=(['"])(.*?)\1/i);
    if (relMatch) {
      const relValues = new Set(relMatch[2].split(/\s+/).filter(Boolean));
      requiredRelValues.forEach((value) => relValues.add(value));
      updatedAnchor = updatedAnchor.replace(
        relMatch[0],
        `rel=${relMatch[1]}${[...relValues].join(" ")}${relMatch[1]}`,
      );
    } else {
      updatedAnchor = updatedAnchor.replace(/>$/, ` rel="${requiredRelValues.join(" ")}">`);
    }

    if (updatedAnchor !== anchor) updatedCount += 1;
    return updatedAnchor;
  });

  return { html: updatedHtml, updatedCount };
}

function qualifyValue(value) {
  if (typeof value === "string") {
    const qualified = qualifyExternalLinks(value);
    return { value: qualified.html, updatedCount: qualified.updatedCount };
  }

  if (Array.isArray(value)) {
    let updatedCount = 0;
    const result = value.map((item) => {
      const qualified = qualifyValue(item);
      updatedCount += qualified.updatedCount;
      return qualified.value;
    });
    return { value: result, updatedCount };
  }

  if (value && typeof value === "object") {
    let updatedCount = 0;
    const result = Object.fromEntries(Object.entries(value).map(([key, item]) => {
      const qualified = qualifyValue(item);
      updatedCount += qualified.updatedCount;
      return [key, qualified.value];
    }));
    return { value: result, updatedCount };
  }

  return { value, updatedCount: 0 };
}

let totalUpdated = 0;

for (const target of targets) {
  const filePath = path.resolve(target);
  const original = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(original);
  const qualified = qualifyValue(parsed);

  if (qualified.updatedCount > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(qualified.value, null, 2)}\n`);
  }

  totalUpdated += qualified.updatedCount;
  console.log(`${target}: ${qualified.updatedCount} external link${qualified.updatedCount === 1 ? "" : "s"} updated`);
}

console.log(`Done. ${totalUpdated} external link${totalUpdated === 1 ? "" : "s"} updated.`);
