<template>
  <li>
    <div class="tree-node" @click="toggleExpand">
      <span v-if="node.children" :class="{ expanded: isExpanded }" class="glyph hand">🖙</span>
      <span v-else class="glyph">🩸</span> {{ node.name }}
    </div>

    <!-- Recursively display child nodes -->
    <ul v-if="isExpanded && node.children">
      <tree-node v-for="(child, index) in node.children" :key="index" :node="child" />
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface BlogArchiveNode {
  name: string;
  children?: BlogArchiveNode[];
}

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
