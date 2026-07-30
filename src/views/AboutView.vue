<template>
  <main>
    <div class="image">
      <img src="/images/Sarah.JPG?url" alt="Photo of Sarah in golden-hour light">
      <div class="caption">Golden Hour, June 2021</div>
    </div>

    <div class="content">
      <p class="lede">
        Hi, I’m Sarah—the person friends and family ask when they want to talk about skincare, compare products, or
        figure out where another serum is supposed to go.
      </p>

      <p>
        The Skin Routine began after many versions of the same conversation. Someone would ask about my routine, I
        would enthusiastically explain every product and step, and somewhere around step seven they would tell me,
        “You’re going to have to write this down.”
      </p>

      <p>So I did.</p>

      <p>
        My first attempt was a very detailed Google Sheet containing every step, product, instruction, link, and
        possible alternative. I thought it was wonderfully comprehensive. My friends had other questions: What if I
        don’t have as much time? What if my budget is smaller? What if my skin needs something different?
      </p>

      <p>Those questions became the idea for The Skin Routine.</p>

      <p>
        I registered the domain in March 2021, but life took several unexpected and wonderful turns before I could
        finish the site. I got married, moved from the United States to Switzerland, became pregnant, had a baby, and
        adjusted to motherhood. Each of those changes also affected my skin, my routine, and the products available to
        me.
      </p>

      <p>
        Living near the French and German borders—and regularly visiting family in Poland—has introduced me to an
        entirely new world of skincare. The site reflects that international perspective, from French pharmacy staples
        and German drugstore discoveries to Polish brands and the American products I still ask visitors to bring in
        their suitcases.
      </p>

      <h2>What You’ll Find Here</h2>

      <p>
        The Skin Routine is about understanding what each step is meant to accomplish—not collecting the greatest
        possible number of products.
      </p>

      <p>
        I share my own routines, honest product experiences, practical alternatives, and options for different budgets,
        skin concerns, locations, and levels of dedication. Some people genuinely enjoy an involved routine. Others
        want three reliable steps they can complete on a busy morning. Both belong here.
      </p>

      <p>
        You’ll also find curated celebrity skincare routines. These bring together products and steps celebrities have
        discussed in published interviews, videos, and other sources, organized into routines that are much easier to
        explore. They are partly useful research and partly just fun, I know I'm not the only nosy one.
      </p>

      <p>
        My approach is simple: ingredients matter, formulation matters, consistency matters, and expensive does not
        automatically mean better. Sometimes a product is excellent. Sometimes it is lovely but unnecessary. And
        sometimes the best routine is simply the one you will actually follow.
      </p>

      <h2>An Important Note</h2>

      <p>
        I am not a dermatologist or certified aesthetician, and The Skin Routine is not a substitute for medical
        advice. I’m a longtime skincare enthusiast who has spent years reading, comparing, experimenting, and paying
        close attention to what works for my skin.
      </p>

      <p>
        My experience is still only my experience. Skin varies enormously, and factors such as hormones, pregnancy,
        medication, health conditions, climate, and skin tone can all affect how someone responds to a product. If you
        have a persistent skin condition, are pregnant or breastfeeding, or have questions about an active ingredient,
        please consult a dermatologist or healthcare professional.
      </p>

      <h2>Welcome</h2>

      <p>
        The Skin Routine is the project I wanted when friends first began asking me to write everything down: thoughtful
        enough for skincare enthusiasts, approachable enough for beginners, and flexible enough to fit real life.
      </p>

      <p>
        I built it to share what I’ve learned, continue learning in public, and hopefully make skincare a little easier
        to understand. You can read more about how my own routine has evolved in
        <router-link to="/blog/my-skincare-routine-has-changed">my skincare journey</router-link>.
      </p>

      <p>
        Have a look around—and if something is helpful, confusing, missing, or completely unnecessary, I would genuinely
        love to hear from you. Email me at
        <a href="mailto:hello@theskinroutine.com">hello@theskinroutine.com</a> or message me on social media.
      </p>

      <p>Welcome to The Skin Routine. ✨</p>
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
  max-width: 900px;
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

p {
  font-size: var(--font-size-l);
  line-height: 1.65;
}

h1 {
  margin-bottom: var(--space-l);
  text-align: center;
}

h2 {
  margin-top: var(--space-xl);
}

.lede {
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

@media (max-width: 768px) {
  .content {
    margin-right: var(--space-l);
    margin-left: var(--space-l);
  }
}
</style>
