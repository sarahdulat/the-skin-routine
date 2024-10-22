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
  const posts = ref<Posts>([]);

  butter.post.list({ page: 1, page_size: 10 }).then((res) => {
    posts.value = res.data?.data as unknown as Posts;
  });

  return posts;
}

export function getPost() {

}