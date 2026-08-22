---
name: product-review-post
description: Research, draft, revise, illustrate, cross-link, and stage source-backed skincare product review posts for The Skin Routine. Use when a user provides a skincare product or product URL and asks for a review, wants product details and public opinion synthesized, requests comparable alternatives, needs the standard scraped-reference watercolor product cover, asks to connect reviews to matching steps in src/assets/routines.json, or asks to add or update a Markdown review in src/content/reviews.
---

# Product Review Post

Create candid, useful product reviews in Sarah's voice and add them to The Skin Routine repository ready for publication.

## Establish context

1. Read `src/views/AboutView.vue` and `src/content/reviews/my-skincare-routine-has-changed.md` for current voice.
2. Inspect `src/posts.ts` and one recent review before changing content. Preserve unrelated working-tree changes.
3. Read [references/post-format.md](references/post-format.md) before creating or editing frontmatter.
4. Treat the user's firsthand experience as authoritative for the `My Thoughts` and `Verdict` sections. Do not dilute discomfort or irritation to match favorable public reviews.

## Research

Browse whenever a product URL, price, availability, formula, review score, or current alternative is involved.

- Use the linked brand page or official regional page as the primary product source.
- If the product is unavailable in the US, find a reputable US-delivery listing and state that it is imported.
- Compare retailer reviews with community discussions such as Reddit. Report material incentives or sampling disclosures when visible.
- Do not invent a consensus from X, Threads, or another source that has no usable indexed results.
- Link claims and alternatives directly to their supporting product or discussion pages.
- Treat prices as time-sensitive. Use the reader's market and currency; default to US availability and USD when reviewing an imported European product.

## Draft the review

- Write 500–800 body words unless the user requests another length.
- Prefix the title with the brand: `<Brand> <Product Name>`. Never omit or duplicate the brand.
- Write a curiosity-driven summary that describes the review's scope without revealing Sarah's verdict.
- Use first person, precise skincare language, occasional dry humor, and transparent limitations. Do not imitate generic beauty marketing.
- Distinguish brand claims, reviewer reports, and Sarah's experience.
- Avoid diagnosing reactions or overstating ingredient efficacy. Recommend stopping and seeking professional advice for persistent or serious irritation.

Use level-three headings for the main sections and level-four headings for individual FAQs:

1. What the product is, what it claims to do, and who it is for
2. My Thoughts
3. What the Internet Thinks
4. Verdict
5. Alternatives and How They Differ
6. Frequently Asked Questions

Place the affiliate disclosure immediately before the Alternatives section in every product review:

```html
<p class="affiliate-disclosure mt-md">
  Some product links below may be affiliate links.
</p>
```

For alternatives, prioritize two or three products that solve the same problem, not merely products in the same category. When reviewing a dark-spot sunscreen, prefer alternatives with built-in pigment-correcting ingredients. Explain key ingredient, protection, finish, price, and availability differences.

## Create the watercolor cover

Create a watercolor-and-ink product cover for every review unless the user explicitly requests another style or asks for no generated cover. Never use the unedited official packshot as the finished cover.

1. Scrape or download a clean product image from the official brand page and use it as the generation reference. Prefer English packaging for an English post; use a reputable retailer only when the official page has no usable image.
2. Save the scraped reference locally and inspect it before generation. Exclude promotional badges, retailer stickers, hands, props, and unrelated objects unless the user asks to retain them.
3. Use the `imagegen` skill to reillustrate the product as expressive black line art with soft, translucent watercolor washes on warm-white paper. Default to a square canvas with one complete product centered, generous whitespace, and the product occupying about 65–75% of the image height so it works in both the 300px grid and post view.
4. Preserve the packaging silhouette, color blocking, brand hierarchy, and key English label wording. Require the brand and product name to remain recognizable; do not invent extra label text.
5. Inspect the generated result for cropping, duplicate products, malformed packaging, incorrect text, or distracting background elements. Iterate when a material problem remains.
6. Save the selected generated image non-destructively under `public/images/reviews/` with a descriptive `-watercolor` slug and version suffix when needed. Never reference the raw scraped packshot as the final cover unless the user explicitly requests it.
7. Update frontmatter with the generated public image URL and accurate watercolor alt text. Never leave a referenced cover only in a temporary or generated-images directory.

## Stage safely

- Add the finished Markdown file to `src/content/reviews/<descriptive-product-slug>.md`.
- Set `draft: false` when creating a new review post unless the user explicitly requests a draft. This frontmatter setting makes the post publishable but does not authorize deploying, committing, or pushing changes.
- Set `image` to the matching `/images/reviews/<filename>` public URL.
- Do not infer pregnancy safety. Use an authoritative source or established project policy. Treat `pregnancy_safe: true` as positively verified; when uncertain, set `pregnancy_safe: false` and describe it as unverified, never definitively unsafe, in the handoff.
- Keep the title, featured-product name, body name, packaging language, and outbound product link consistent.
- Add every specific product named in the post to `featured_products`, including the reviewed product and all alternatives. Do not add retailers, ingredients, product lines mentioned only as general context, or community/source links.

## Cross-link matching routine steps

After establishing the review's final `uid` and verdict, inspect every AM and PM step in `src/assets/routines.json` for the reviewed product. Check both the `product` field and linked or plain-text mentions inside `description`. Account for harmless naming, punctuation, and capitalization differences, but do not match a different product merely because it shares the same brand or product line.

- Append the link as its own final HTML paragraph in every matching step; preserve the existing description.
- Use the production-safe relative URL `/blog/<uid>`, never a hard-coded localhost or production domain.
- Tailor the sentence to Sarah's verdict and vary the phrasing naturally. Options include “glowing review” or “rave review” for an enthusiastic favorite, “why this product won me over” for a positive discovery, “honest review” or simply “full review” for a nuanced or neutral experience, and “critical review,” “candid review,” or “not-so-glowing review” for a disappointment. These are examples, not fixed templates; choose wording that accurately represents the post without becoming clickbait.
- Keep the chosen phrasing consistent for that product everywhere it appears unless a surrounding sentence makes a small variation read more naturally.
- Do not duplicate a correct existing link. Repair stale or misspelled review slugs and standardize an existing inline review link as the final paragraph.
- If there is no genuine product match, leave the routines unchanged and report that no cross-link was needed.
- If the user explicitly requests `draft: true`, tell them that any new routine links and the review must be published together to avoid a temporarily unavailable destination.

## Validate

1. Confirm body word count is within the requested range.
2. Confirm the title begins with the brand and `tags` includes `review`.
3. Confirm all frontmatter arrays and objects follow the one-line JSON requirement.
4. Compare the body against `featured_products` and confirm every specifically named product appears exactly once with the correct brand, product name, and market-appropriate link.
5. Confirm a newly created review has `draft: false` unless the user explicitly requested a draft. Confirm the scraped product reference was transformed into the standard watercolor-and-ink style, the generated cover exists in `public/images/reviews/`, and every linked product is correct for the intended market.
6. Re-scan `src/assets/routines.json`; confirm every genuine mention of the reviewed product ends with exactly one sentiment-appropriate link to `/blog/<uid>` and that unrelated products were not linked.
7. Run `npm run build` from the repository root.
8. Inspect `git status` afterward. Revert only incidental generated timestamps created by validation, and preserve all unrelated user changes.

Report the post path, cover path, word count, draft state, build result, and any deliberately conservative metadata choice.
