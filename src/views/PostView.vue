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
            <div class="px-xl">
              <p class="mt-xl">{{ formatDate(post.first_publication_date) }}</p>
              <p v-if="formatDate(post.last_publication_date) !== formatDate(post.first_publication_date)">Updated: {{
                formatDate(post.last_publication_date) }}</p>
              <div class="mt-lg">
                <span v-for="tag in post.tags" :key="tag" class="text-uppercase font-sans me-md">
                  <router-link class="" to="">#{{ tag }}</router-link>
                </span>
              </div>
            </div>
            <div class="content">
              <span class="h0 mt-xl">{{ post.data.title[0].text }}</span>
              <h5>{{ post.data.subtitle[0].text }}</h5>
              <p v-for="paragraph in post.data.body" :key="paragraph" class="mt-xl font-serif" v-html="paragraph.text">
              </p>
            </div>
          </section>
        </div>
        <!-- Loading State -->
        <div v-else>
          <div>
            <div class="placeholder placeholder-wave cover-img"></div>
          </div>
          <section>
            <div class="px-xl">
              <p class="mt-xl placeholder placeholder-wave placeholder-sm w-100"></p>
              <p class="placeholder placeholder-wave placeholder-sm w-100"
                v-if="formatDate(post.last_publication_date) !== formatDate(post.first_publication_date)"></p>
              <p v-for="tag in post.tags" :key="tag" class="mt-xl">
                <span class="placeholder placeholder-wave placeholder-sm w-100"></span>
              </p>
            </div>
            <div class="content">
              <span class="mt-xl placeholder placeholder-wave placeholder-xl w-100"></span>
              <span class="mt-xl placeholder placeholder-wave placeholder-lg w-100"></span>
              <p v-for="paragraph in post.data.body" :key="paragraph" class="mt-xl">
                <span class="mt-xl placeholder placeholder-wave placeholder-body w-100"></span>
              </p>
            </div>
          </section>
        </div>
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

      this.nextPost = (await this.$prismic.client.get({
        pageSize: 1, after: this.post.id, orderings: { field: 'document.first_publication_date' }
      })).results[0]

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

      this.nextPost = (await this.$prismic.client.get({
        pageSize: 1, after: this.post.id, orderings: { field: 'document.first_publication_date' }
      })).results[0]
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

  a {
    text-decoration: none;
  }
}

.cover-img {
  width: 100%;
  height: 200px;
  padding: 0;
  object-fit: cover;
}

.content {
  padding: var(--space-xl);

  p {
    font-size: var(--font-size-l);

    &:first-of-type:first-letter {
      color: var(--color-dark);
      float: left;
      font-size: 75px;
      line-height: 50px;
      padding-top: 4px;
      padding-right: 4px;
    }
  }
}
</style>
