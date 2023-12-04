<template>
  <main>
    <div class="post" v-for="(post, index) in posts" :key="post.slug + '_' + index">
      <router-link :to="'/blog/' + post.slug">
        <img :src="post.featured_image" :alt="post.alt" />
      </router-link>
      <h6 v-for="tag in post.tags" :key="tag.key" class="me-md mt-xl">
        {{ tag.name }}
      </h6>
      <router-link :to="'/blog/' + post.slug">
        <h3 class="mt-xl">{{ post.title }}</h3>
      </router-link>
      <div class="mt-xl">{{ post.summary }}</div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { getPosts } from '../posts'

const posts = getPosts()
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
}

.post {
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
  }
}

h6 {
  text-transform: uppercase;
}
</style>
