<template>
  <div class="toolbar">
    <router-link v-if="prevPost" :to="'/blog/' + prevPost?.uid"> <span class="glyph">⬅ </span>{{
      prevPost?.data.title[0].text }}
    </router-link>
    <router-link v-if="nextPost" :to="'/blog/' + nextPost?.uid" class="ms-auto">{{
      nextPost.data.title[0].text
    }}
      <span class="glyph">⮕ </span></router-link>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Post } from '../types';

export default {
  name: 'blog-post',
  props: {
    prevPost: {
      type: Object as PropType<Post | null>,
      required: false,
      default: null,
    },
    nextPost: {
      type: Object as PropType<Post>,
      required: false,
      default: null,
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-dark);
  background-color: var(--color-light);
  display: flex;

  a {
    text-decoration: none;
    font-family: var(--font-family-sans-serif);
  }
}
</style>
