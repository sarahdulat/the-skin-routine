<template>
  <div class="tree-list">
    <ul>
      <tree-node v-for="(node, index) in nodes" :key="index" :node="node" />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import TreeNode from "./TreeNode.vue"; // Import the recursive tree node component
import { BlogArchiveNode } from "../types";

export default defineComponent({
  name: "BlogArchiveTree",
  components: { TreeNode },
  props: {
    nodes: {
      type: Array as PropType<BlogArchiveNode[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.tree-list ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}
</style>
