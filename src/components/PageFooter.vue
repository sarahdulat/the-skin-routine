<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-contact">
        <a href="mailto:hello@theskinroutine.com">hello@theskinroutine.com</a>
      </div>
      <div class="footer-legal">
        <button class="footer-link" type="button" @click="showDisclaimer = true">Affiliate Disclosure</button>
        <button class="footer-link" type="button" @click="showPrivacyPolicy = true">Privacy Policy</button>
        <button class="footer-link" type="button" @click="openCookieSettings">Cookie Settings</button>
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
    <Teleport to="body">
      <div v-if="showPrivacyPolicy" class="modal-backdrop" @click="showPrivacyPolicy = false">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="privacy-policy-title" @click.stop>
          <button class="modal-close" type="button" aria-label="Close" @click="showPrivacyPolicy = false">x</button>
          <PrivacyPolicyView />
        </div>
      </div>
    </Teleport>
  </footer>
</template>

<script lang="ts">
import DisclaimerView from "../views/DisclaimerView.vue";
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";

export default {
  components: {
    DisclaimerView,
    PrivacyPolicyView,
  },
  data() {
    return {
      showDisclaimer: false,
      showPrivacyPolicy: false,
    };
  },
  methods: {
    openCookieSettings() {
      window.dispatchEvent(new Event("open-cookie-settings"));
    },
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
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: var(--space-lg);
    width: 100%;
  }

  i {
    font-size: var(--fontSize-xl);
  }
}

.footer-contact {
  min-width: 0;

  a {
    overflow-wrap: anywhere;
  }
}

.footer-legal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  min-width: 0;
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  line-height: var(--lineHeight-xs);
  text-align: center;
}

.footer-socials {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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

  footer .footer-inner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .footer-contact {
    flex-grow: 1;
    font-size: var(--fontSize-xs);
    line-height: var(--lineHeight-xs);
    min-width: max-content;

    a {
      white-space: nowrap;
    }
  }

  .footer-legal {
    flex: 1 1 auto;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-inline: auto;
    gap: var(--space-sm);
    margin-top: 0;
    text-align: left;

    .footer-link {
      white-space: nowrap;
    }
  }

  .footer-socials {
    flex: 0 0 auto;
    margin-left: auto;
    min-width: max-content;
    gap: var(--space-md);
  }

}
</style>
