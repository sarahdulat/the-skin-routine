<template>
  <picture>
    <source v-if="hasOptimizedSources" type="image/avif" :srcset="avifSrcset" :sizes="sizes" />
    <source v-if="hasOptimizedSources" type="image/webp" :srcset="webpSrcset" :sizes="sizes" />
    <img
      :src="src"
      :class="imgClass"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
    />
  </picture>
</template>

<script lang="ts">
const optimizedWidths = [480, 800, 1200];
const optimizableImagePattern = /^\/images\/(.+)\.(png|jpe?g|webp)$/i;

function optimizedSrc(src: string, width: number, format: "avif" | "webp") {
  return src.replace(optimizableImagePattern, `/images/optimized/$1-${width}.${format}`);
}

function optimizedSrcset(src: string, format: "avif" | "webp") {
  return optimizedWidths.map((width) => `${optimizedSrc(src, width, format)} ${width}w`).join(", ");
}

export default {
  name: "ResponsiveImage",
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
    imgClass: {
      type: String,
      default: "",
    },
    sizes: {
      type: String,
      default: "100vw",
    },
    loading: {
      type: String as () => "eager" | "lazy",
      default: "lazy",
    },
    decoding: {
      type: String as () => "async" | "auto" | "sync",
      default: "async",
    },
    fetchpriority: {
      type: String as () => "high" | "low" | "auto",
      default: "auto",
    },
  },
  computed: {
    hasOptimizedSources() {
      return optimizableImagePattern.test(this.src);
    },
    avifSrcset() {
      return optimizedSrcset(this.src, "avif");
    },
    webpSrcset() {
      return optimizedSrcset(this.src, "webp");
    },
  },
};
</script>
