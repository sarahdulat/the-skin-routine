<template>
  <span class="pregnancy-group ms-auto">
    <PopoverComponent triggerType="click">
      <template #trigger>
        <sup class="small"><i class="bi bi-info-circle" aria-hidden="true"></i></sup>
      </template>
      <template #content>
        <div class="pregnancy-popover">
          <p class="small pb-md">This filter shows only routines and products we have positively verified against our
            conservative pregnancy criteria. A product that is not included may simply be unverified; it is not
            automatically unsafe.</p>
          <p class="small font-sans">
            When checking formulas, we exclude ingredients commonly avoided during pregnancy:</p>
          <ul class="small font-sans">
            <li>Chemical sunscreens</li>
            <li>Retinoids, bakuchiol, and Bidens pilosa</li>
            <li>Alpha, beta, and poly hydroxy acids</li>
            <li>Glycolic acid and salicylates</li>
            <li>Hemp/CBD</li>
            <li>DHA and erythrulose sunless tanners</li>
            <li>Hydroquinone, alpha arbutin, kojic acid, and licorice root</li>
            <li>Prostaglandin analogues</li>
            <li>Benzoyl peroxide</li>
            <li>Willow bark, snail secretion, and stem cells</li>
          </ul>
          <p class="small font-sans">For more detail, check out <a href="https://www.15minutebeauty.com/"
              target="_blank">15 Minute Beauty</a>. Always read product labels and talk to your doctor if you have
            questions about using products during pregnancy.</p>
        </div>
      </template>
    </PopoverComponent>
    <h6 class="px-sm">Pregnancy Safe:</h6>
    <Toggle :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PopoverComponent from "./PopoverComponent.vue";
import Toggle from "./Toggle.vue";

export default defineComponent({
  name: "PregnancySafetyToggle",
  components: { PopoverComponent, Toggle },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:modelValue"],
});
</script>

<style lang="scss" scoped>
.pregnancy-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.pregnancy-popover {
  display: grid;
  gap: var(--space-sm);

  p,
  ul {
    margin: 0;
  }

  ul {
    padding-left: var(--space-lg);
  }

  li+li {
    margin-top: var(--space-xs);
  }
}

@media (max-width: 768px) {
  .pregnancy-group {
    gap: var(--space-sm);
  }
}
</style>
