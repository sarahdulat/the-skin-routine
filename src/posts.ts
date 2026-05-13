import { ref } from "vue";

export type Post = {
  slug: string;
  featured_image: string;
  alt: string;
  tags: {
    name: string;
    key: string;
  }[];
  title: string;
  summary: string;
};

export type Posts = Array<Post>;

export function getPosts() {
  return ref<Posts>([]);
}

export function getPost() {

}
