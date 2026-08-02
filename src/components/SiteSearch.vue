<template>
  <div class="search" @focusout="handleSearchFocusOut">
    <label class="visually-hidden" for="site-search">Search</label>
    <input id="site-search" v-model="searchQuery" type="search" placeholder="Search" autocomplete="off"
      @focus="isSearchOpen = true" @keydown.esc="closeSearch" />
    <div v-if="isSearchOpen && searchQuery.trim()" class="search-results">
      <div v-if="searchResults.posts.length" class="search-group">
        <p class="search-label">Reviews</p>
        <router-link v-for="post in searchResults.posts" :key="post.id" class="search-result" :to="post.path"
          @pointerdown="handlePostPointerDown($event, post.path)" @click.prevent="selectPost(post.path)">
          <span>{{ post.title }}</span>
          <small>{{ post.description }}</small>
        </router-link>
      </div>
      <div v-if="searchResults.routines.length" class="search-group">
        <p class="search-label">Routines</p>
        <button v-for="routine in searchResults.routines" :key="routine.id" class="search-result" type="button"
          @pointerdown="handleRoutinePointerDown($event, routine.routine)" @click="selectRoutine(routine.routine)">
          <span>{{ routine.title }}</span>
          <small>{{ routine.description }}</small>
        </button>
      </div>
      <p v-if="!searchResults.posts.length && !searchResults.routines.length" class="search-empty">
        No results found.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { searchSite } from "../search";
import { store, type Routine } from "../store";

export default defineComponent({
  name: "SiteSearch",
  data() {
    return {
      searchQuery: "",
      isSearchOpen: false,
    };
  },
  computed: {
    searchResults() {
      return searchSite(this.searchQuery);
    },
  },
  methods: {
    closeSearch() {
      this.isSearchOpen = false;
      this.searchQuery = "";
    },
    handleSearchFocusOut(event: FocusEvent) {
      const currentTarget = event.currentTarget as HTMLElement;
      const nextFocusedElement = event.relatedTarget as Node | null;

      if (!nextFocusedElement || !currentTarget.contains(nextFocusedElement)) {
        this.isSearchOpen = false;
      }
    },
    handlePostPointerDown(event: PointerEvent, path: string) {
      if (event.pointerType === "mouse") return;

      event.preventDefault();
      this.selectPost(path);
    },
    handleRoutinePointerDown(event: PointerEvent, routine: Routine) {
      if (event.pointerType === "mouse") return;

      event.preventDefault();
      this.selectRoutine(routine);
    },
    selectPost(path: string) {
      this.closeSearch();
      this.$router.push(path);
    },
    selectRoutine(routine: Routine) {
      store.setCurrentRoutine(routine);
      this.closeSearch();
      this.$router.push({ name: "home", query: { routine: String(routine.id) } });
    },
  },
});
</script>

<style lang="scss" scoped>
.search {
  position: relative;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

input {
  display: block;
  width: clamp(8rem, 18vw, 14rem);
  border: 2px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  color: var(--color-dark);
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-sm);
  padding: var(--space-sm) var(--space-md);

  &:focus {
    outline: 1px solid var(--color-primary);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + var(--space-sm));
  right: 0;
  width: min(22rem, calc(100vw - var(--space-xl) * 2));
  max-height: min(70vh, 32rem);
  overflow-y: auto;
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  box-shadow: 1px 3px 0 var(--color-dark);
  padding: var(--space-md);
  z-index: 20;
}

.search-group+.search-group {
  margin-top: var(--space-lg);
}

.search-label,
.search-empty {
  margin: 0 0 var(--space-sm);
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  text-transform: uppercase;
  font-weight: 500;
}

.search-result {
  display: grid;
  width: 100%;
  gap: var(--space-sm);
  border: 0;
  border-top: 1px solid rgba(52, 58, 64, 0.18);
  background: transparent;
  color: inherit;
  font: inherit;
  padding: var(--space-md) 0;
  text-align: left;
  text-decoration: none;

  &:hover {
    color: var(--color-primary);
  }

  span {
    font-family: var(--font-family-sans-serif);
    font-size: var(--fontSize-sm);
    line-height: var(--lineHeight-sm);
  }

  small {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: var(--fontSize-xs);
    line-height: var(--lineHeight-xs);
  }
}

@media (max-width: 768px) {
  .search {
    order: 1;
    width: 100%;
  }

  input {
    width: 100%;
  }

  .search-results {
    right: 0;
    width: min(20rem, calc(100vw - var(--space-lg) * 2));
  }
}
</style>
