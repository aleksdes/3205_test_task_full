<script setup lang="ts">
import type {
  SideNavigationBarItemProps,
  SideNavigationBarItemSlots,
  SideNavigationBarItemState,
} from './side-navigation-bar'
import { computed, toRefs, useCssModule } from 'vue'
import { useLink, useRoute } from 'vue-router'

const props = withDefaults(defineProps<SideNavigationBarItemProps>(), {
  isExactActive: false,
  isActive: false,
  mini: false,
})
defineSlots<SideNavigationBarItemSlots>()

const { dataRoute, mini, isActive: isActiveProps, isExactActive: isExactActiveProps } = toRefs(props)
const route = useRoute()

const {
  href,
  isActive: routeIsActive,
  isExactActive: routeIsExactActive,
  navigate,
} = useLink({
  to: dataRoute.value.route,
})

const isRoot = computed(() => dataRoute.value.route.path === '/')

const isParentActive = computed(() => {
  if (isRoot.value)
    return false

  const targetPath = dataRoute.value.route.path
  const targetName = dataRoute.value.route.name?.toString()

  return route.path.startsWith(targetPath) ||
    (route.name && route.name?.toString().startsWith(targetName)) ||
    route.path.includes(targetPath)
})

const isActive = computed(() => {
  if (isRoot.value)
    return isActiveProps.value || routeIsExactActive.value
  return isActiveProps.value || routeIsActive.value
})
const isExactActive = computed(() => isExactActiveProps.value || routeIsExactActive.value)

const styles = useCssModule()

const sharedState: SideNavigationBarItemState = {
  isActive,
  isExactActive,
  mini: mini.value,
  dataRoute: dataRoute.value,
}
</script>

<template>
  <a
    class="rounded-full p-3 py-2 h-10 transition-colors" :class="[
      styles['side-navigation-bar-item'],
      { [styles['side-navigation-bar-item--active']]: isActive || isExactActive || isParentActive },
    ]"
    :href="href"
    @click="navigate"
  >
    <div
      :title="dataRoute.label"
      class="flex items-center group"
    >
      <span
        v-if="!!$slots.icon"
        :class="styles['side-navigation-bar-item__icon']"
      >
        <slot name="icon" v-bind="sharedState" />
      </span>

      <i
        v-else-if="dataRoute.icon && typeof dataRoute.icon === 'string'"
        class="text-base shrink-0"
        :class="[styles['side-navigation-bar-item__icon'], dataRoute.icon]"
      />

      <component
        :is="dataRoute.icon"
        v-else
        :key="dataRoute.icon"
        class="shrink-0" :class="[styles['side-navigation-bar-item__icon']]"
      />

      <span v-if="!mini" class="ml-3 font-medium text-base truncate font-roboto">
        <slot v-bind="sharedState">
          {{ dataRoute.label }}
        </slot>
      </span>
    </div>
  </a>
</template>

<style module lang="scss">
.side-navigation-bar-item {
  --icon-size: 18px;
  --side-navigation-bar-item__bg-color: transparent;
  --side-navigation-bar-item__bg-active-color: color-mix(in srgb, var(--p-blue-500) 20%, transparent);
  --side-navigation-bar-item__color: var(--p-slate-700);
  --side-navigation-bar-item__active-color: var(--color-white);

  background-color: var(--side-navigation-bar-item__bg-color);
  color: var(--side-navigation-bar-item__color);
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;

  @include combinedTransition((('transform'), 300ms, $bounceCurve), (('background-color'), 300ms, $baseCurve));

  &__icon {
    height: var(--icon-size);
    width: var(--icon-size);
    flex-shrink: 0;
  }

  &--active {
    --side-navigation-bar-item__bg-color: var(--side-navigation-bar-item__bg-active-color);
    --side-navigation-bar-item__color: var(--side-navigation-bar-item__active-color);
  }

  &:hover:not(&--active) {
    --side-navigation-bar-item__bg-color: color-mix(in srgb, var(--p-blue-500) 10%, transparent);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
