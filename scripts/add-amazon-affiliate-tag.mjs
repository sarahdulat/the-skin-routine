import fs from "node:fs";
import path from "node:path";

const AMAZON_TAG = "theskinrout07-20";
const DEFAULT_FILES = ["src/assets/routines.json"];

const files = process.argv.slice(2);
const targets = files.length > 0 ? files : DEFAULT_FILES;
const amazonUrlPattern = /https:\/\/(?:www\.)?amazon\.com\/[^\s"'<>\\)]+/g;

const tagAmazonUrl = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    if (!url.hostname.endsWith("amazon.com")) return rawUrl;

    url.searchParams.set("tag", AMAZON_TAG);
    return url.toString();
  } catch {
    return rawUrl;
  }
};

let totalUpdated = 0;

for (const target of targets) {
  const filePath = path.resolve(target);
  const original = fs.readFileSync(filePath, "utf8");
  let updatedCount = 0;

  const updated = original.replace(amazonUrlPattern, (url) => {
    const tagged = tagAmazonUrl(url);
    if (tagged !== url) updatedCount += 1;
    return tagged;
  });

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
  }

  totalUpdated += updatedCount;
  console.log(`${target}: ${updatedCount} Amazon link${updatedCount === 1 ? "" : "s"} tagged`);
}

console.log(`Done. ${totalUpdated} Amazon link${totalUpdated === 1 ? "" : "s"} tagged with ${AMAZON_TAG}.`);
