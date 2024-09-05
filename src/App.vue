<template>
  <div class="wrapper">
    <NavBar />
    <div class="container">
      <router-view />
    </div>
    <PageFooter />
  </div>
</template>

<script lang="ts">
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
  max-height: 100vh;
}

.container {
  display: flex;
  flex-direction: row;
}
</style>
