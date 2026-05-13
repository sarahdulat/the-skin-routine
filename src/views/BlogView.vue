<template>
  <main>
    <div class="blog-content">
      <FilterBar :dropdowns="[brands, product_type]" />
      <div v-if="!isLoading" class="scroll-container">
        <div class="posts">
          <div class="post" v-for="(post, index) in posts" :key="post.uid + '_' + index">
            <router-link :to="'/blog/' + post.uid">
              <img :src="post.data.image.url" :alt="post.data.image.alt" />
              <h3 class="mt-md mb-lg">{{ post.data.title[0].text }}</h3>
            </router-link>
            <p class="m-0">{{ formatDate(post) }}</p>
            <span v-for="tag in post.tags" :key="tag" class="me-md my-0">
              <span class="text-uppercase font-sans">
                #{{ tag }}
              </span>
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

import { format } from "date-fns";
import type { LocationQuery } from "vue-router";
import { Post } from '../types';

export default {
  name: 'blog',
  components: {
    FilterBar,
    PageSidebar
  },
  data() {
    return {
      posts: [] as Array<Post>,
      allPosts: [] as Array<Post>,
      filters: [] as any,
      routine: [] as any,
      isLoading: false,
    }
  },
  watch: {
    "$route.query"(newQuery) {
      this.getContent(newQuery)
    }
  },
  methods: {
    async getContent(query: LocationQuery) {
      this.isLoading = true;

      try {
        this.allPosts = await this.$prismic.client.getAllByType('review') as Array<Post>

        const brands = this.getFilterParams('my.review.brands.brand', this.brands.items, query['Brands'])
        const product_types = this.getFilterParams('my.review.product_types.product_type', this.product_type.items, query['Product Types'])

        this.posts = await this.$prismic.client.getAllByType('review', { filters: [brands, product_types] }) as Array<Post>
      } finally {
        this.isLoading = false;
      }
    },
    getFilterParams(filterType: string, allItems: Array<string>, query?: LocationQuery[string]) {
      const selected = Array.isArray(query) ? query[0] : query;

      if (selected === 'all' || selected == null) {
        return this.$prismic.filter.any(filterType, allItems)
      }
      return this.$prismic.filter.at(filterType, selected)
    },
    formatDate(post: Post) {
      return format(new Date(post.first_publication_date), 'MMMM do, y')
    }
  },
  created() {
    this.getContent(this.$route.query)
  },
  computed: {
    brands() {
      return { defaultValue: 'Brands', items: [...new Set(this.allPosts?.map?.((post: Post) => post.data.brands.map(b => b.brand)))].flat() };
    },
    product_type() {
      return { defaultValue: 'Product Types', items: [...new Set(this.allPosts?.map?.((post: Post) => post.data.product_types.map(p => p.product_type)))].flat() };
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
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
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
</style>
