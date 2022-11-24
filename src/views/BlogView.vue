<template>
  <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
    <div
      class="post col"
      v-for="(post,index) in posts"
      :key="post.slug + '_' + index">
      <router-link :to="'/blog/' + post.slug">
        <img
          :src="post.featured_image"
          class="img-fluid"
          :alt="post.alt" />
      </router-link>
      <h6
        v-for="tag in post.tags"
        :key="tag.key"
        class="d-inline text-uppercase me-2 mt-4">
        {{ tag.name }}
      </h6>
      <router-link :to="'/blog/' + post.slug">
        <h3 class="mt-4">{{ post.title }}</h3>
      </router-link>
      <div class="mt-4">{{ post.summary }}</div>
    </div>
  </div>
</template>

<script>
import { butter } from '@/buttercms'

export default {
  data () {
    return {
      page_title: 'Blog',
      posts: [],
    };
  },
  methods: {
    getPosts() {
      butter.post.list({
        page: 1,
        page_size: 10
      }).then(res => {
        this.posts = res.data.data
      })
    }
  },
  created () {
    this.getPosts()
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin-right: calc(-1 * var(--bs-gutter-x));
  margin-left: calc(-1 * var(--bs-gutter-x));
}
.post {
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
  }
}
</style>
