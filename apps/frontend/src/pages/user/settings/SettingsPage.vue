<script setup lang="ts">
import { useCssModule } from 'vue'

const styles = useCssModule()
</script>

<template>
  <div :class="styles['settings-page']">
    <div :class="styles['wrapper-card']">
      Settings Page
    </div>
  </div>
</template>

<style module lang="scss">
.settings-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.wrapper-card {
  --card--padding: #{pxToRem(17px)} #{pxToRem(24px)};
  --card--padding-sm: #{pxToRem(18px)} #{pxToRem(18px)};

  padding: var(--card--padding-sm);
  width: 100%;
  flex: 1;
  min-height: 0;

  @media (min-width: 768px) {
    padding: var(--card--padding);
  }

  &__empty-state {
    background: var(--p-zinc-100);
    border-radius: var(--radius-2xl);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}

.content-container {
  display: grid;
  grid-template-columns: 49% 49%;
  align-self: center;
  justify-content: space-between;
  height: calc(100dvh - 40px);
}
</style>
