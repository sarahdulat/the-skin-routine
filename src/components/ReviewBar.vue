<template>
  <div class="toolbar">
    <router-link :to="'/blog/' + prevPost?.slugs[0]" class="font-sans"><span class="glyph">⬅</span>
      Previous Review
    </router-link>
    <router-link :to="'/blog/' + nextPost?.slugs[0]" class="font-sans">Next Review <span
        class="glyph">⮕</span></router-link>
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
  border-bottom: 1px solid var(--color-text);
  background-color: var(--color-body);
  display: flex;
  justify-content: space-between;

  a {
    text-decoration: none;
  }
}
</style>
