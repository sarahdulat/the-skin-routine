import { createMemoryHistory, createRouter, createWebHistory, type RouterHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import BlogView from "../views/BlogView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostView from "../views/PostView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/routine/:routineSlug/",
    name: "routine",
    component: HomeView,
  },
  {
    path: "/about/",
    name: "about",
    component: AboutView,
  },
  {
    path: "/blog/",
    name: "blog",
    component: BlogView,
  },
  {
    path: "/blog/:slug/",
    name: "blog-post",
    component: PostView,
  },
  {
    path: "/disclaimer",
    name: "disclaimer",
    redirect: "/",
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  const router = createRouter({
    history,
    routes,
  });

  return router;
}

export function createServerRouter() {
  return createAppRouter(createMemoryHistory());
}
