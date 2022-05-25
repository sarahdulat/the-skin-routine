<template>
  <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
    <div
      class="post col"
      v-for="post in posts"
      :key="post.id">
      <router-link :to="{name: 'post', params: { post: post } }">
        <img
          :src="post.image"
          class="img-fluid"
          :alt="post.alt" />
      </router-link>
      <h6
        v-for="tag in post.tags"
        :key="tag.key"
        class="d-inline text-uppercase me-2 mt-4">
        {{ tag }}
      </h6>
      <router-link :to="{name: 'post', params: { slug: post.slug, post: post } }">
        <h3 class="mt-4">{{ post.title }}</h3>
      </router-link>
      <div class="mt-4">{{ post.summary }}</div>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json';

export default {
  data () {
    return {
      posts: sourceData.posts,
    };
  },
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
