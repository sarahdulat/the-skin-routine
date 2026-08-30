<template>
  <section class="not-found">
    <p class="error-code type-ui-label">404</p>
    <h1 class="type-page-title">{{ title }}</h1>
    <p class="type-summary">{{ description }}</p>
    <div class="not-found-links type-ui-label">
      <router-link to="/">Explore routines</router-link>
      <router-link to="/blog/">Read product reviews</router-link>
    </div>
  </section>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(), {
  title: "Page not found",
  description: "The page you were looking for may have moved, or the address may be incorrect.",
});
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min(100%, 46rem);
  min-height: 100%;
  margin-inline: auto;
  padding: var(--space-section) var(--space-xl);
}

.error-code {
  color: var(--color-primary);
  margin: 0 0 var(--space-md);
  text-transform: uppercase;
}

h1 {
  margin: 0;
}

.type-summary {
  margin: var(--space-lg) 0 var(--space-xl);
}

.not-found-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .not-found {
    padding-inline: var(--space-lg);
  }
}
</style>
