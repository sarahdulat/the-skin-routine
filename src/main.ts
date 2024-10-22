import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import "./sass/main.scss";
import prismic from "./prismic";

createApp(App).use(store, key).use(router).use(prismic).mount("#app");
