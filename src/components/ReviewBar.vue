<template>
  <div class="toolbar">
    <template v-if="isLoading">
      <span class="toolbar-placeholder placeholder-left"></span>
      <span class="toolbar-placeholder placeholder-right ms-auto"></span>
    </template>
    <template v-else>
      <router-link v-if="prevPostTitle" :to="'/blog/' + prevPost!.uid"> <span class="glyph">⬅ </span>{{
        prevPostTitle }}
      </router-link>
      <router-link v-if="nextPostTitle" :to="'/blog/' + nextPost!.uid" class="ms-auto">{{
        nextPostTitle
        }}
        <span class="glyph">⮕ </span></router-link>
    </template>
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
      type: Object as PropType<Post | null>,
      required: false,
      default: null,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  computed: {
    prevPostTitle() {
      return this.prevPost?.uid && this.prevPost?.data?.title?.[0]?.text;
    },
    nextPostTitle() {
      return this.nextPost?.uid && this.nextPost?.data?.title?.[0]?.text;
    },
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-dark);
  background-color: var(--color-light);
  display: flex;
  min-height: 60px;

  a {
    text-decoration: none;
    font-family: var(--font-family-sans-serif);
  }
}

.toolbar-placeholder {
  display: inline-block;
  height: var(--fontSize-md);
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, rgba(52, 58, 64, 0.08), rgba(52, 58, 64, 0.18), rgba(52, 58, 64, 0.08));
  background-size: 200% 100%;
  animation: placeholder-wave 1.2s ease-in-out infinite;
}

.placeholder-left {
  width: 11rem;
}

.placeholder-right {
  width: 13rem;
}

@keyframes placeholder-wave {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
</style>
