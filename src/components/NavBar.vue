<template>
  <nav class="pb-0">
    <div class="navbar">
      <h1>
        <router-link to="/">
          The Skin Routine<span class="glyph">🩸</span>
        </router-link>
      </h1>
      <div class="nav-links">
        <h6>
          <router-link to="/about">About</router-link>
        </h6>
        <h6>
          <router-link to="/blog">Reviews</router-link>
        </h6>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  margin: 0 var(--space-lg);
  background-color: var(--color-body);

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-lg);
    border-bottom: 1px solid var(--color-text);

    h1 {
      font-weight: 500;
      margin-bottom: var(--space-md);

      a {
        text-decoration: none;

        &:hover {
          color: var(--color-text);

          .glyph {
            color: var(--color-primary);
          }
        }
      }
    }

    .nav-links {
      display: flex;
      align-items: center;

      h6 {
        font-weight: 400;
        margin-bottom: var(--space-sm);
        margin-left: var(--space-lg);
      }
    }
  }
}
</style>
