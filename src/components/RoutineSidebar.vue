<template>
  <aside>
    <div v-if="!currentRoutine" class="routine-empty-state" role="status">
      <p>No routines match these filters.</p>
      <p class="small font-sans">Adjust the filters to see routine steps.</p>
    </div>
    <template v-else>
      <div class="sidebar-header">
        <div class="routine-header my-lg">
          <component :is="routineHeadingTag" class="routine-title">{{ currentRoutine.routine_name }}</component>
          <div v-if="firstSource" class="sources" aria-label="Routine sources">
            <div ref="sourceOverflow" class="source-overflow" :class="{ open: isSourcePopoverOpen }"
              @mouseenter="updateSourcePopoverPosition" @focusin="updateSourcePopoverPosition">
              <button class="source-pill" type="button" :aria-expanded="isSourcePopoverOpen"
                :aria-label="`${sources.length} routine sources`" @click.stop="toggleSourcePopover">
                <img v-if="shouldShowFavicon(firstSource)" :src="firstSource.favicon"
                  :alt="`${firstSource.site || firstSource.label} icon`" @error="markFaviconFailed(firstSource)" />
                <span v-else class="source-favicon-fallback glyph" aria-hidden="true">🩸</span>
                <span>{{ firstSourceName }}</span>
                <span v-if="hasMultipleSources" class="source-count">+{{ additionalSourceCount }}</span>
              </button>
              <div v-if="isSourcePopoverOpen" class="source-popover" role="tooltip" :style="sourcePopoverStyle">
                <a v-for="source in sources" :key="source.link" class="source-card" :href="source.link" target="_blank"
                  rel="noopener noreferrer">
                  <img v-if="sourceCardImage(source)" class="source-image" :src="sourceCardImage(source)"
                    :alt="sourceCardImageAlt(source)" loading="lazy" decoding="async"
                    @error="markSourceImageFailed(sourceCardImage(source))" />
                  <span v-else class="source-image source-image-fallback glyph" aria-hidden="true">🩸</span>
                  <span class="source-card-content">
                    <span class="source-site">
                      <img v-if="shouldShowFavicon(source)" :src="source.favicon"
                        :alt="`${source.site || source.label} icon`" loading="lazy" decoding="async"
                        @error="markFaviconFailed(source)" />
                      <span v-else class="source-site-favicon-fallback glyph" aria-hidden="true">🩸</span>
                      <span>{{ source.site || source.label }}</span>
                      <span v-if="sourceDisplayDate(source)" class="source-date">{{ sourceDisplayDate(source) }}</span>
                    </span>
                    <span class="source-headline">{{ source.headline || source.label }}</span>
                    <span v-if="source.summary" class="source-summary">{{ source.summary }}</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <input type="checkbox" id="toggle" :checked="routineTime === 'pm'" />
        <label class='toggleContainer'>
          <div @click="store.setRoutineTime('am')">am <span class="glyph">☀</span></div>
          <div @click="store.setRoutineTime('pm')">pm <span class="glyph">⏾</span></div>
        </label>
      </div>
      <div ref="stepsScrollContainer" class="scroll-container">
        <div v-if="isRoutineMissing" class="routine-alert" role="status">
          We don't have enough information for this routine :(
        </div>
        <div v-for="(step, index) in steps" v-else :key="stepKey(index)" class="step mb-lg pb-lg">
          <component :is="stepHeadingTag" class="step-heading">
            <span class="step-order">{{ formatStepOrder(index) }}</span>
            <span class="step-title">{{ step.title }}</span>
            <button class="glyph hand" type="button" :class="{ expanded: isStepExpanded(stepKey(index)) }"
              :aria-expanded="isStepExpanded(stepKey(index))" :aria-controls="`step-description-${stepKey(index)}`"
              :aria-label="`${isStepExpanded(stepKey(index)) ? 'Hide' : 'Show'} details for ${step.title}`"
              @click="toggleStep(stepKey(index))">🖙</button>
          </component>
          <div class="pt-md">
            <a :href="step.link" target="_blank" :rel="externalLinkRel(step.link)">{{ step.product }}</a>
            <!-- <button class="px-sm ms-md">Buy</button> -->
          </div>
          <div v-show="isStepExpanded(stepKey(index))" class="mt-sm" :id="`step-description-${stepKey(index)}`"
            @click="handleDescriptionClick">
            <div v-html="qualifyAffiliateLinksInHtml(step.description)"></div>
          </div>
        </div>
      </div>
    </template>
  </aside>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { store, type Routine } from '../store'
import { externalLinkRel, qualifyAffiliateLinksInHtml } from '../affiliate-links';

const props = withDefaults(defineProps<{
  isRoutinePage?: boolean;
}>(), {
  isRoutinePage: false,
});

type RoutineSource = {
  label: string;
  link: string;
  site?: string;
  favicon?: string;
  image?: string;
  headline?: string;
  summary?: string;
  date?: string;
  publishDate?: string;
  publishedDate?: string;
  published_at?: string;
};

type RoutineWithSources = Routine & {
  sources?: RoutineSource[];
  celebrity_face_image?: string;
};

const currentRoutine = computed(() => store.currentRoutine);
const routineTime = computed(() => store.routineTime);
const routineHeadingTag = computed(() => props.isRoutinePage ? "h1" : "h2");
const stepHeadingTag = computed(() => props.isRoutinePage ? "h2" : "h3");
const router = useRouter();
const currentRoutineId = computed(() => currentRoutine.value?.id ?? null);
const amSteps = computed(() => Object.values(currentRoutine.value?.steps.am ?? {}));
const pmSteps = computed(() => Object.values(currentRoutine.value?.steps.pm ?? {}));
const steps = computed(() => routineTime.value === 'am' ? amSteps.value : pmSteps.value);
const isRoutineMissing = computed(() => steps.value.length === 0);
const firstSource = computed(() => sources.value[0] ?? null);
const firstSourceName = computed(() => firstSource.value?.site || firstSource.value?.label || 'Sources');
const hasMultipleSources = computed(() => sources.value.length > 1);
const additionalSourceCount = computed(() => Math.max(sources.value.length - 1, 0));
const expandedSteps = ref(new Set<string>());
const stepsScrollContainer = ref<HTMLElement | null>(null);
const failedFavicons = ref(new Set<string>());
const failedSourceImages = ref(new Set<string>());
const isSourcePopoverOpen = ref(false);
const sourceOverflow = ref<HTMLElement | null>(null);
const sourcePopoverStyle = ref<Record<string, string>>({});
let sourcePopoverFrame = 0;

const getFaviconKey = (source: RoutineSource) => source.favicon || source.link;

const shouldShowFavicon = (source: RoutineSource | null) => {
  return Boolean(source?.favicon && !failedFavicons.value.has(getFaviconKey(source)));
};

const markFaviconFailed = (source: RoutineSource) => {
  failedFavicons.value = new Set([...failedFavicons.value, getFaviconKey(source)]);
};

const markSourceImageFailed = (imageUrl: string | undefined) => {
  if (!imageUrl) return;
  failedSourceImages.value = new Set([...failedSourceImages.value, imageUrl]);
};

const sourceCardImage = (source: RoutineSource): string | undefined => {
  if (source.image && !failedSourceImages.value.has(source.image)) return source.image;

  const celebrityImage = (currentRoutine.value as RoutineWithSources | null)?.celebrity_face_image;
  if (celebrityImage && !failedSourceImages.value.has(celebrityImage)) return celebrityImage;

  return undefined;
};

const sourceCardImageAlt = (source: RoutineSource) => {
  if (source.image && !failedSourceImages.value.has(source.image)) {
    return source.headline || source.label;
  }

  return `${currentRoutine.value?.routine_name || source.label} portrait`;
};

const sourceDisplayDate = (source: RoutineSource): string => {
  const explicitDate = source.date || source.publishDate || source.publishedDate || source.published_at;

  if (explicitDate) return explicitDate;

  if (source.site && source.label.startsWith(source.site)) {
    const labelRemainder = source.label.slice(source.site.length).trim();
    if (labelRemainder) return labelRemainder;
  }

  return source.label.match(/\b(19|20)\d{2}\b/)?.[0] ?? "";
};

const sourceDateTime = (source: RoutineSource) => {
  const displayDate = sourceDisplayDate(source);
  const year = displayDate.match(/\b(19|20)\d{2}\b/)?.[0];
  const date = new Date(displayDate);

  if (!Number.isNaN(date.getTime())) return date.getTime();
  if (year) return new Date(Number(year), 0, 1).getTime();

  return 0;
};

const sources = computed(() => {
  const routineSources = (currentRoutine.value as RoutineWithSources | null)?.sources ?? [];

  return [...routineSources].sort((a, b) => sourceDateTime(b) - sourceDateTime(a));
});

const stepKey = (index: number) => String(index);

const formatStepOrder = (index: number) => `${String(index + 1).padStart(2, '0')}. `;

const resetExpandedSteps = () => {
  expandedSteps.value = new Set(steps.value[0] ? [stepKey(0)] : []);
};

const scrollStepsToTop = async () => {
  await nextTick();
  stepsScrollContainer.value?.scrollTo({ top: 0 });
};

const isStepExpanded = (order: string) => expandedSteps.value.has(order);

const toggleStep = (order: string) => {
  const nextExpandedSteps = new Set(expandedSteps.value);

  if (nextExpandedSteps.has(order)) {
    nextExpandedSteps.delete(order);
  } else {
    nextExpandedSteps.add(order);
  }

  expandedSteps.value = nextExpandedSteps;
};

const handleDescriptionClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;
  const link = target?.closest('a');
  const href = link?.getAttribute('href');

  if (!link || !href || link.target || !href.startsWith('/')) return;

  event.preventDefault();
  router.push(href);
};

const updateSourcePopoverPosition = () => {
  if (!sourceOverflow.value) return;

  const viewportPadding = 16;
  const popoverWidth = Math.min(384, window.innerWidth - viewportPadding * 2);
  const pillRect = sourceOverflow.value.getBoundingClientRect();
  const preferredLeft = pillRect.left;
  const maxLeft = window.innerWidth - viewportPadding - popoverWidth;
  const viewportLeft = Math.min(Math.max(preferredLeft, viewportPadding), maxLeft);

  sourcePopoverStyle.value = {
    left: `${viewportLeft}px`,
    top: `${pillRect.bottom + 8}px`,
    width: `${popoverWidth}px`,
  };
};

const updateOpenSourcePopoverPosition = () => {
  if (isSourcePopoverOpen.value) updateSourcePopoverPosition();
};

const scheduleOpenSourcePopoverPosition = () => {
  if (!isSourcePopoverOpen.value || sourcePopoverFrame) return;

  sourcePopoverFrame = window.requestAnimationFrame(() => {
    sourcePopoverFrame = 0;
    updateSourcePopoverPosition();
  });
};

const toggleSourcePopover = async () => {
  isSourcePopoverOpen.value = !isSourcePopoverOpen.value;

  if (isSourcePopoverOpen.value) {
    await nextTick();
    updateSourcePopoverPosition();
  }
};

const defaultToAvailableRoutineTime = () => {
  if (routineTime.value === 'am' && amSteps.value.length === 0 && pmSteps.value.length > 0) {
    store.setRoutineTime('pm');
  } else if (routineTime.value === 'pm' && pmSteps.value.length === 0 && amSteps.value.length > 0) {
    store.setRoutineTime('am');
  }
};

const resetRoutineTime = () => {
  if (!currentRoutine.value) {
    expandedSteps.value = new Set();
    isSourcePopoverOpen.value = false;
    scrollStepsToTop();
    return;
  }

  store.setRoutineTime('am');
  defaultToAvailableRoutineTime();
  isSourcePopoverOpen.value = false;
  scrollStepsToTop();
};

watch(currentRoutineId, resetRoutineTime, { immediate: true });
watch(isSourcePopoverOpen, async (isOpen) => {
  if (!isOpen) return;
  await nextTick();
  updateSourcePopoverPosition();
});
watch(steps, resetExpandedSteps, { immediate: true });
watch(routineTime, scrollStepsToTop);

onMounted(() => {
  window.addEventListener("resize", updateOpenSourcePopoverPosition);
  window.addEventListener("scroll", scheduleOpenSourcePopoverPosition, true);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateOpenSourcePopoverPosition);
  window.removeEventListener("scroll", scheduleOpenSourcePopoverPosition, true);

  if (sourcePopoverFrame) {
    window.cancelAnimationFrame(sourcePopoverFrame);
  }
});
</script>

<style lang="scss" scoped>
aside {
  border-left: var(--color-dark) solid 1px;
  padding: 0 var(--space-xl);
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
}

.scroll-container {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.routine-alert,
.routine-empty-state {
  padding: var(--space-lg);
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: rgba(200, 82, 56, 0.08);
  color: var(--color-dark);
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-sm);
  line-height: var(--lineHeight-sm);
}

.routine-empty-state {
  margin: var(--space-xl) 0;
}

.routine-empty-state p {
  margin: 0;
}

.sidebar-header {
  flex: none;
  position: relative;
  z-index: 3;
}

.routine-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
  min-width: 0;

  .routine-title {
    font-size: var(--fontSize-3xl);
    line-height: var(--lineHeight-3xl);
    letter-spacing: var(--letterSpacing-3xl);
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }
}

.sources {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  line-height: var(--lineHeight-xs);
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 1.75rem;
  padding: 0 var(--space-md);
  border: 1px solid var(--color-dark);
  border-radius: 999px;
  background: var(--color-light);
  color: var(--color-dark);
  font-family: var(--font-family-sans-serif);
  font-size: var(--fontSize-xs);
  line-height: var(--lineHeight-xs);
  text-decoration: none;
  white-space: nowrap;

  img {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }
}

.source-count {
  padding-left: var(--space-sm);
  border-left: 1px solid currentColor;
}

.source-favicon-fallback,
.source-site-favicon-fallback {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  color: var(--color-primary);
  font-size: var(--fontSize-xs);
  line-height: 1;
}

.source-overflow {
  position: relative;
}

.source-popover {
  position: fixed;
  left: 1rem;
  top: 1rem;
  display: none;
  width: min(24rem, calc(100vw - 2rem));
  overflow: hidden;
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  background: var(--color-light);
  color: var(--color-dark);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.source-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4.75rem;
  gap: var(--space-md);
  padding: var(--space-md);
  color: var(--color-dark);
  text-decoration: none;

  &:hover {
    background: rgba(200, 82, 56, 0.08);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(52, 58, 64, 0.18);
  }
}

.source-image {
  grid-column: 2;
  grid-row: 1;
  width: 4.75rem;
  height: 4.75rem;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.source-image-fallback {
  display: grid;
  place-items: center;
  border: 1px solid rgba(52, 58, 64, 0.18);
  background: rgba(200, 82, 56, 0.08);
  color: var(--color-primary);
  font-size: var(--fontSize-2xl);
}

.source-card-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 0;
  grid-column: 1;
  grid-row: 1;
}

.source-site {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-dark);
  opacity: 0.75;

  img {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
  }

  .source-site-favicon-fallback {
    width: 0.875rem;
    height: 0.875rem;
    font-size: 0.625rem;
  }
}

.source-date {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);

  &::before {
    content: "";
    display: block;
    width: 0.1875rem;
    height: 0.1875rem;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.7;
  }
}

.source-headline {
  font-weight: 500;
  line-height: var(--lineHeight-sm);
}

.source-summary {
  display: -webkit-box;
  overflow: hidden;
  line-height: var(--lineHeight-xs);
  color: var(--color-dark);
  opacity: 0.82;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.source-overflow:hover .source-popover,
.source-overflow:focus-within .source-popover,
.source-overflow.open .source-popover {
  display: block;
}

.step {
  min-width: 0;
  overflow-wrap: anywhere;

  .step-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-md);
    font-weight: 500;
    letter-spacing: var(--letterSpacing-2xl);
    margin-top: var(--space-md);
    margin-bottom: var(--space-sm);


    .step-order {
      font-size: var(--fontSize-2xl);
      line-height: var(--lineHeight-2xl);
    }

    .step-title {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      font-size: var(--fontSize-xl);
      line-height: var(--lineHeight-xl);
      min-width: 0;

      &::after {
        content: "";
        flex: 1;
        min-width: var(--space-xl);
        border-bottom: 0.5px solid var(--color-dark);
      }
    }

    .hand {
      grid-column: 3;
      justify-self: end;
    }
  }
}

a {
  color: var(--color-primary);
  overflow-wrap: anywhere;
}

button {
  background-color: transparent;
  border-radius: var(--space-sm);
  border: 1px solid black;
  cursor: pointer;

  &:hover {
    background-color: rgba(241, 101, 68, 0.05);
  }
}

.hand {
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  display: inline-block;
  cursor: pointer;
  padding: 0;
  line-height: 0;
  transition: transform .1s linear;
  font-size: var(--fontSize-xl);

  &.expanded {
    transform: rotate(90deg);
  }
}

.step:not(:last-child) {
  // border-bottom: 0.5px solid var(--color-dark);
  padding-bottom: var(--space-md);
}

.toggleContainer {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: fit-content;
  border: 1px solid var(--color-dark);
  border-radius: var(--radius-sm);
  font-weight: 500;
  color: var(--color-dark);
  cursor: pointer;
  width: 99%;
  margin-bottom: var(--space-xl);
  box-shadow: 1px 3px 0px var(--color-dark);
}

.toggleContainer::before {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0%;
  border-radius: 0;
  background: var(--color-dark);
  transition: all 0.3s;
}

input:checked+.toggleContainer::before {
  left: 50%;
}

.toggleContainer div {
  padding: var(--space-md);
  text-align: center;
  z-index: 1;
}

input {
  display: none;
}

input:checked+.toggleContainer div:first-child {
  color: var(--color-dark);
  transition: color 0.3s;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

input:checked+.toggleContainer div:last-child {
  color: var(--color-light);
  transition: color 0.3s;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

input+.toggleContainer div:first-child {
  color: var(--color-light);
  transition: color 0.3s;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

input+.toggleContainer div:last-child {
  color: var(--color-dark);
  transition: color 0.3s;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

@media (max-width: 768px) {
  aside {
    border-left: 0;
    border-top: 1px solid var(--color-dark);
    padding: 0 var(--space-lg) var(--space-xl);
    min-height: auto;
    overflow: visible;
  }

  .scroll-container {
    overflow: visible;
  }

  .routine-header {
    align-items: flex-start;
  }

  .source-popover {
    max-width: calc(100vw - (var(--space-lg) * 2));
    max-height: min(65dvh, 28rem);
    overflow: auto;
  }

  .source-overflow:hover .source-popover,
  .source-overflow:focus-within .source-popover {
    display: none;
  }

  .source-overflow.open .source-popover {
    display: block;
  }
}
</style>
