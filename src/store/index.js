import { createStore } from "vuex";
import posts from "./posts";
import db from "../db";

export default createStore({
  state: {
    posts: posts
  },
  getters: {
  },
  mutations: {
    setPosts(state) {
      db.read()
      db.data.posts = state.posts
    }
  },
  actions: {
  },
  modules: {},
});
