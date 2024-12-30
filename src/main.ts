import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store/index";
import "./sass/main.scss";
import prismic from "./prismic";

createApp(App).use(router).use(prismic).mount("#app");
