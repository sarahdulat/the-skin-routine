import { createStore } from "vuex";
import posts from "./posts";

export default createStore({
  state: {
    posts: posts
  },
  getters: {
    getPost: (state) => (slug) => {
      console.log('hi')
      return state.posts.find(c => Number(c.slug) === Number(slug));
    },
    getPosts: (state) => {
      return state.posts;
    }
  },
  mutations: {},
  actions: {},
  modules: {},
});
