<template>
  <aside class="row">
    <div class="scroll-container">
      <h2 class="mt-lg mb-0 text-nowrap">Review Archive</h2>
      <BlogArchiveTree :nodes="postsArchive" />
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BlogArchiveTree from "./BlogArchiveTree.vue";
import { Post } from "../types";
import { format } from "date-fns";

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
      posts: [] as Array<Post>
    }
  },
  methods: {
    async getContent() {
      this.posts = await this.$prismic.client.getAllByType('review') as Array<Post>
    }
  },
  computed: {
    postsArchive() {
      let archive = []
      for (let post of this.posts) {
        let year = new Date(post.first_publication_date).getFullYear()
        let month = format(new Date(post.first_publication_date), 'MMMM')

        if (archive.length === 0) {
          archive.push({ name: year, children: [{ name: month, children: [{ name: post.data.title[0].text, uid: post.uid }] }] })
        } else {
          let matchingYearNode = archive.find(node => node.name === year)

          if (matchingYearNode) {
            let matchingMonthNode = matchingYearNode.children.find(node => node.name === month)
            if (matchingMonthNode) {
              matchingMonthNode.children.push({ name: post.data.title[0].text, uid: post.uid })
            } else {
              matchingYearNode.children.push({ name: month, children: [{ name: post.data.title[0].text, uid: post.uid }] })
            }
          } else {
            archive.push({ name: year, children: [{ name: month, children: [{ name: post.data.title[0].text, uid: post.uid }] }] })
          }
        }
      }
      return archive
    }
  },
  created() {
    this.getContent()
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
