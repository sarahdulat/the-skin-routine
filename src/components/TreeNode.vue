<template>
  <li>
    <div class="tree-node" @click="toggleExpand">
      <span v-if="node.children"><span :class="{ expanded: isExpanded }" class="glyph hand">🖙</span>{{ node.name
        }}</span>
      <router-link v-else :to="'/blog/' + node.uid"><span class="glyph">🩸</span>{{ node.name }}</router-link>
    </div>

    <!-- Recursively display child nodes -->
    <ul v-if="isExpanded && node.children">
      <tree-node v-for="(child, index) in node.children" :key="index" :node="child" />
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { BlogArchiveNode } from "../types";

export default defineComponent({
  name: "TreeNode",
  props: {
    node: {
      type: Object as () => BlogArchiveNode,
      required: true,
    },
  },
  setup() {
    const isExpanded = ref(false);

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isExpanded,
      toggleExpand,
    };
  },
});
</script>

<style scoped>
.tree-node {
  cursor: pointer;
  user-select: none;
  padding: var(--space-sm) 0;
  text-indent: -5px;
  padding-left: 11px;
}

.tree-node span {
  margin-right: 5px;
}

.glyph {
  display: inline-block;

  /* Rotate the arrow when expanded */
  &.expanded {
    transform: rotate(90deg);
  }
}

ul {
  padding-left: var(--space-xl);
  margin-left: 0;
  list-style-type: none;
}
</style>
