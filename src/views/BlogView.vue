<template>
  <main>
    <div class="blog-content">
      <FilterBar :dropdowns="[brands, product_type]" :active-tag="activeTag"
        v-model:pregnancy-safe-only="pregnancySafeOnly" />
      <div v-if="!isLoading" class="scroll-container">
        <div class="posts">
          <div class="post" v-for="(post, index) in posts" :key="post.uid + '_' + index">
            <router-link :to="'/blog/' + post.uid + '/'">
              <ResponsiveImage
                :src="post.data.image.url"
                :alt="post.data.image.alt"
                sizes="(max-width: 768px) calc(100vw - 2rem), 33vw"
                loading="lazy"
              />
              <h3 class="mt-md mb-lg">{{ post.data.title[0].text }}</h3>
            </router-link>
            <p class="m-0">{{ formatDate(post) }}</p>
            <span v-for="tag in post.tags" :key="tag" class="me-md my-0">
              <router-link class="tag-link text-uppercase font-sans" :to="{ name: 'blog', query: { Tag: tag } }">
                #{{ tag }}
              </router-link>
            </span>
            <p class="mt-lg font-sans">{{ post.data.summary[0].text }}</p>
          </div>
        </div>
        <div v-if="posts.length === 0" class="px-xl">
          <p>No reviews match the selected filters.</p>
        </div>
      </div>
      <div v-else class="scroll-container" aria-busy="true">
        <div class="posts">
          <div class="post" v-for="index in 2" :key="`placeholder-${index}`">
            <div class="placeholder placeholder-wave placeholder-image"></div>
            <h3 class="mt-md mb-lg placeholder placeholder-wave placeholder-md w-100"></h3>
            <p class="m-0 placeholder placeholder-wave placeholder-sm w-50"></p>
            <span class="d-flex gap-lg">
              <span class="placeholder placeholder-wave placeholder-sm w-30 my-0"></span>
            </span>
            <p class="mt-lg placeholder placeholder-wave placeholder-sm w-100"></p>
          </div>
        </div>
      </div>
    </div>
    <PageSidebar />
  </main>
</template>

<script lang="ts">
import PageSidebar from '../components/PageSidebar.vue';
import FilterBar from '../components/FilterBar.vue';
import ResponsiveImage from '../components/ResponsiveImage.vue';

import { format } from "date-fns";
import type { LocationQuery } from "vue-router";
import { Post } from '../types';
import { getAllPosts, getPostsByFilters } from '../posts';

export default {
  name: 'blog',
  components: {
    FilterBar,
    PageSidebar,
    ResponsiveImage
  },
  data() {
    return {
      posts: [] as Array<Post>,
      allPosts: [] as Array<Post>,
      filters: [] as any,
      routine: [] as any,
      isLoading: false,
      pregnancySafeOnly: false,
    }
  },
  watch: {
    "$route.query"(newQuery) {
      this.getContent(newQuery)
    },
    pregnancySafeOnly() {
      this.getContent(this.$route.query)
    }
  },
  methods: {
    async getContent(query: LocationQuery) {
      this.isLoading = true;

      try {
        this.allPosts = getAllPosts()
        this.posts = getPostsByFilters({
          brands: this.getFilterParam(query['Brands']),
          productTypes: this.getFilterParam(query['Product Types']),
          tag: this.getFilterParam(query['Tag']),
          pregnancySafeOnly: this.pregnancySafeOnly,
        })
      } finally {
        this.isLoading = false;
      }
    },
    getFilterParam(query?: LocationQuery[string]) {
      const selected = Array.isArray(query) ? query[0] : query;
      return selected ?? undefined;
    },
    formatDate(post: Post) {
      return format(new Date(post.first_publication_date), 'MMMM do, y')
    },
    uniqueFilterItems(items: string[][]) {
      const uniqueItems = new Map<string, string>();

      items.flat().forEach((item) => {
        const trimmedItem = item.trim();
        const key = trimmedItem.toLowerCase();

        if (trimmedItem && !uniqueItems.has(key)) {
          uniqueItems.set(key, trimmedItem);
        }
      });

      return [...uniqueItems.values()].sort((a, b) => a.localeCompare(b));
    }
  },
  created() {
    this.getContent(this.$route.query)
  },
  computed: {
    brands() {
      return { defaultValue: 'Brands', items: this.uniqueFilterItems(this.allPosts.map((post: Post) => post.data.brands.map(b => b.brand))) };
    },
    product_type() {
      return { defaultValue: 'Product Types', items: this.uniqueFilterItems(this.allPosts.map((post: Post) => post.data.product_types.map(p => p.product_type))) };
    },
    activeTag() {
      return this.getFilterParam(this.$route.query['Tag']) ?? "";
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
}

.blog-content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.scroll-container {
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
  padding: 0 var(--space-xl) calc(var(--space-xl) + 7rem);
}

.post {
  :deep(img) {
    width: 100%;
    height: 300px;
    object-fit: contain;
    margin-bottom: 1rem;
    mix-blend-mode: darken;
  }
}

.placeholder-image {
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
}

.tag-link {
  display: inline-block;

  &:hover {
    color: var(--color-primary);
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

  .blog-content {
    display: block;
    flex: none;
    overflow: visible;
  }

  .scroll-container {
    display: block;
    overflow: visible;
  }

  .posts {
    grid-template-columns: 1fr;
    padding: 0 var(--space-lg) var(--space-xl);
  }
}
</style>
