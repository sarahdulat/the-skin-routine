<template>
  <div class="filter">
    <h6>Filters:</h6>
    <Dropdown :defaultValue="'Brands'" :items="brands" />
    <Dropdown :defaultValue="'Product Type'" :items="product_type" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown from './Dropdown.vue';
import { Post } from "../types";

export default defineComponent({
  components: { Dropdown },
  props: {
    posts: {
      type: Array as PropType<Post[] | null>,
      required: false,
      default: null,
    }
  },
  computed: {
    brands() {
      return this.posts?.map?.((post: Post) => post.data.brand);
    },
    product_type() {
      return this.posts?.map?.((post: Post) => post.data.product_type);
    }
  }
});
</script>


<style lang="scss" scoped>
.filter {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-text);
  background-color: var(--color-body);

  h6 {
    display: inline;
  }

}
</style>
