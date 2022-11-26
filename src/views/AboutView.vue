<template>
  <div class="row d-block">
    <div class="col-xs-12 image float-sm-start me-5 ps-0">
      <img src="/images/sarah.JPG" class="img-fluid" alt="Photo of Sarah">
      <div class="caption">Golden Hour, June 2021</div>
    </div>
    <div class="col-xs-12 col-lg-8 offset-lg-2">
      <h3 class="pt-3">✨ a lot of you have been asking about my skincare routine ✨</h3>
      <p>Hello, my name is Sarah and I am {{ currentAge }} old. Most people have a few questions upon hearing this, the first one is usually, "What?!" followed by, "What is your skincare routine?". This is when I have to admit that my daily skincare routine is actually a bit involved, and has been since April 2018. Not that I didn't take care of my skin before (I started using eye cream at 26), but April 2018 is when I began the routine that I still use today (more or less).</p>
      <p>People asking about my skincare routine genuinely want to know the details, but when I start to rattle off my 11-step routine they get a little glassy-eyed. "You're going to have to write this down for me." or "I'm going to watch you do your morning routine." 🙅‍♀️ After many of these conversations, I offered to put everything into a <a href="https://docs.google.com/spreadsheets/d/1PH3FHGTuFaOUuOaTCJxuLhv4Ril-zrSTL4Kd0aI74UA/edit?usp=sharing" target="_blank">Google Sheet</a> with the order, instructions, links, and alternatives for other skin types/concerns, but I almost immediately got feedback on the sheet. "What if I'm not as dedicated as you?" or, "What if I have a smaller budget?". It was then that I decided to create a more interactive medium for not only my routine but also for alternatives based on variables like budget and time.</p>
      <p>I should mention that I have little authority over skincare as I am not a dermatologist or certified aesthetician, but the people in my life come to me for skincare advice and have encouraged me to make use of my experience and my results. I am also aware that my perspective is very one-sided (as a cis white woman of 100% European descent) but I will do my best to do my research and add routines that work for all types of skin. 💪 Keep coming back to see more routines being added!</p>
    </div>
    <div class="col-xs-12 image float-end ms-5 pe-0">
      <img src="/images/sarah-2.JPG" class="img-fluid" alt="Photo of Sarah">
      <div class="caption">Dewey in Cartagena, October 2021</div>
    </div>
    <div class="col-xs-12 col-lg-8 offset-lg-2">
      <h3>Background</h3>
      <p>To set the record straight, I don't use any filters on photos of myself and I do not use Botox or fillers (except Botox for my TMJ). I don't get any regular facials or aesthetic services (but would certainly consider all of the above in the future). Thanks to my skincare routine I was able to stop using face makeup, and only use some eye makeup when I feel like it. I have struggled in the past with hormonal cystic acne which was caused by high testosterone levels, but I was able to get it under control using birth control and Spironolactone. (I know, don't @ me. It works and I don't want to poke the bear.) It is at this point that I often hear people attribute my good skin to genetics, which might help, but I know what my skin was starting to look like at 31 and that I now appear to be on average 27 (based on my very scientific game of "guess my age", the lowest I've gotten was 24 😱). My results today are from my skincare routine to which I stay incredibly consistent, even when I travel, which is often.</p>
      <!-- <h3>Consistency</h3>
      <p>One thing you will see me preach a lot is consistency. Without it, many things aren't possible, like your health, physique, and your skin. None of the routines I mention will work without consistency.</p> -->
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  components: {},
  computed: {
    currentAge () {
      return moment("19860913", "YYYYMMDD").fromNow(true);
    }
  }
}
</script>


<style scoped>
.image {
  margin-bottom: 1rem;
  max-width: 375px;
}
</style>
