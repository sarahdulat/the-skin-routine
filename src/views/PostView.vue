<template>
  <main>
    <SEO :post="post" />
    <div>
      <ReviewBar :prevPost="prevPost" :nextPost="nextPost" :isLoading="isReviewBarLoading" />
      <div class="scroll-container">
        <div v-if="post">
          <div class="cover-media">
            <img :src="post.data.image.url" class="cover-img" :alt="post.data.image.alt">
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
                  <a :href="product.product.link" target="_blank" rel="noopener noreferrer">
                    <span class="glyph me-md">🩸</span>{{ product.product.brand }} {{ product.product.name }}
                  </a>
                  <!-- <a :href="product.product.link" target="_blank" rel="noopener noreferrer" class="button-link px-sm ms-lg">Buy</a> -->
                </span>
              </div>
            </div>
            <div class="content">
              <span class="h0 mt-xl">{{ post.data.title[0].text }}</span>
              <h5>{{ post.data.summary[0].text }}</h5>
              <component v-for="paragraph in post.data.body" :key="paragraph.text" :is="bodyTag(paragraph.type)"
                class="mt-xl font-serif" v-html="paragraph.text">
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

import { format } from "date-fns";
import { Post } from "../types";
import { getAdjacentPosts, getPostByUID } from "../posts";

export default {
  name: 'blog-post',
  components: {
    ReviewBar,
    PageSidebar,
    SEO
  },
  data() {
    return {
      post: null as Post | null,
      prevPost: null as Post | null,
      nextPost: null as Post | null,
      isReviewBarLoading: false,
    }
  },
  methods: {
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
    bodyTag(type: string) {
      return /^heading[1-6]$/.test(type) ? `h${type.replace('heading', '')}` : 'p';
    },
    formatDate(date: string) {
      return format(new Date(date), 'MMMM do, y')
    }
  },
  created() {
    this.getContent(this.$route.params.slug as string)
  },
  watch: {
    '$route.params.slug'(slug) {
      this.getContent(slug as string)
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

.cover-img {
  display: block;
  width: auto;
  max-width: min(100%, 960px);
  height: auto;
  max-height: min(60vh, 400px);
  object-fit: contain;
}

.cover-img.placeholder {
  width: min(100%, 960px);
  height: clamp(300px, 50vh, 560px);
}

.content {
  padding: var(--space-xl);

  h2+p {
    font-size: var(--font-size-l);

    &::first-letter {
      color: var(--color-dark);
      float: left;
      font-size: 75px;
      line-height: 50px;
      padding-top: 4px;
      padding-right: 4px;
    }
  }
}

.featured-products {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
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

  .cover-img {
    max-height: 70vh;
  }

  .content {
    padding: var(--space-lg);
  }

  .content .h0 {
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
}
</style>
