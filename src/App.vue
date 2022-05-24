<template>
  <div class="wrapper">
    <div class="container flex-fill">
      <ComingSoon />
    </div>
    <PageFooter />
  </div>
</template>

<script>
import ComingSoon from "./views/ComingSoon.vue";
import PageFooter from "./components/PageFooter.vue";
export default {
  name: "App",
  components: {
    ComingSoon,
    PageFooter,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
