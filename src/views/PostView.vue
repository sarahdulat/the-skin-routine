<template>
  <main>
    <div>
      <ReviewBar />
      <!-- <div class="scroll-container">
        <div>
          <img :src="post.data.featured_image" class="cover-img" :alt="post.data.featured_image_alt">
        </div>
        <section>
          <div class="head">
            <span class="mt-xl">{{ post.data.published }}</span>
            <p v-for="tag in post.data.tags" :key="tag.key" class="mt-xl text-uppercase font-sans">
              #{{ tag.name }}
            </p>
          </div>
          <div class="content">
            <span class="h0 mt-xl">{{ post.data.title }}</span>
            <h5>Subtitle</h5>
            <p class="mt-xl font-serif" v-html="post.data.body"></p>
          </div>
        </section>
      </div> -->
    </div>
    <PageSidebar />
  </main>
</template>

<script lang="ts">
import ReviewBar from "../components/ReviewBar.vue";
import PageSidebar from '../components/PageSidebar.vue';

export default {
  name: 'blog-post',
  components: {
    ReviewBar,
    PageSidebar
  },
  data() {
    return {
      posts: []
    }
  },
  methods: {
    async getContent() {
      // Query the API and assign the response to "response"
      this.posts = await this.$prismic.client.getAllByType(this.$route.params.slug)
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
  max-height: calc(100vh - 205px);
  overflow: scroll;
}

section {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.cover-img {
  width: 100%;
  height: 200px;
  padding: 0;
  object-fit: cover;
}

.head {
  text-align: center;
}

.content {
  p {
    font-size: var(--font-size-l);

    &:first-of-type:first-letter {
      color: var(--color-text);
      float: left;
      font-size: 75px;
      line-height: 50px;
      padding-top: 4px;
      padding-right: 4px;
    }
  }
}
</style>
