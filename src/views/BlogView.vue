<template>
  <main>
    <div>
      <FilterBar />
      <div class="posts scroll-container">
        <div class="post" v-for="(post, index) in posts" :key="post.slug + '_' + index">
          <router-link :to="'/blog/' + post.slug">
            <img :src="post.data.product_image.url" :alt="post.alt" />
          </router-link>
          <!-- // title -->
          <router-link :to="'/blog/' + post.slug">
            <h3 class="mt-md mb-lg">{{ post.title }}</h3>
          </router-link>
          <!-- // date -->
          <p class="m-0">September 13, 2024</p>
          <!-- // tags -->
          <h6 v-for="tag in post.tags" :key="tag.key" class="me-md my-0">
            <router-link class="text-uppercase" :to="'/blog/tag/' + tag.name">
              #{{ tag.name }}
            </router-link>
          </h6>
          <h6 class="mt-lg">{{ post.summary }}</h6>
        </div>
      </div>
    </div>
    <PageSidebar />
  </main>
</template>

<script lang="ts">
import PageSidebar from '../components/PageSidebar.vue';
import FilterBar from '../components/FilterBar.vue';

export default {
  name: 'App',
  components: {
    FilterBar,
    PageSidebar
  },
  data() {
    return {
      posts: []
    }
  },
  methods: {
    async getContent() {
      console.log(this.$prismic)
      // Query the API and assign the response to "response"
      this.posts = await this.$prismic.client.getAllByType('review')
      console.log(this.posts)
    }
  },
  created() {
    // Call the API query method
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
