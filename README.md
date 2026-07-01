# the-skin-routine

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

## Reviews

Reviews are stored locally as Markdown files in `src/content/reviews`.
Each file uses frontmatter for the review metadata and Markdown for the body:

```md
---
uid: "example-review"
title: "Example Review"
summary: "Short description shown on the blog archive."
date: "2024-01-01"
first_publication_date: "2024-01-01T00:00:00+0000"
last_publication_date: "2024-01-01T00:00:00+0000"
tags: ["cleanser"]
brands: ["Example Brand"]
product_types: ["Cleanser"]
pregnancy_safe: true
image: "/images/reviews/example-review.jpg"
image_alt: "Example product"
---

Write the review body here.
```

Review images live in `public/images/reviews`.

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
