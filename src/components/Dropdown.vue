<template>
  <div class="dropdown-container">
    <select v-model="selectedOption" @change="updateQueryParam" :aria-labelledby="defaultValue">
      <option :value="defaultValue" disabled selected>{{ defaultValue }}</option>
      <option value="all">All {{ defaultValue }}</option>
      <option v-for="(item, index) in items" :key="index" :value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";

export default defineComponent({
  name: "Dropdown",
  data() {
    return {
      selectedOption: this.$route.query?.filter ?? this.$props.defaultValue,
    };
  },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: "",
    },
    items: {
      type: Array as PropType<string[]>,
      required: true,
    },
    defaultValue: {
      type: String,
      required: true
    }
  },
  watch: {
    "$route.query.filter"(newFilter) {
      this.selectedOption = newFilter || "all";
    },
  },
  methods: {
    updateQueryParam() {
      this.$router.push({ query: { ...this.$route.query, [this.defaultValue]: this.selectedOption } });
    },
  },
  mounted() {
    this.selectedOption = this.$route.query[this.defaultValue] || this.defaultValue;
  }
});
</script>

<style scoped>
/* Dropdown container */
.dropdown-container {
  margin: 0 var(--space-md);
  display: inline;
}

/* Styled select dropdown */
select {
  min-width: 120px;
  appearance: none;
  /* Remove native dropdown arrow */
  padding: var(--space-md) var(--space-xl) var(--space-md) var(--space-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-dark);
  background-color: var(--color-light);
  cursor: pointer;
  position: relative;
  box-shadow: 1px 3px 0 var(--color-dark);
}

select:hover {
  background-color: rgba(241, 101, 68, 0.05)
}

/* Add a custom arrow */
select::after {
  content: "▼";
  position: absolute;
  right: var(--space-md);
  pointer-events: none;
}

/* Dropdown arrow custom styling */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='none' d='M0 0h20v20H0z'/%3E%3Cpath fill='%343A40' d='M5.5 7.5l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-sm) center;
  background-size: var(--space-lg);
}

select:focus {
  outline: none;
}
</style>
