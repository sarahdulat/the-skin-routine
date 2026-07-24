<template>
  <main>
    <div class="image">
      <img src="/images/Sarah.JPG?url" alt="Photo of Sarah in golden-hour light">
      <div class="caption">Golden Hour, June 2021</div>
    </div>

    <div class="content">
      <h3>The Skin Routine is here for routine inspiration.</h3>
      <p>
        On the homepage, the chart has a variety of routines plotted so you can explore skincare routines for different
        budgets, time commitments, age ranges, and skin
        concerns. Some are practical, some are aspirational, and some are celebrity routines because, frankly, I am nosy
        and I assume at least a few of you are too.
      </p>
      <p>
        By the way, I'm Sarah, the creator of The Skin Routine. This site started because people kept asking me what I
        use, in what
        order, and whether they really had to be as extra about skincare as I am. You can read more about me and how my
        own routine has changed over time in
        <router-link to="/blog/my-skincare-routine-has-changed">my skincare journey</router-link>.
      </p>
      <p>
        You will also find product reviews with more detailed thoughts on formulas, ingredients, texture, value, and how
        products performed when I personally tested them. My goal is to help you understand what might be worth trying,
        what might be skippable, and how a product fits into an actual routine.
      </p>
      <p>
        If you have feedback, questions, or a product you think I should look into, send me an email at
        <a href="mailto:hello@theskinroutine.com">hello@theskinroutine.com</a> or message me on socials.
      </p>

      <section class="disclosure">
        <h3>Affiliate Disclosure</h3>
        <p>
          Some links on The Skin Routine are affiliate links. This means I may earn a commission if you click a link and
          make a purchase, at no additional cost to you.
        </p>
        <p>
          I only share products, retailers, and resources that I think may be useful or relevant, but affiliate
          relationships may influence which links are available on the site. Product prices, availability, ingredients,
          and retailer policies can change, so always review the product details before purchasing.
        </p>
        <p>
          The content on this site is for informational purposes only and is not medical advice. If you have questions
          about your skin, pregnancy-safe products, allergies, or active ingredients, please check with a qualified
          healthcare professional.
        </p>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.content {
  margin: 0 15% var(--space-xl);
}

.image {
  margin-bottom: 1rem;
  max-width: 375px;
}

img {
  max-width: 100%;
  height: auto;
}

.caption {
  font-size: 0.75rem;
  font-style: italic;
  text-align: right;
}

.disclosure {
  margin-top: var(--space-xl);
}

p {
  font-size: var(--font-size-l);
}

h3+p {
  font-size: var(--font-size-l);

  &::first-letter {
    color: var(--color-dark);
    float: left;
    font-size: 75px;
    line-height: 50px;
    padding-top: 4px;
    padding-right: 4px;
  }
}
</style>
