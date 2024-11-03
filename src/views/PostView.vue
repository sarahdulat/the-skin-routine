<template>
  <main>
    <div>
      <ReviewBar v-if="prevPost || nextPost" :prevPost="prevPost" :nextPost="nextPost" />
      <div class="scroll-container">
        <div v-if="post">
          <div>
            <img :src="post.data.product_image.url" class="cover-img" :alt="post.data.product_image.alt">
          </div>
          <section>
            <aside>
              <p class="mt-xl">{{ formatDate(post.first_publication_date) }}</p>
              <p v-if="formatDate(post.last_publication_date) !== formatDate(post.first_publication_date)">Updated: {{
                formatDate(post.last_publication_date) }}</p>
              <p v-for="tag in post.tags" :key="tag" class="mt-xl text-uppercase font-sans">
                #{{ tag }}
              </p>
            </aside>
            <div class="content">
              <span class="h0 mt-xl">{{ post.data.title[0].text }}</span>
              <h5>Subtitle</h5>
              <p v-for="paragraph in post.data.body" class="mt-xl font-serif" v-html="paragraph.text"></p>
            </div>
          </section>
        </div>
        <div v-else>404</div>
      </div>
    </div>
    <PageSidebar />
  </main>
</template>

<script lang="ts">
import ReviewBar from "../components/ReviewBar.vue";
import PageSidebar from '../components/PageSidebar.vue';

import { format } from "date-fns";
import { useRoute } from "vue-router";
import { Post } from "../types";

export default {
  name: 'blog-post',
  components: {
    ReviewBar,
    PageSidebar
  },
  data() {
    return {
      post: null as Post | null,
      prevPost: null as Post | null,
      nextPost: null as Post | null
    }
  },
  methods: {
    async getContent() {
      const route = useRoute();
      const slug = route.params.slug as string;

      this.post = await this.$prismic.client.getByUID("review", slug) as Post;

      this.prevPost = (await this.$prismic.client.get({
        pageSize: 1, after: this.post.id, orderings: { field: 'document.first_publication_date desc' }
      })).results[0]
      console.log(this.prevPost)

      this.nextPost = (await this.$prismic.client.get({
        pageSize: 1, after: this.post.id, orderings: { field: 'document.first_publication_date' }
      })).results[0]
      console.log(this.nextPost)

    },
    formatDate(date: string) {
      return format(new Date(date), 'MMMM do, y')
    }
  },
  created() {
    this.getContent()
  },
  watch: {
    async '$route'(to, from) {
      this.getContent()

      this.post = await this.$prismic.client.getByUID("review", to.params.slug) as Post;

      this.prevPost = (await this.$prismic.client.get({
        pageSize: 1, after: this.post.id, orderings: { field: 'document.first_publication_date desc' }
      })).results[0]
      console.log(this.prevPost)

      this.nextPost = (await this.$prismic.client.get({
        pageSize: 1, after: this.post.id, orderings: { field: 'document.first_publication_date' }
      })).results[0]
      console.log(this.nextPost)
      console.log(to, from)
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
