# Review post format

The parser in `src/posts.ts` reads frontmatter one line at a time and attempts `JSON.parse` on each value. Keep arrays and objects on one line as valid JSON. Do not let a formatter expand them across lines.

Use this template:

```markdown
---
uid: "<lowercase-hyphenated-slug>"
title: "<Brand> <Product Name>"
summary: "<Neutral, curiosity-driven summary without the verdict>"
seo_title: "<Concise, search-focused product review title>"
seo_description: "<Unique search description explaining what the review covers without revealing the verdict>"
date: "<YYYY-MM-DD>"
first_publication_date: "<YYYY-MM-DDTHH:MM:SS+ZZZZ>"
last_publication_date: "<YYYY-MM-DDTHH:MM:SS+ZZZZ>"
tags: ["review", "<category>", "<concern>", "<brand>"]
brands: ["<Brand>"]
product_types: ["<Product Type>"]
featured_products: [{"brand":"<Brand>","name":"<Reviewed Product Name>","link":"<current product URL>"},{"brand":"<Alternative Brand>","name":"<Alternative Product Name>","link":"<current alternative URL>"}]
pregnancy_safe: false
draft: false
image: "/images/reviews/<product-slug>-watercolor.png"
image_alt: "Watercolor and ink illustration of <Brand> <Product Name>"
---
```

## Field rules

- `uid`: stable, descriptive, and lowercase with hyphens.
- `title`: always begin with the brand name.
- `summary`: invite the reader into the review without revealing the verdict.
- `seo_title` (optional parser field, required by this review workflow): write a concise search title that includes the brand, recognizable product name, and “review” where natural. Do not include `| The Skin Routine`; the site adds that suffix automatically. When absent, the application falls back to `title`.
- `seo_description` (optional parser field, required by this review workflow): summarize the review's useful scope in natural language, including relevant details such as texture, finish, testing experience, skin type, or alternatives. Keep it distinct from the editorial summary and do not reveal Sarah's verdict. When absent, the application falls back to `summary`.
- `tags`: always include `review`; add product category, concern, and normalized brand tag.
- `brands`: use official capitalization.
- `product_types`: match existing project values, such as `SPF`, `Cleanser`, `Moisturizer`, or `Serum`.
- `featured_products`: include the reviewed product and every other specific product named in the body, including all alternatives. Each product must appear exactly once with its correct brand, full product name, and a market-appropriate product link. Do not include retailers, ingredients, general product-line references, or research/community sources as products.
- `pregnancy_safe`: do not infer. Default to `false` when authoritative verification is unavailable.
- `draft`: use `false` for a new review unless the user explicitly requests a draft.
- `image`: use the public URL for the generated watercolor-and-ink cover, not the raw scraped reference or a filesystem path.
- `image_alt`: identify the artwork as a watercolor and ink illustration and name the brand and product.

Before handoff, verify that `src/posts.ts` can parse the post and that the build succeeds.
