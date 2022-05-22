<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
      <h1>
        <router-link to="/">
          The Skin Routine<span class="glyph">🩸</span>
        </router-link>
      </h1>
      <div class="d-flex">
        <router-link to="/about" class="ms-2">About</router-link>
        <router-link to="/blog" class="ms-2">Blog</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.container {
  border-bottom: 1px solid #101518;
}
</style>
