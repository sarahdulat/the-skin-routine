<template>
  <main ref="postMain">
    <SEO :post="post" />
    <div>
      <ReviewBar :prevPost="prevPost" :nextPost="nextPost" :isLoading="isReviewBarLoading" />
      <div ref="postScrollContainer" class="scroll-container">
        <div v-if="post">
          <div class="cover-media">
            <ResponsiveImage :src="post.data.image.url" :alt="post.data.image.alt" img-class="cover-img"
              sizes="(max-width: 768px) 100vw, 75vw" loading="eager" fetchpriority="high" />
          </div>
          <section>
            <div class="px-xl">
              <p class="mt-xl">{{ formatDate(post.first_publication_date) }}</p>
              <p v-if="formatDate(post.last_publication_date) !== formatDate(post.first_publication_date)">Updated: {{
                formatDate(post.last_publication_date) }}</p>
              <div class="mt-lg">
                <router-link v-for="tag in post.tags" :key="tag" class="tag-link text-uppercase font-sans me-md"
                  :to="{ name: 'blog', query: { Tag: tag } }">
                  #{{ tag }}
                </router-link>
              </div>
              <div v-if="post.data.products.length > 0" class="featured-products mt-xl">
                <p>Featured Products</p>
                <span v-for="product in post.data.products" :key="product.product.id">
                  <a :href="product.product.link" target="_blank" :rel="externalLinkRel(product.product.link)">
                    <span class="glyph me-md">🩸</span>{{ product.product.brand }} {{ product.product.name }}
                  </a>
                  <!-- <a :href="product.product.link" target="_blank" rel="noopener noreferrer" class="button-link px-sm ms-lg">Buy</a> -->
                </span>
              </div>
              <div v-if="routineProductMentions.length > 0" class="featured-products routine-mentions mt-xl">
                <p>Mentioned in Routines</p>
                <router-link v-for="mention in routineProductMentions" :key="mention.routine.id"
                  :to="{ name: 'routine', params: { routineSlug: routineSlug(mention.routine) } }">
                  <span class="glyph me-md">🩸</span>{{ mention.routine.routine_name }}
                </router-link>
              </div>
            </div>
            <div class="content">
              <h1 class="mt-xl">{{ post.data.title[0].text }}</h1>
              <p class="review-summary">{{ post.data.summary[0].text }}</p>
              <p class="affiliate-disclosure mt-md">
                This post may contain affiliate links. If you buy through these links, we may earn a commission at no
                extra cost to you.
              </p>
              <component v-for="(paragraph, index) in post.data.body" :key="paragraph.text"
                :is="bodyTag(paragraph.type)" :class="bodyClass(paragraph.type, index)" :innerHTML="paragraph.text">
              </component>
            </div>
          </section>
        </div>
        <!-- Loading State -->
        <div v-else>
          <div class="cover-media">
            <div class="placeholder placeholder-wave cover-img"></div>
          </div>
          <section>
            <div class="px-xl">
              <p class="mt-xl placeholder placeholder-wave placeholder-sm w-100"></p>
              <p class="placeholder placeholder-wave placeholder-sm w-100"></p>
              <p class="mt-xl">
                <span class="placeholder placeholder-wave placeholder-sm w-100"></span>
              </p>
            </div>
            <div class="content">
              <span class="mt-xl placeholder placeholder-wave placeholder-xl w-100"></span>
              <span class="mt-xl placeholder placeholder-wave placeholder-lg w-100"></span>
              <p class="mt-xl">
                <span class="mt-xl placeholder placeholder-wave placeholder-body w-100"></span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
    <PageSidebar />
  </main>
</template>

<script lang="ts">
import ReviewBar from "../components/ReviewBar.vue";
import PageSidebar from '../components/PageSidebar.vue';
import SEO from "../components/SEO.vue";
import ResponsiveImage from "../components/ResponsiveImage.vue";

import { format } from "date-fns";
import { Post } from "../types";
import { getAdjacentPosts, getPostByUID } from "../posts";
import routines from "../assets/routines.json";
import { findRoutineProductMentions, routineSlug, type RoutineProductMention } from "../routines";
import { externalLinkRel } from "../affiliate-links";

export default {
  name: 'blog-post',
  components: {
    ReviewBar,
    PageSidebar,
    SEO,
    ResponsiveImage
  },
  data() {
    return {
      post: null as Post | null,
      prevPost: null as Post | null,
      nextPost: null as Post | null,
      isReviewBarLoading: false,
    }
  },
  computed: {
    routineProductMentions(): RoutineProductMention[] {
      if (!this.post) return [];

      return findRoutineProductMentions(
        routines,
        this.post.data.products.slice(0, 1).map(({ product }) => ({
          brand: product.brand,
          name: product.name,
          link: product.link,
        })),
      );
    },
  },
  methods: {
    externalLinkRel,
    routineSlug,
    async getContent(slug: string) {
      if (!slug) return;

      this.prevPost = null;
      this.nextPost = null;
      this.isReviewBarLoading = true;

      const post = getPostByUID(slug);
      this.post = post;

      if (!post) {
        this.isReviewBarLoading = false;
        return;
      }

      const { prevPost, nextPost } = getAdjacentPosts(slug);
      this.prevPost = prevPost;
      this.nextPost = nextPost;
      this.isReviewBarLoading = false;
    },
    scrollPostToTop() {
      const refs = this.$refs as {
        postMain?: HTMLElement;
        postScrollContainer?: HTMLElement;
      };
      const scrollTargets = [
        refs.postScrollContainer,
        refs.postMain,
        document.scrollingElement as HTMLElement | null,
        document.documentElement,
        document.body,
      ];

      scrollTargets.forEach((target) => {
        if (!target) return;

        target.scrollTop = 0;
        target.scrollLeft = 0;
      });

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    },
    bodyTag(type: string) {
      if (type === "unordered-list") return "ul";
      const headingMatch = type.match(/^heading([1-6])$/);

      if (!headingMatch) return "p";

      const markdownLevel = Number(headingMatch[1]);
      const pageHeadingLevel = Math.max(2, markdownLevel - 1);

      return `h${pageHeadingLevel}`;
    },
    bodyClass(type: string, index: number) {
      return [
        "mt-xl",
        "font-serif",
        type === "affiliate-disclosure" ? "affiliate-disclosure" : "",
        this.isParagraphAfterHeading(type, index) ? "drop-cap" : "",
        this.isFaqHeading(index) ? "faq-heading" : "",
        this.isFaqBlock(index) && !this.isFaqHeading(index) ? "faq-block" : "",
        this.isFaqQuestion(type, index) ? "faq-question" : "",
        this.isFaqAnswer(type, index) ? "faq-answer" : "",
      ];
    },
    isParagraphAfterHeading(type: string, index: number) {
      if (type !== "paragraph") return false;
      if (this.isFaqBlock(index)) return false;
      if (this.isAlternativesHeading(index - 1)) return false;

      return /^heading[1-6]$/.test(this.post?.data.body[index - 1]?.type ?? "");
    },
    isAlternativesHeading(index: number) {
      const previousBlock = this.post?.data.body[index];

      return Boolean(previousBlock && /^heading[1-6]$/.test(previousBlock.type) && previousBlock.text.startsWith("Alternatives"));
    },
    isFaqHeading(index: number) {
      return this.post?.data.body[index]?.text === "Frequently Asked Questions";
    },
    isFaqBlock(index: number) {
      return Boolean(this.post?.data.body.slice(0, index + 1).some((paragraph) => paragraph.text === "Frequently Asked Questions"));
    },
    isFaqQuestion(type: string, index: number) {
      return this.isFaqBlock(index) && /^heading[1-6]$/.test(type) && !this.isFaqHeading(index);
    },
    isFaqAnswer(type: string, index: number) {
      return this.isFaqBlock(index) && type === "paragraph";
    },
    formatDate(date: string) {
      return format(new Date(date), 'MMMM do, y')
    }
  },
  created() {
    this.getContent(this.$route.params.slug as string)
  },
  watch: {
    async '$route.params.slug'(slug) {
      this.scrollPostToTop();
      await this.getContent(slug as string)
      await this.$nextTick();
      this.scrollPostToTop();
      requestAnimationFrame(this.scrollPostToTop);
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  >div {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
  }
}

.scroll-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

section {
  display: grid;
  grid-template-columns: 1fr 3fr;

  a {
    text-decoration: none;
  }
}

.tag-link {
  display: inline-block;

  &:hover {
    color: var(--color-primary);
  }
}

.button-link {
  background-color: transparent;
  border-radius: var(--space-sm);
  border: 1px solid black;
  color: inherit;
  display: inline-block;

  &:hover {
    background-color: rgba(241, 101, 68, 0.05);
    color: inherit;
  }
}

.cover-media {
  display: grid;
  place-items: center;
  min-height: 300px;
  padding: var(--space-lg);
}

.cover-img,
.cover-media :deep(.cover-img) {
  display: block;
  width: auto;
  max-width: min(100%, 960px);
  height: auto;
  max-height: min(60vh, 400px);
  object-fit: contain;
  mix-blend-mode: darken;
}

.cover-img.placeholder {
  width: min(100%, 960px);
  height: clamp(300px, 50vh, 560px);
}

.content {
  padding: var(--space-xl);

  .review-summary {
    font-size: var(--fontSize-lg);
    font-weight: 400;
    letter-spacing: var(--letterSpacing-lg);
    line-height: var(--lineHeight-lg);
    margin-block: 1.67em;
  }

  .drop-cap {
    font-size: var(--fontSize-l);

    &::first-letter {
      color: var(--color-dark);
      float: left;
      font-size: 75px;
      line-height: 50px;
      padding-top: 4px;
      padding-right: 4px;
    }
  }

  :deep(ul) {
    display: grid;
    gap: var(--space-sm);
    list-style: none;
    padding-left: 0;
  }

  :deep(li) {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: var(--space-sm);
  }

  :deep(li::before) {
    color: var(--color-primary);
    content: "🩸";
    font-family: "Noto Sans Symbols 2";
    line-height: inherit;
  }
}

.featured-products {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.affiliate-disclosure {
  background-color: rgba(241, 101, 68, 0.08);
  border-left: 2px solid var(--color-primary);
  color: var(--color-dark);
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-md);
  padding: var(--space-sm) var(--space-md);
}

.faq-heading {
  border-top: 1px solid var(--color-dark);
  margin-top: calc(var(--space-xl) * 2);
  margin-bottom: 0;
  padding: var(--space-xl) var(--space-xl) 0;
}

.faq-block {
  margin-top: 0;
  padding-inline: var(--space-xl);
}

.faq-question {
  align-items: center;
  color: var(--color-dark);
  display: flex;
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-lg);
  gap: var(--space-md);
  line-height: var(--lineHeight-lg);
  padding-top: var(--space-xl);

  &::after {
    border-bottom: 0.5px solid var(--color-dark);
    content: "";
    flex: 1;
    min-width: var(--space-xl);
  }
}

.faq-answer {
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-lg);

  &:last-child {
    border-bottom: 0;
    padding-bottom: var(--space-xl);
  }
}

@media (max-width: 768px) {
  main {
    display: block;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .scroll-container {
    max-height: none;
    overflow: visible;
  }

  section {
    display: block;
  }

  .cover-media {
    min-height: 240px;
    padding: var(--space-lg);
  }

  .cover-img,
  .cover-media :deep(.cover-img) {
    max-height: 70vh;
  }

  .content {
    padding: var(--space-lg);
  }

  .content h1 {
    display: block;
    font-size: var(--fontSize-4xl);
    line-height: var(--lineHeight-4xl);
  }

  section>.px-xl {
    padding-inline: var(--space-lg);
  }

  .featured-products {
    display: none;
  }

  .faq-heading,
  .faq-block {
    padding-inline: var(--space-lg);
  }

  .faq-question::after {
    content: none;
  }
}
</style>
