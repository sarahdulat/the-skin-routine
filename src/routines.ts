import type { Routine } from "./store";

type FeaturedProduct = {
  brand: string;
  name: string;
  link?: string;
};

export type RoutineProductMention = {
  routine: Routine;
  productName: string;
};

export function routineSlug(routine: Routine) {
  return routine.routine_name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function findRoutineBySlugOrId(routines: Routine[], slugOrId: string | null | undefined) {
  if (!slugOrId) return null;

  const routineId = Number(slugOrId);

  if (Number.isFinite(routineId)) {
    return routines.find((routine) => routine.id === routineId) ?? null;
  }

  return routines.find((routine) => routineSlug(routine) === slugOrId) ?? null;
}

export function newestRoutine(routines: Routine[]) {
  return [...routines].reverse().find((routine) => !routine.draft) ?? null;
}

function normalizeProductText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(url: string | undefined) {
  if (!url) return "";

  return url.toLowerCase().replace(/\/$/, "");
}

function productMentionCandidates(product: FeaturedProduct) {
  const brandedProductName = normalizeProductText(`${product.brand} ${product.name}`);

  return brandedProductName.length >= 8 ? [brandedProductName] : [];
}

export function findRoutineProductMentions(routines: Routine[], products: FeaturedProduct[]): RoutineProductMention[] {
  const productCandidates = products.map((product) => ({
    label: `${product.brand} ${product.name}`,
    brand: normalizeProductText(product.brand),
    candidates: productMentionCandidates(product),
    link: normalizeUrl(product.link),
    nameTokens: productNameTokens(product.name),
  }));
  const mentions = new Map<number, RoutineProductMention>();

  routines
    .filter((routine) => !routine.draft)
    .forEach((routine) => {
      const routineSteps = Object.values(routine.steps).flatMap((steps) => Object.values(steps ?? {}));
      const matchedProduct = productCandidates.find((product) => {
        if (isRegionalRoutineMismatch(routine, product.brand)) return false;

        return routineSteps.some((step) => stepMatchesProduct(step, product));
      });

      if (matchedProduct) {
        mentions.set(routine.id, {
          routine,
          productName: matchedProduct.label,
        });
      }
    });

  return [...mentions.values()].sort((a, b) => a.routine.routine_name.localeCompare(b.routine.routine_name));
}

const genericProductTokens = new Set(["the", "and", "for", "with", "of", "a", "an", "starter", "kit"]);

function productNameTokens(productName: string) {
  return normalizeProductText(productName)
    .split(" ")
    .filter((token) => token && !genericProductTokens.has(token));
}

function stepMatchesProduct(
  step: { product: string; link?: string; description?: string },
  product: {
    brand: string;
    candidates: string[];
    link: string;
    nameTokens: string[];
  },
) {
  const stepLink = normalizeUrl(step.link);
  const stepDescription = step.description ?? "";

  if (product.link && stepLink === product.link) return true;
  if (product.link && normalizeUrl(stepDescription).includes(product.link)) return true;

  return textMatchesProduct(step.product, product) || textMatchesProduct(stepDescription, product);
}

function textMatchesProduct(
  text: string,
  product: {
    brand: string;
    candidates: string[];
    nameTokens: string[];
  },
) {
  const normalizedText = normalizeProductText(text);
  const textTokens = new Set(normalizedText.split(" ").filter(Boolean));
  const brandTokens = product.brand.split(" ").filter(Boolean);

  if (product.candidates.some((candidate) => normalizedText.includes(candidate))) return true;
  if (!brandTokens.every((token) => textTokens.has(token))) return false;

  const matchedNameTokens = product.nameTokens.filter((token) => textTokens.has(token)).length;
  const requiredNameTokens = product.nameTokens.length <= 2
    ? product.nameTokens.length
    : Math.ceil(product.nameTokens.length * 0.75);

  return matchedNameTokens >= requiredNameTokens;
}

const brandRegions: Record<string, "fr" | "kr" | "us"> = {
  acm: "fr",
  embryolisse: "fr",
  "la roche posay": "fr",
  nuface: "us",
  supergoop: "us",
  skin1004: "kr",
  laneige: "kr",
};

function routineRegion(routine: Routine) {
  const routineName = routine.routine_name.toLowerCase();

  if (routineName.startsWith("french pharmacy")) return "fr";
  if (routineName.startsWith("korean skincare")) return "kr";

  return null;
}

function isRegionalRoutineMismatch(routine: Routine, brand: string) {
  const region = routineRegion(routine);
  const brandRegion = brandRegions[brand];

  return Boolean(region && brandRegion && region !== brandRegion);
}
