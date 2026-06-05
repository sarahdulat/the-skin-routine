<template>
  <footer>
    <div>
      <div class="me-auto">
        <a href="mailto:hello@theskinroutine.com">hello@theskinroutine.com</a>
      </div>
      <div><button class="footer-link" type="button" @click="showDisclaimer = true">Affiliate Disclosure</button></div>
      <div class="ms-auto text-nowrap">
        <a href="http://www.instagram.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-instagram" alt="instagram"></i>
        </a>
        <a href="http://www.xthreads.com/@the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-threads ms-lg" alt="x"></i>
        </a>
        <a href="http://www.x.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-twitter-x ms-lg" alt="x"></i>
        </a>
        <a href="http://www.pinterest.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-pinterest ms-lg" alt="pinterest"></i>
        </a>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showDisclaimer" class="modal-backdrop" @click="showDisclaimer = false">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title" @click.stop>
          <button class="modal-close" type="button" aria-label="Close" @click="showDisclaimer = false">x</button>
          <DisclaimerView />
        </div>
      </div>
    </Teleport>
  </footer>
</template>

<script lang="ts">
import DisclaimerView from "../views/DisclaimerView.vue";

export default {
  components: {
    DisclaimerView,
  },
  data() {
    return {
      showDisclaimer: false,
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  background-color: var(--color-light);
  border-top: 1px solid var(--color-dark);
  position: sticky;
  bottom: 0;
  padding: var(--space-lg) var(--space-xl);

  >div {
    display: flex;
    align-items: center;
  }

  i {
    font-size: var(--fontSize-xl);
  }
}

.footer-link {
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: var(--color-primary);
  }
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: var(--space-xl);
  background: rgba(52, 58, 64, 0.45);
}

.modal {
  position: relative;
  width: min(640px, 100%);
  max-height: min(80vh, 720px);
  overflow: auto;
  background: var(--color-light);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  box-shadow: 1px 3px 0 var(--color-dark);
  padding: var(--space-xl);
}

.modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  color: var(--color-dark);
  cursor: pointer;
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-md);
  line-height: 1;

  &:hover {
    background: rgba(241, 101, 68, 0.05);
  }
}
</style>
