<template>
  <div class="col-xs-12 col-sm-4">
    <div class="scroll-container overflow-scroll">
      <h2 class="text-decoration-underline mt-3">Sarah's Routine</h2>
      <div class="border-bottom mb-3">
        <h3 class="d-inline">01. </h3>
        <h4 class="d-inline">Cleanse <span class="glyph">🖟</span></h4>
        <div>
          <a href="#" target="_blank">Tatcha The Deep Cleanse</a>
        </div>
        <div class="description">
          <p>
            No reason to wash your face in the morning even if you use a retinol at night, UNLESS you get super greasy overnight or
            work out in the am. But if you want to start clean, any gentle non-stripping cleanser works.</p>
          <p>
            If you wear make up, sometimes a gentle exfoliant is good in the am to smooth your palette. I love this chemical exfoliant by Tatcha since it has a small amount of grit to make you feel clean.
          </p>
          <p>
            Fun fact: Many people use cleansers with chemical exfoliants wrong, work it in on a damp face and let it sit for a minute or two. Then gently start to massage in while rinsing. I used to think expensive cleansers were a scam until I realized this.
          </p>
        </div>
      </div>
      <div class="border-bottom mb-3">
        <h3 class="d-inline">02. </h3>
        <h4 class="d-inline">Tone <span class="glyph">🖟</span></h4>
        <div>
          <a href="#" target="_blank">Thayer's Toner</a>
        </div>
        <div class="description">
          <p>
            Swipe your face with a cotton pad and toner if you wash your face in the am. I like micellar water or Thayer's
            non-alcoholic toner. No need to if you did not cleanse, skip to step 3.
          </p>
        </div>
      </div>
      <div class="border-bottom mb-3">
        <h3 class="d-inline">02. </h3>
        <h4 class="d-inline">Tone <span class="glyph">🖟</span></h4>
        <div>
          <a href="#" target="_blank">Thayer's Toner</a>
        </div>
        <div class="description">
          <p>
            Swipe your face with a cotton pad and toner if you wash your face in the am. I like micellar water or Thayer's
            non-alcoholic toner. No need to if you did not cleanse, skip to step 3.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  methods: {
    showDescription () {

    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-container {
  max-height: calc(100vh - 155px);
}
</style>
