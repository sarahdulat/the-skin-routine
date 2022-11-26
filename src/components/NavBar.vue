<template>
  <nav class="navbar navbar-expand-lg sticky-top pb-0">
    <div class="container">
      <h1>
        <router-link to="/">
          The Skin Routine<span class="glyph">🩸</span>
        </router-link>
      </h1>
      <div class="d-flex">
        <router-link to="/about" class="page-link ms-3">About</router-link>
        <router-link to="/blog" class="page-link ms-3">Blog</router-link>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: #FBFAF4;
  a.page-link {
    font-size: 1.25rem;
  }
}
.container {
  border-bottom: 1px solid #101518;
}
</style>
