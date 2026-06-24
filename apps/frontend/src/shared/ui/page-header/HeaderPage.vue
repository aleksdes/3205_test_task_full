<script setup lang="ts">
import type { HeaderPageProps, HeaderPageSlots } from './page-header'
import { useCssModule } from 'vue'

defineOptions({
  name: 'HeaderPage',
})

const props = withDefaults(defineProps<HeaderPageProps>(), {
  sticky: false,
})

defineSlots<HeaderPageSlots>()

const styles = useCssModule()
</script>

<template>
  <div
    id="headerPage"
    :class="[styles['header-page'], { [styles['header-page--sticky']]: sticky }]"
  >
    <div :class="styles['header-page__container']">
      <div :class="styles['header-page__box-title']">
        <h1 v-if="props.title">
          {{ props.title }}
        </h1>

        <slot name="title" />
      </div>

      <div v-if="!!$slots.center">
        <slot name="center" />
      </div>

      <slot name="append" />
    </div>

    <div v-if="$slots['append-outer']" :class="styles['header-page__append']">
      <slot name="append-outer" />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'sass:color';

.header-page {
  --header-page--background: white;
  --header-page--padding: #{pxToRem(17px)} #{pxToRem(24px)};
  --header-page--padding-sm: #{pxToRem(14px)} #{pxToRem(18px)};
  --header-page--margin: #{pxToRem(12px)};
  --header-page--top: #{pxToRem(12px)};
  --header-page__container--min-height: #{pxToRem(56px)};

  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    height: 24px;
    background: linear-gradient(
      to bottom,
      oklch(from var(--p-zinc-100) l c h / 1),
      oklch(from var(--p-zinc-100) l c h / 0.6)
    );
    z-index: -1;
    pointer-events: none;
  }

  h1 {
    margin: 0;
  }

  &--sticky {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;

    @media (min-width: 768px) {
      top: var(--header-page--top, 0);
    }
  }

  &__container {
    min-height: var(--header-page__container--min-height);
    height: min-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background-color: var(--header-page--background);
    padding: var(--header-page--padding-sm);
    box-shadow: 0 3px 20px 3px rgba(18, 18, 23, 0.05);

    @media (min-width: 768px) {
      margin: var(--header-page--margin) 0 var(--header-page--margin) 0;
      border-radius: var(--radius-3xl);
      padding: var(--header-page--padding);
      box-shadow: 0 3px 20px 3px rgba(18, 18, 23, 0.05);
    }
  }

  &__box-title {
    display: flex;
    flex-direction: row;
    align-items: center;

    h1 {
      color: #121212;
    }
  }
}
</style>
