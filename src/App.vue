<template>
  <NavBar />
  <div class="container">
    <router-view />
  </div>
  <PageFooter />
</template>

<script>
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    PageFooter,
    NavBar,
  },
};
</script>
