<template>
  <nav class="pb-0">
    <div class="navbar">
      <h1>
        <router-link to="/">
          The Skin Routine<span class="glyph">🩸</span>
        </router-link>
      </h1>
      <div class="nav-links">
        <h5>
          <router-link to="/about">About</router-link>
        </h5>
        <h5>
          <router-link to="/blog">Reviews</router-link>
        </h5>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  background-color: var(--color-light);

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-xl);
    border-bottom: 1px solid var(--color-dark);

    h1 {
      font-weight: 500;
      margin-bottom: var(--space-md);

      a {
        text-decoration: none;

        &:hover {
          color: var(--color-dark);

          .glyph {
            color: var(--color-primary);
          }
        }
      }
    }

    .nav-links {
      display: flex;
      align-items: center;

      h5 {
        margin-bottom: var(--space-sm);
        margin-left: var(--space-lg);
      }
    }
  }
}
</style>
