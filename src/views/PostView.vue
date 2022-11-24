<template>
  <div class="row">
    <img
      :src="post.data.featured_image"
      class="cover-img"
      :alt="post.data.featured_image_alt">
  </div>
  <div class="col-xs-12 col-md-8 offset-md-2">
    <div class="text-center">
      <h6
        v-for="tag in post.data.tags"
        :key="tag.key"
        class="mt-5 text-uppercase">
        {{ tag.name }}
      </h6>
      <h1 class="mt-5">{{ post.data.title }}</h1>
      <h6 class="mt-5">{{ formattedDate(post.data.published) }}</h6>
    </div>
    <p class="mt-5" v-html="post.data.body"></p>
  </div>
</template>

<script>
import { butter } from '@/buttercms'
import moment from 'moment';

export default {
  name: 'blog-post',
  data() {
    return {
      post: {}
    }
  },
  created() {
    this.getPost()
  },
  methods: {
    getPost() {
      butter.post.retrieve(this.$route.params.slug)
        .then(res => {
          this.post = res.data
        }).catch(res => {
          console.log(res)
        })
    },
    formattedDate (date) {
      return moment(date).format("dddd, MMMM Do YYYY");
    }
  }
}
</script>

<style lang="scss" scoped>
  .cover-img {
    width: 100%;
    height: 300px;
    padding: 0;
    object-fit: cover;
  }
</style>
