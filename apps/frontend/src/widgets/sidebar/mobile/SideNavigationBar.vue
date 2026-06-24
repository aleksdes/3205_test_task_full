<script setup lang="ts">
import type {
  SideNavigationBarEmits,
  SideNavigationBarProps,
  SideNavigationBarSlots,
} from './side-navigation-bar'
import { useCssModule, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'SideNavigationBar',
})

withDefaults(defineProps<SideNavigationBarProps>(), {})

defineEmits<SideNavigationBarEmits>()
defineSlots<SideNavigationBarSlots>()

const styles = useCssModule()
const sideNavigationBarMenuRef = useTemplateRef('sideNavigationBarMenuRef')

const route = useRoute()

function scrollToElementByIdMenu(idElement: string) {
  const menuElement = sideNavigationBarMenuRef.value
  if (!menuElement)
    return

  const targetElement = document.getElementById(idElement)
  if (!targetElement)
    return

  // Получаем позицию целевого элемента относительно контейнера
  const containerRect = menuElement.getBoundingClientRect()
  const targetRect = targetElement.getBoundingClientRect()

  // Вычисляем смещение для прокрутки
  const scrollLeft = targetRect.left - containerRect.left + menuElement.scrollLeft - (containerRect.width / 2) + (targetRect.width / 2)

  menuElement.scrollTo({
    left: scrollLeft,
    behavior: 'smooth',
  })
}

watch(route, () => {
  if (route.path) {
    setTimeout(() => {
      scrollToElementByIdMenu(route.path as string)
    }, 100)
  }
}, { immediate: true })
</script>

<template>
  <aside id="sideNavigationBar" :class="styles['side-navigation-bar']">
    <div id="sideNavigationBarHeader" />

    <slot name="prepend" />

    <div ref="sideNavigationBarMenuRef" :class="styles['side-navigation-bar__menu']">
      <slot />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
/* Скрываем скроллбар для меню */
::-webkit-scrollbar {
  width: 4px;
  height: 2px;
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

/* Стили для Divider на тёмном фоне */
:deep(.p-divider) {
  border-color: #4b5563;
  --p-divider-border-color: rgba(255, 255, 255, 0.2);
}
</style>

<style module lang="scss">
.side-navigation-bar {
  --side-navigation-bar__height: 80px;
  --side-navigation-bar__bg-color: var(--p-e);
  --side-navigation-bar__padding: 8px 12px;
  --side-navigation-bar__border: 16px 16px 0 0;

  box-sizing: border-box;
  position: sticky;
  bottom: 0;
  height: min-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: var(--side-navigation-bar__height);
  padding: var(--side-navigation-bar__padding);
  background-color: var(--side-navigation-bar__bg-color);
  z-index: 10;
  border-radius: var(--side-navigation-bar__border);
  box-shadow: 0 -3px 20px 3px rgba(18, 18, 23, 0.05);

  @include acceleratedTransition(('width'));

  &__menu {
    display: flex;
    flex: 1;
    flex-direction: row;
    height: 100%;
    overflow: auto;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 6px;
  }
}
</style>
