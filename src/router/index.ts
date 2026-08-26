import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import BlogView from "../views/BlogView.vue";
import FAQView from "../views/FAQView.vue";
import PostView from "../views/PostView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "The Skin Routine",
    },
  },
  {
    path: "/routine/:routineSlug",
    name: "routine",
    component: HomeView,
    meta: {
      title: "The Skin Routine",
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: {
      title: "About | The Skin Routine",
    },
  },
  {
    path: "/blog/",
    name: "blog",
    component: BlogView,
    meta: {
      title: "Reviews | The Skin Routine",
    },
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: PostView,
  },
  {
    path: "/disclaimer",
    name: "disclaimer",
    redirect: "/",
  },
  {
    path: "/faq",
    name: "faq",
    component: FAQView,
    meta: {
      title: "FAQ | The Skin Routine",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  if (to.name === "blog-post") return;

  document.title = typeof to.meta.title === "string" ? to.meta.title : "The Skin Routine";
});

export default router;
