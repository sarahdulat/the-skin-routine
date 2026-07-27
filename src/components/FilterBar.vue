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
      <span v-if="activeTag" class="active-tag text-uppercase font-sans">#{{ activeTag }}</span>
      <span class="pregnancy-group ms-auto">
        <PopoverComponent triggerType="click">
          <template #trigger>
            <sup class="small"><i class="bi bi-info-circle" alt="instagram"></i></sup>
          </template>
          <template #content>
            <p class=" font-sans">Pregnancy Safe routines and products exclude products that have the following
              ingredients:
              Chemical
              Sunscreens,
              Retinoids, Bakuchiol, Bidens Pilosa, All Hydroxy Acids (Alpha, Beta and Poly), Glycolic Acid, Hemp/CBD,
              Dihydroxyacetone (DHA) and Erythrulose (Sunless Tanners), Hydroquinone, Alpha Arbutin, Kojic Acid,
              Licorice
              Root, Prostaglandin Analogues, Benzoyl Peroxide, Salicylates, Willow Bark, Snail Secretion, and Stem
              Cells.
            </p>

            <p class="small font-sans">For more information on why these ingredients are not considered pregnancy safe,
              check out <a href="https://www.15minutebeauty.com/" target="_blank">15 Minute Beauty</a>, it is a blog run
              by a Pediatric Critical Care doctor and mom. You should always read the labels of any product you use
              during
              pregnancy and talk to your doctor if you have any questions about using them.</p>
          </template>
        </PopoverComponent>
        <h6 class="px-sm">Pregnancy Safe:</h6>
        <Toggle :model-value="pregnancySafeOnly" @update:model-value="$emit('update:pregnancySafeOnly', $event)" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown from './Dropdown.vue';
import Toggle from './Toggle.vue';
import PopoverComponent from './PopoverComponent.vue';

export default defineComponent({
  components: { Dropdown, Toggle, PopoverComponent },
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
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-sm);
  white-space: nowrap;
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

    .pregnancy-group {
      gap: var(--space-sm);
    }

    >span:last-child {
      width: auto;
      margin-left: 0;
    }
  }
}
</style>
