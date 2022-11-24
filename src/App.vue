<template>
  <div class="wrapper">
    <NavBar />
    <div class="container flex-fill">
      <router-view />
    </div>
    <PageFooter />
  </div>
</template>

<script>
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    PageFooter,
    NavBar,
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
