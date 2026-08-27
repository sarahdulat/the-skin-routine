import "./sass/main.scss";
import { createSkinRoutineApp } from "./create-app";

const { app, router } = createSkinRoutineApp();

router.isReady().then(() => {
  app.mount("#app");
});
