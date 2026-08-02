import routines from "./assets/routines.json";
import { getAllPosts } from "./posts";
import type { Routine } from "./store";

type SearchResultBase = {
  id: string;
  title: string;
  description: string;
  searchText: string;
};

type RoutineStep = {
  title: string;
  product: string;
  description: string;
};

type SearchableRoutine = Routine & {
  name?: string;
  routine_name?: string;
  point_title?: string;
};

export type BlogSearchResult = SearchResultBase & {
  type: "post";
  path: string;
  publicationDate: string;
};

export type RoutineSearchResult = SearchResultBase & {
  type: "routine";
  routine: Routine;
};

export type SearchResults = {
  posts: BlogSearchResult[];
  routines: RoutineSearchResult[];
};

const stripHtml = (text: string) => text.replace(/<[^>]*>/g, " ");

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();

const sortByNewestPost = (a: BlogSearchResult, b: BlogSearchResult) => {
  return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
};

const sortByTitle = (a: SearchResultBase, b: SearchResultBase) => {
  return a.title.localeCompare(b.title);
};

const routineStepsToText = (routine: Routine) => {
  return Object.values(routine.steps)
    .flatMap((timeSteps) => Object.values(timeSteps ?? {}) as RoutineStep[])
    .flatMap((step) => [
      step.title,
      step.product,
      stripHtml(step.description),
    ])
    .join(" ");
};

const buildSearchIndex = () => {
  const posts: BlogSearchResult[] = getAllPosts().map((post) => {
    const title = post.data.title[0]?.text ?? "";
    const description = post.data.summary[0]?.text ?? "";
    const bodyText = post.data.body.map((paragraph) => stripHtml(paragraph.text)).join(" ");
    const productText = post.data.products.map(({ product }) => `${product.brand} ${product.name}`).join(" ");
    const filterText = [
      ...post.tags,
      ...post.data.brands.map((brand) => brand.brand),
      ...post.data.product_types.map((productType) => productType.product_type),
    ].join(" ");
    const searchText = normalize(`${title} ${description} ${bodyText} ${productText} ${filterText}`);

    return {
      type: "post" as const,
      id: post.uid,
      title,
      description,
      path: `/blog/${post.uid}`,
      publicationDate: post.first_publication_date,
      searchText,
    };
  }).sort(sortByNewestPost);

  const routineResults: RoutineSearchResult[] = routines
    .filter((routine) => !routine.draft)
    .map((routine) => {
      const searchableRoutine = routine as SearchableRoutine;
      const routineName = searchableRoutine.name || searchableRoutine.routine_name || "";
      const title = searchableRoutine.point_title || routineName;
      const description = routine.point_description;
      const filters = [...routine.age_range, ...routine.skin_concern].join(" ");
      const sources = (routine.sources ?? []).map((source) => `${source.label} ${source.site} ${source.headline} ${source.summary}`).join(" ");
      const searchText = normalize(`${title} ${routineName} ${description} ${filters} ${routineStepsToText(routine)} ${sources}`);

      return {
        type: "routine" as const,
        id: String(routine.id),
        title,
        description,
        routine,
        searchText,
      };
    })
    .sort(sortByTitle);

  return {
    posts,
    routines: routineResults,
  };
};

const searchIndex = buildSearchIndex();

export function searchSite(query: string): SearchResults {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return {
      posts: [],
      routines: [],
    };
  }

  const terms = normalizedQuery.split(" ").filter(Boolean);
  const matchesTerms = (result: SearchResultBase) => terms.every((term) => result.searchText.includes(term));

  return {
    posts: searchIndex.posts.filter(matchesTerms).slice(0, 6),
    routines: searchIndex.routines.filter(matchesTerms).slice(0, 6),
  };
}
