<template>
  <div class="filter">
    <button class="filter-toggle" type="button" :aria-expanded="filtersOpen" aria-controls="filter-controls"
      aria-label="Toggle filters" @click="filtersOpen = !filtersOpen">
      <i class="bi bi-funnel" aria-hidden="true"></i>
    </button>
    <div id="filter-controls" class="filter-controls" :class="{ open: filtersOpen }">
      <span class="dropdown-group">
        <h6 class="filter-label">Filters:</h6>
        <Dropdown @change="" v-for="dropdown in dropdowns" :key="dropdown.defaultValue"
          :defaultValue="dropdown.defaultValue" :items="dropdown.items" />
      </span>
      <span v-if="activeTag" class="active-tag text-uppercase font-sans">
        #{{ activeTag }}
        <button class="clear-tag" type="button" :aria-label="`Remove ${activeTag} tag filter`" @click="clearActiveTag">
          <i class="bi bi-x-circle-fill" aria-hidden="true"></i>
        </button>
      </span>
      <PregnancySafetyToggle :model-value="pregnancySafeOnly"
        @update:model-value="$emit('update:pregnancySafeOnly', $event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown from './Dropdown.vue';
import PregnancySafetyToggle from './PregnancySafetyToggle.vue';

export default defineComponent({
  components: { Dropdown, PregnancySafetyToggle },
  data() {
    return {
      filtersOpen: false,
    };
  },
  props: {
    dropdowns: {
      type: Array as PropType<{ defaultValue: string, items: Array<string> }[]>,
      required: false,
      default: null,
    },
    pregnancySafeOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    activeTag: {
      type: String,
      required: false,
      default: "",
    }
  },
  emits: ["update:pregnancySafeOnly"],
  methods: {
    clearActiveTag() {
      const query = { ...this.$route.query };
      delete query.Tag;
      this.$router.push({ query });
    },
  },
});
</script>


<style lang="scss" scoped>
.filter {
  padding: var(--space-md) var(--space-xl);
  border-bottom: 1px solid var(--color-dark);
  background-color: var(--color-light);
  display: flex;
  gap: var(--space-lg);
  height: 60px;

  h6 {
    display: inline;
  }

}

.filter-toggle {
  display: none;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  width: 100%;

  >span {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-md);
  }
}

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-sm);
  white-space: nowrap;
}

.clear-tag {
  appearance: none;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }
}

@media (max-width: 768px) {
  .filter {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    height: auto;
  }

  .filter-toggle {
    display: inline-grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid var(--color-dark);
    border-radius: var(--radius-sm);
    background: var(--color-light);
    color: var(--color-dark);
    box-shadow: 1px 3px 0 var(--color-dark);
    cursor: pointer;
    font-size: var(--fontSize-md);
  }

  .filter-controls {
    display: none;
    flex-wrap: wrap;
    gap: var(--space-sm);
    width: 100%;

    &.open {
      display: flex;
    }

    >span {
      width: 100%;
    }

    .filter-label {
      display: none;
    }

    .dropdown-group {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-sm);
    }

    :deep(.pregnancy-group) {
      gap: var(--space-sm);
    }

    >span:last-child {
      width: auto;
      margin-left: 0;
    }
  }
}
</style>
