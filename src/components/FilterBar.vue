<template>
  <div class="filter">
    <span>
      <h6>Filters:</h6>
      <Dropdown @change="" v-for="dropdown in dropdowns" :defaultValue="dropdown.defaultValue"
        :items="dropdown.items" />
    </span>
    <span class="ms-auto">
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
            Dihydroxyacetone (DHA) and Erythrulose (Sunless Tanners), Hydroquinone, Alpha Arbutin, Kojic Acid, Licorice
            Root, Prostaglandin Analogues, Benzoyl Peroxide, Salicylates, Willow Bark, Snail Secretion, and Stem Cells.
          </p>

          <p class="small font-sans">For more information on why these ingredients are not considered pregnancy safe,
            check out <a href="https://www.15minutebeauty.com/" target="_blank">15 Minute Beauty</a>, it is a blog run
            by a Pediatric Critical Care doctor and mom. You should always read the labels of any product you use during
            pregnancy and talk to your doctor if you have any questions about using them.</p>
        </template>
      </PopoverComponent>
      <h6 class="px-sm">Pregnancy Safe:</h6>
      <Toggle />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown from './Dropdown.vue';
import Toggle from './Toggle.vue';
import PopoverComponent from './PopoverComponent.vue';

export default defineComponent({
  components: { Dropdown, Toggle, PopoverComponent },
  props: {
    dropdowns: {
      type: Array as PropType<{ defaultValue: string, items: Array<string> }[]>,
      required: false,
      default: null,
    }
  }
});
</script>


<style lang="scss" scoped>
.filter {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-dark);
  background-color: var(--color-light);
  display: flex;

  h6 {
    display: inline;
  }

}
</style>
