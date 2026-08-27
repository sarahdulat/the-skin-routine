import { createSSRApp } from "vue";
import App from "./App.vue";
import { createAppRouter, createServerRouter } from "./router";

export function createSkinRoutineApp(server = false) {
  const app = createSSRApp(App);
  const router = server ? createServerRouter() : createAppRouter();

  app.use(router);

  return { app, router };
}
