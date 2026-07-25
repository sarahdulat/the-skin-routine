<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-contact">
        <a href="mailto:hello@theskinroutine.com">hello@theskinroutine.com</a>
        <button class="footer-link" type="button" @click="showDisclaimer = true">Affiliate Disclosure</button>
      </div>
      <div class="footer-socials" aria-label="Social links">
        <a href="http://www.instagram.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-instagram" alt="Instagram"></i>
        </a>
        <a href="http://www.threads.com/@the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-threads" alt="Threads"></i>
        </a>
        <!-- <a href="http://www.x.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-twitter-x ms-lg" alt="x"></i>
        </a> -->
        <!-- <a href="http://www.pinterest.com/the_skinroutine" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-pinterest ms-lg" alt="pinterest"></i>
        </a> -->
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

  .footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
  }

  i {
    font-size: var(--fontSize-xl);
  }
}

.footer-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
  min-width: 0;
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex: none;
  white-space: nowrap;
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

@media (max-width: 768px) {
  footer {
    padding: var(--space-md) var(--space-lg);
  }

  .footer-contact {
    font-size: var(--fontSize-sm);
    line-height: var(--lineHeight-sm);
  }
}
</style>
