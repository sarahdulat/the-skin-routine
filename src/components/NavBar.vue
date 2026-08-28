<template>
  <nav>
    <div class="navbar">
      <div class="site-title">
        <router-link to="/">
          The Skin Routine<span class="glyph">🩸</span>
        </router-link>
      </div>
      <button class="menu-toggle" type="button" :aria-expanded="isMenuOpen" aria-controls="primary-navigation"
        aria-label="Toggle navigation menu" @click="toggleMenu">
        <i :class="isMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'" aria-hidden="true"></i>
      </button>
      <div id="primary-navigation" class="nav-links" :class="{ open: isMenuOpen }">
        <SiteSearch />
        <h5>
          <router-link to="/about/" @click="closeMenu">About</router-link>
        </h5>
        <h5>
          <router-link to="/blog/" @click="closeMenu">Reviews</router-link>
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
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    closeMenu() {
      this.isMenuOpen = false;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
  watch: {
    "$route.fullPath"() {
      this.closeMenu();
    },
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

    .site-title {
      font-weight: 500;
      margin: 0;
      padding-bottom: var(--space-sm);
      font-size: var(--fontSize-4xl);
      line-height: var(--lineHeight-4xl);
      letter-spacing: var(--letterSpacing-4xl);
      font-family: var(--font-family-sans-serif);

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

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  nav .navbar {
    position: relative;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);

    .site-title {
      margin-top: 0;
      padding-bottom: 0;
    }

    .menu-toggle {
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      margin-left: auto;
      border: 1px solid var(--color-dark);
      border-radius: var(--radius-sm);
      background: var(--color-light);
      color: var(--color-dark);
      box-shadow: 1px 3px 0 var(--color-dark);
      font-size: var(--fontSize-lg);
      line-height: 1;
      padding: 0;
    }

    .nav-links {
      position: absolute;
      top: calc(100% + 1px);
      right: var(--space-lg);
      left: var(--space-lg);
      display: none;
      align-items: stretch;
      flex-direction: column;
      gap: var(--space-lg);
      border: 1px solid var(--color-dark);
      border-top: 0;
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
      background: var(--color-light);
      box-shadow: 1px 3px 0 var(--color-dark);
      padding: var(--space-lg);

      &.open {
        display: flex;
      }

      h5 {
        line-height: var(--lineHeight-md);
      }
    }
  }
}
</style>
