<template>
  <aside class="row">
    <div class="scroll-container">
      <h2 class="mt-lg mb-0 text-nowrap">Review Archive</h2>
      <BlogArchiveTree :nodes="archiveData" />

    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BlogArchiveTree from "./BlogArchiveTree.vue"; // Import your BlogArchiveTree component

interface BlogArchiveNode {
  name: string;
  children?: BlogArchiveNode[];
}

export default defineComponent({
  components: {
    BlogArchiveTree,
  },
  data() {
    return {
      posts: []
    }
  },
  methods: {
    async getContent() {
      this.posts = await this.$prismic.client.getAllByType('review')
    }
  },
  created() {
    this.getContent()
  },
  setup() {
    const archiveData = ref<BlogArchiveNode[]>([
      {
        name: "2024",
        children: [
          {
            name: "September",
            children: [
              { name: "How to Build a Vue Tree List" },
              { name: "Vue 3 Refs Explained" },
            ],
          },
          {
            name: "August",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "July",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "June",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "May",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "April",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "March",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "February",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
          {
            name: "January",
            children: [
              { name: "TypeScript in Vue 3" },
              { name: "Building Components with Vue" },
            ],
          },
        ],
      },
      {
        name: "2023",
        children: [
          {
            name: "December",
            children: [{ name: "Year in Review: Vue 2022" }],
          },
        ],
      },
    ]);

    return {
      archiveData,
    };
  },
});
</script>

<style lang="scss" scoped>
aside {
  -webkit-flex: 1;
  flex: 1;
  height: 100vh;
  max-width: 300px;
  border-left: var(--color-text) solid 1px;
}

.scroll-container {
  max-height: calc(100vh - 145px);
  overflow: scroll;
  padding: 0 var(--space-lg) 0 var(--space-xl);
}
</style>
