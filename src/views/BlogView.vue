<template>
  <main>
    <div>
      <FilterBar :posts="posts" />
      <div class="posts scroll-container">
        <div class="post" v-for="(post, index) in posts" :key="post.uid + '_' + index">
          <router-link :to="'/blog/' + post.uid">
            <img :src="post.data.product_image.url" :alt="post.data.product_image.alt" />
          </router-link>
          <!-- // title -->
          <router-link :to="'/blog/' + post.uid">
            <h3 class="mt-md mb-lg">{{ post.data.title[0].text }}</h3>
          </router-link>
          <!-- // date -->
          <p class="m-0">{{ formatDate(post) }}</p>
          <!-- // tags -->
          <span v-for="tag in post.tags" :key="tag" class="me-md my-0">
            <router-link class="text-uppercase font-sans" :to="'/blog/tag/' + tag">
              #{{ tag }}
            </router-link>
          </span>
          <p class="mt-lg font-sans">{{ post.data.summary[0].text }}</p>
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
      posts: [] as Array<Post>
    }
  },
  methods: {
    async getContent() {
      this.posts = await this.$prismic.client.getAllByType('review') as Array<Post>
    },
    formatDate(post: Post) {
      return format(new Date(post.first_publication_date), 'MMMM do, y')
    }
  },
  created() {
    this.getContent()
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
  padding: 0 0 0 var(--space-xl);
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
