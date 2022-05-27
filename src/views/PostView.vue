<template>
  <div class="row">
    <img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" class="cover-img">
  </div>
  <div class="col-xs-12 col-md-8 offset-md-2">
    <div class="text-center">
      <h6 class="mt-5">BEAUTY</h6>
      <h1 class="mt-5">{{ post.title }}</h1>
      <h6 class="mt-5">September 13, 2021</h6>
    </div>
    <p class="mt-5">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus
      accumsan et viverra justo commodo. Proin sodales pulvinar tempor.
      Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
      ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis
      tellus mollis orci, sed rhoncus sapien nunc eget.
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  props: {
    id: {
      type: Number,
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters ({
      getPost: 'getPost',
    }),
    post () {
      return this.getPost(this.slug);
    }
  }
}
</script>

<style lang="scss" scoped>
  .cover-img {
    width: 100%;
    height: 300px;
    padding: 0;
    object-fit: cover;
  }
</style>
