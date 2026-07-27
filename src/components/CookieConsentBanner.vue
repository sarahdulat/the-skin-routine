<template>
  <div v-if="showBanner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
    <div>
      <p class="m-0 font-sans">
        We use essential site storage and optional analytics cookies to understand how visitors use The Skin Routine.
      </p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="button-secondary" @click="setConsent('denied')">Reject</button>
      <button type="button" @click="setConsent('granted')">Accept analytics</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const consentStorageKey = "theSkinRoutineAnalyticsConsent";

export default defineComponent({
  name: "CookieConsentBanner",
  data() {
    return {
      showBanner: false,
    };
  },
  created() {
    window.addEventListener("open-cookie-settings", this.openSettings);
  },
  beforeUnmount() {
    window.removeEventListener("open-cookie-settings", this.openSettings);
  },
  methods: {
    openSettings() {
      this.showBanner = true;
    },
    updateGoogleConsent(consent: AnalyticsConsent) {
      window.gtag?.("consent", "update", {
        analytics_storage: consent,
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    },
    setConsent(consent: AnalyticsConsent) {
      localStorage.setItem(consentStorageKey, consent);
      this.updateGoogleConsent(consent);
      this.showBanner = false;
    },
  },
  mounted() {
    const savedConsent = localStorage.getItem(consentStorageKey) as AnalyticsConsent | null;

    if (savedConsent === "granted" || savedConsent === "denied") {
      this.updateGoogleConsent(savedConsent);
      return;
    }

    this.showBanner = true;
  },
});
</script>

<style lang="scss" scoped>
.cookie-banner {
  position: fixed;
  right: var(--space-xl);
  bottom: calc(var(--space-xl) + 4rem);
  left: var(--space-xl);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  box-shadow: 1px 3px 0 var(--color-dark);
}

.cookie-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: none;
}

button {
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-dark);
  color: var(--color-light);
  cursor: pointer;
  font-family: var(--font-family-sans-serif);
  padding: var(--space-md) var(--space-lg);
  box-shadow: 1px 3px 0 var(--color-dark);

  &:hover {
    background: var(--color-primary);
  }
}

.button-secondary {
  background: var(--color-light);
  color: var(--color-dark);

  &:hover {
    background: rgba(241, 101, 68, 0.05);
  }
}

@media (max-width: 768px) {
  .cookie-banner {
    right: var(--space-lg);
    bottom: calc(var(--space-lg) + 5rem);
    left: var(--space-lg);
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }

  .cookie-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>
