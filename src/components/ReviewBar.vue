<template>
  <div class="toolbar">
    <a class="font-sans" href="#"><span class="glyph">⬅</span>
      Previous Review
    </a>
    <a class="font-sans" href="#">Next Review <span class="glyph">⮕</span></a>
  </div>
</template>

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
