const affiliateHosts = new Set([
  "amzn.to",
  "sovrn.co",
  "tidd.ly",
]);
const siteOrigin = "https://theskinroutine.com";
const siteHostname = "theskinroutine.com";

function parsedUrl(value: string) {
  try {
    return new URL(value, siteOrigin);
  } catch {
    return null;
  }
}

export function isExternalUrl(value: string) {
  const url = parsedUrl(value);
  const hostname = url?.hostname.toLowerCase().replace(/^www\./, "");

  return Boolean(
    url
    && ["http:", "https:"].includes(url.protocol)
    && hostname !== siteHostname
  );
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

export function qualifyExternalLinksInHtml(html: string) {
  return html.replace(/<a\b[^>]*>/gi, (anchor) => {
    const hrefMatch = anchor.match(/\bhref=(['"])(.*?)\1/i);
    const href = hrefMatch?.[2];

    if (!href || !isExternalUrl(href)) return anchor;

    const targetMatch = anchor.match(/\btarget=(['"])(.*?)\1/i);
    let qualifiedAnchor = targetMatch
      ? anchor.replace(targetMatch[0], `target=${targetMatch[1]}_blank${targetMatch[1]}`)
      : anchor.replace(/>$/, ' target="_blank">');

    const relMatch = qualifiedAnchor.match(/\brel=(['"])(.*?)\1/i);
    const requiredRelValues = externalLinkRel(href).split(" ");

    if (relMatch) {
      const values = new Set(relMatch[2].split(/\s+/).filter(Boolean));
      requiredRelValues.forEach((value) => values.add(value));
      return qualifiedAnchor.replace(relMatch[0], `rel=${relMatch[1]}${[...values].join(" ")}${relMatch[1]}`);
    }

    return qualifiedAnchor.replace(/>$/, ` rel="${requiredRelValues.join(" ")}">`);
  });
}
