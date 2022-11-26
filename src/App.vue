<template>
  <div class="wrapper">
    <NavBar />
    <div class="container">
      <main>
        <router-view />
      </main>
      <PageSidebar />
    </div>
    <PageFooter />
  </div>
</template>

<script>
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";
import PageSidebar from "./components/PageSidebar.vue";

export default {
  name: "App",
  components: {
    PageFooter,
    NavBar,
    PageSidebar
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.container {
  display: flex;
  flex-direction: row;
}
main {
  -webkit-flex: 3;
  flex: 3;
}
</style>
