<template>
  <div class="wrapper">
    <SiteSEO />
    <NavBar />
    <div class="container">
      <router-view />
    </div>
    <PageFooter />
    <CookieConsentBanner />
  </div>
</template>

<script lang="ts">
import CookieConsentBanner from "./components/CookieConsentBanner.vue";
import PageFooter from "./components/PageFooter.vue";
import NavBar from "./components/NavBar.vue";
import SiteSEO from "./components/SiteSEO.vue";
export default {
  name: "App",
  components: {
    CookieConsentBanner,
    PageFooter,
    NavBar,
    SiteSEO,
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
