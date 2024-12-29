<template>
  <main>
    <div>
      <FilterBar :dropdowns="[brands, product_type]" />
      <div class="posts scroll-container">
        <div class="post" v-for="(post, index) in posts" :key="post.uid + '_' + index">
          <div v-if="posts">
            <router-link :to="'/blog/' + post.uid">
              <img :src="post.data.image.url" :alt="post.data.image.alt" />
              <!-- <h3 class="mt-md mb-lg">{{ post.data.title[0].text }}</h3> -->
            </router-link>
            <p class="m-0">{{ formatDate(post) }}</p>
            <span v-for="tag in post.tags" :key="tag" class="me-md my-0">
              <router-link class="text-uppercase font-sans" to="#">
                #{{ tag }}
              </router-link>
            </span>
            <p class="mt-lg font-sans">{{ post.data.summary[0].text }}</p>
          </div>
          <!-- Loading State -->
          <div v-else>
            <div>
              <img class="placeholder placeholder-wave" />
              <h3 class="mt-md mb-lg placeholder placeholder-wave placeholder-md w-100"></h3>
              <p class="m-0 placeholder placeholder-wave placeholder-sm w-50"></p>
              <span class="d-flex gap-lg">
                <span v-for="tag in post.tags" :key="tag" class="placeholder placeholder-wave placeholder-sm w-30 my-0">
                </span>
              </span>
              <p class="mt-lg placeholder placeholder-wave placeholder-sm w-100"></p>
            </div>
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
      routine: [] as any
    }
  },
  watch: {
    "$route.query"(newQuery) {
      this.getContent(newQuery)
    }
  },
  methods: {
    async getContent(query: { 'Brands': string, 'Product Types': string }) {
      this.allPosts = await this.$prismic.client.getAllByType('review') as Array<Post>

      const brands = this.getFilterParams('my.review.brands.brand', this.brands.items, query['Brands'])
      const product_types = this.getFilterParams('my.review.product_types.product_type', this.product_type.items, query['Product Types'])

      this.posts = await this.$prismic.client.getAllByType('review', { filters: [brands, product_types] }) as Array<Post>
    },
    getFilterParams(filterType: string, allItems: Array<string>, query?: string) {
      if (query === 'all' || query == null) {
        return this.$prismic.filter.any(filterType, allItems)
      }
      return this.$prismic.filter.at(filterType, query)
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
}

.scroll-container {
  max-height: calc(100vh - 145px);
  overflow: scroll;
}

.posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
  padding: 0 var(--space-xl);
}

.post {
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
  }
}

a {
  text-decoration: none;
}
</style>
