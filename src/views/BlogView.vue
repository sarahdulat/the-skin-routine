<template>
  <div class="blog">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
      <router-link
        v-for="post in posts"
        :key="post.id"
        :to="`/post/${post.slug}`">
        <div class="post col">
          <img :src="post.image" class="img-fluid" :alt="post.alt">
          <!-- <h6>{{post.tag}}</h6> -->
          <h3>{{ post.title }}</h3>
          <div>{{ post.summary }}</div>
        </div>
      </router-link>
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
.post {
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 1rem;
  }
}
</style>
