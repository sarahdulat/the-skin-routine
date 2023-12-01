import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import BlogView from "../views/BlogView.vue";
import DisclaimerView from "../views/DisclaimerView.vue";
import FAQView from "../views/FAQView.vue";
import PostView from "../views/PostView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/blog/",
    name: "blog",
    component: BlogView,
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: PostView,
  },
  {
    path: "/disclaimer",
    name: "disclaimer",
    component: DisclaimerView,
  },
  {
    path: "/faq",
    name: "faq",
    component: FAQView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
