<template>
  <main>
    <div>
      <img :src="post.data.featured_image" class="cover-img" :alt="post.data.featured_image_alt">
    </div>
    <div>
      <div class="head">
        <h6 v-for="tag in post.data.tags" :key="tag.key" class="mt-xl">
          {{ tag.name }}
        </h6>
        <span class="h0 mt-xl">{{ post.data.title }}</span>
        <h6 class="mt-xl">{{ formattedDate(post.data.published) }}</h6>
      </div>
      <p class="mt-xl" v-html="post.data.body"></p>
    </div>
  </main>
</template>

<script lang="ts">
import { butter } from '../buttercms';
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
    formattedDate(date) {
      return moment(date).format("dddd, MMMM Do YYYY");
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  width: 100%;
}

.cover-img {
  width: 100%;
  height: 300px;
  padding: 0;
  object-fit: cover;
}

.head {
  text-align: center;

  >h6 {
    text-transform: uppercase;
  }
}

p {
  font-size: var(--font-size-l);

  &:first-of-type:first-letter {
    color: var(--color-text);
    float: left;
    font-family: Jost, Arial, Helvetica, sans-serif;
    font-size: 75px;
    line-height: 50px;
    padding-top: 4px;
    padding-right: 4px;
  }
}
</style>
