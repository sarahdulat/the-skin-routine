import type { Post } from "./types";

type ReviewFrontmatter = {
  uid: string;
  title: string;
  summary: string;
  date: string;
  first_publication_date: string;
  last_publication_date: string;
  tags: string[];
  brands: string[];
  product_types: string[];
  pregnancy_safe: boolean;
  image: string;
  image_alt: string;
};

const reviewFiles = import.meta.glob("./content/reviews/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseMarkdownFile(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Review Markdown files must include frontmatter.");
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function parseFrontmatter(source: string): ReviewFrontmatter {
  const frontmatter: Record<string, unknown> = {};

  for (const line of source.split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    try {
      frontmatter[key] = JSON.parse(rawValue);
    } catch {
      frontmatter[key] = rawValue;
    }
  }

  return frontmatter as ReviewFrontmatter;
}

function markdownToBody(markdown: string): Post["data"]["body"] {
  if (!markdown) return [];

  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = block.match(/^(#{1,6})\s+(.+)$/);

      if (heading) {
        return {
          type: `heading${heading[1].length}`,
          text: renderInlineMarkdown(heading[2]),
          spans: [],
          direction: "ltr",
        };
      }

      return {
        type: "paragraph",
        text: renderInlineMarkdown(block.replace(/\n/g, "<br>")),
        spans: [],
        direction: "ltr",
      };
    });
}

function renderInlineMarkdown(text: string) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toPost(frontmatter: ReviewFrontmatter, markdown: string): Post {
  return {
    alternate_languages: [],
    data: {
      body: markdownToBody(markdown),
      brands: frontmatter.brands.map((brand) => ({ brand })),
      date: frontmatter.date,
      image: {
        alt: frontmatter.image_alt,
        copyright: null,
        dimensions: {
          width: 0,
          height: 0,
        },
        edit: {
          x: 0,
          y: 0,
          zoom: 1,
          background: "transparent",
        },
        id: frontmatter.uid,
        url: frontmatter.image,
      },
      product_types: frontmatter.product_types.map((product_type) => ({ product_type })),
      pregnancy_safe: frontmatter.pregnancy_safe,
      products: [],
      summary: [
        {
          type: "paragraph",
          text: frontmatter.summary,
          spans: [],
          direction: "ltr",
        },
      ],
      title: [
        {
          type: "heading1",
          text: frontmatter.title,
          spans: [],
          direction: "ltr",
        },
      ],
    },
    first_publication_date: frontmatter.first_publication_date,
    href: "",
    id: frontmatter.uid,
    lang: "en-us",
    last_publication_date: frontmatter.last_publication_date,
    linked_documents: [],
    slugs: [frontmatter.uid],
    tags: frontmatter.tags,
    type: "review",
    uid: frontmatter.uid,
    url: null,
  };
}

const posts = Object.values(reviewFiles)
  .map((source) => {
    const { frontmatter, body } = parseMarkdownFile(source);
    return toPost(frontmatter, body);
  })
  .sort((a, b) => new Date(b.first_publication_date).getTime() - new Date(a.first_publication_date).getTime());

export function getAllPosts() {
  return posts;
}

export function getPostsByFilters(filters: { brands?: string; productTypes?: string; pregnancySafeOnly?: boolean }) {
  return posts.filter((post) => {
    const brandMatch = matchesFilter(filters.brands, post.data.brands.map((item) => item.brand));
    const productTypeMatch = matchesFilter(filters.productTypes, post.data.product_types.map((item) => item.product_type));
    const pregnancySafeMatch = !filters.pregnancySafeOnly || post.data.pregnancy_safe;

    return brandMatch && productTypeMatch && pregnancySafeMatch;
  });
}

export function getPostByUID(uid: string) {
  return posts.find((post) => post.uid === uid) ?? null;
}

export function getAdjacentPosts(uid: string) {
  const index = posts.findIndex((post) => post.uid === uid);

  if (index === -1) {
    return {
      prevPost: null,
      nextPost: null,
    };
  }

  return {
    prevPost: posts[index + 1] ?? null,
    nextPost: posts[index - 1] ?? null,
  };
}

function matchesFilter(selected: string | undefined, values: string[]) {
  return selected == null || selected === "all" || values.includes(selected);
}
