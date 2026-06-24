<script setup lang="ts">
import type { ScaffoldSlots } from './scaffold'
import { useCssModule } from 'vue'

defineOptions({
  name: 'Scaffold',
})
defineSlots<ScaffoldSlots>()

const styles = useCssModule()
</script>

<template>
  <div
    class="w-full overflow-hidden" :class="[
      styles.scaffold,
      { [styles['scaffold--with-sidebar']]: $slots.side },
    ]"
  >
    <main class="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-auto" :class="[styles['scaffold__body-main']]">
      <slot />
    </main>

    <slot name="side" />
  </div>
</template>

<style module lang="scss">
.scaffold {
  position: relative;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: white;

  @media (min-width: 768px) {
    flex-direction: row-reverse;
  }

  &__side {
    box-sizing: border-box;
  }

  &__body-main {
    width: 100%;
  }
}
</style>
