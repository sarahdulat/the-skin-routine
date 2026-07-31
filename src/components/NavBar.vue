<template>
  <nav>
    <div class="navbar">
      <h1>
        <router-link to="/">
          The Skin Routine<span class="glyph">🩸</span>
        </router-link>
      </h1>
      <div class="nav-links">
        <SiteSearch />
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

<script lang="ts">
import { defineComponent } from "vue";
import SiteSearch from "./SiteSearch.vue";

export default defineComponent({
  name: "NavBar",
  components: {
    SiteSearch,
  },
});
</script>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  background-color: var(--color-light);
  z-index: 10;

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: var(--space-md) var(--space-xl);
    border-bottom: 1px solid var(--color-dark);

    h1 {
      font-weight: 500;
      margin: 0;
      padding-bottom: var(--space-sm);

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
      align-items: flex-end;
      gap: var(--space-lg);
      padding-bottom: var(--space-md);

      h5 {
        line-height: var(--lineHeight-lg);
        margin: 0;
        margin-left: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  nav .navbar {
    align-items: flex-start;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);

    h1 {
      margin-top: 0;
      padding-bottom: 0;
    }

    .nav-links {
      align-items: flex-end;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--space-md);
      padding-bottom: 0;
    }
  }
}
</style>
