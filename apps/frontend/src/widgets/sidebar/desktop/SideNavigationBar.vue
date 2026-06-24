<script setup lang="ts">
import type {
  SideNavigationBarEmits,
  SideNavigationBarProps,
  SideNavigationBarSlots,
} from './side-navigation-bar'
import { toRefs, useCssModule } from 'vue'

defineOptions({
  name: 'SideNavigationBar',
})

const props = withDefaults(defineProps<SideNavigationBarProps>(), {
  rail: true,
})

defineEmits<SideNavigationBarEmits>()
defineSlots<SideNavigationBarSlots>()

const { rail } = toRefs(props)
const styles = useCssModule()
</script>

<template>
  <aside
    id="sideNavigationBar"
    class="h-screen flex flex-col overflow-hidden shrink-0" :class="[
      styles['side-navigation-bar'],
      rail ? 'min-w-[230px]' : 'w-auto',
    ]"
  >
    <div :class="styles['side-navigation-bar__container']">
      <slot name="rail-button" />

      <div :class="styles['side-navigation-bar__leading']">
        <slot name="leading" />
      </div>

      <div :class="styles['side-navigation-bar__menu']">
        <slot />
      </div>

      <div :class="styles['side-navigation-bar__bottom']">
        <slot name="bottom" />
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
/* Скрываем скроллбар для меню */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

<style module lang="scss">
.side-navigation-bar {
  --side-bar__background-color: #aa8800;

  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  width: min-content;

  @include acceleratedTransition(('width'), 800);

  &__container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--side-bar__background-color);
    padding: pxToRem(8px);
    box-shadow: 0 0 2px 0 rgba(18, 18, 23, 0.05);
  }

  &__leading {
    overflow: hidden;
  }

  &__menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    gap: pxToRem(4px);
  }
}
</style>
