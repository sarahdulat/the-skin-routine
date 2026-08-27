const affiliateHosts = new Set([
  "amzn.to",
  "sovrn.co",
  "tidd.ly",
]);

function parsedUrl(value: string) {
  try {
    return new URL(value, "https://theskinroutine.com");
  } catch {
    return null;
  }
}

export function isAffiliateUrl(value: string) {
  const url = parsedUrl(value);
  if (!url) return false;

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (affiliateHosts.has(hostname)) return true;

  return hostname.startsWith("amazon.") && url.searchParams.has("tag");
}

export function externalLinkRel(value: string) {
  return isAffiliateUrl(value)
    ? "noopener noreferrer sponsored"
    : "noopener noreferrer";
}

export function qualifyAffiliateLinksInHtml(html: string) {
  return html.replace(/<a\b[^>]*?href=(['"])(https?:\/\/[^'"\s>]+)\1[^>]*>/gi, (anchor, _quote, href) => {
    if (!isAffiliateUrl(href)) return anchor;

    const relMatch = anchor.match(/\brel=(['"])(.*?)\1/i);

    if (relMatch) {
      const values = new Set(relMatch[2].split(/\s+/).filter(Boolean));
      values.add("sponsored");
      return anchor.replace(relMatch[0], `rel=${relMatch[1]}${[...values].join(" ")}${relMatch[1]}`);
    }

    return anchor.replace(/>$/, ' rel="sponsored">');
  });
}
