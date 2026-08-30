<template>
  <main>
    <NotFoundContent />
  </main>
</template>

<script lang="ts" setup>
import NotFoundContent from "../components/NotFoundContent.vue";
</script>

<style lang="scss" scoped>
main {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}
</style>
