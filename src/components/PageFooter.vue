<template>
  <footer>
    <div>
      <div class="me-auto">
        <a href="mailto:hello@theskinroutine.com">hello@theskinroutine.com</a>
      </div>
      <div class="text-nowrap">
        <a href="http://www.instagram.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-instagram" alt="instagram"></i>
        </a>
        <a href="http://www.x.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-twitter-x ms-lg" alt="x"></i>
        </a>
        <a href="http://www.pinterest.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-pinterest ms-lg" alt="pinterest"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  background-color: var(--color-body);
  border-top: 1px solid var(--color-text);
  position: sticky;
  bottom: 0;

  >div {
    display: flex;
    align-items: center;
    padding: var(--space-lg) var(--space-xl);
  }

  i {
    font-size: var(--fontSize-xl);
  }
}
</style>
