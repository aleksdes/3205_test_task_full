<script setup lang="ts">
import type { HeaderPageProps, HeaderPageSlots } from './base-header-page'
import { useWindowSize } from '@vueuse/core'
import { toRefs, useCssModule } from 'vue'
import { UserMenuSettings } from '@/features/user-menu-settings'
import { HeaderPage } from '@/shared/ui'
import { LogotypeGray } from '@/shared/ui/theme/icons'

defineOptions({
  name: 'HeaderPage',
})

const props = withDefaults(defineProps<HeaderPageProps>(), {
  sticky: true,
  loading: false,
  showUserMenu: true,
})

defineSlots<HeaderPageSlots>()

const {
  sticky,
  showUserMenu,
} = toRefs(props)
const { width: widthWindow } = useWindowSize()
const styles = useCssModule()
</script>

<template>
  <HeaderPage
    title=""
    class="header"
    :sticky="sticky"
  >
    <template #title>
      <slot
        v-if="widthWindow > 768"
        name="title"
      >
        <h1
          class="text-3xl font-base font-medium"
        >
          {{ props.title }}
        </h1>
      </slot>

      <div
        v-else
        class="flex items-center"
      >
        <LogotypeGray :class="styles.logotype" />
      </div>
    </template>
    <template #append>
      <slot
        name="append"
      />

      <UserMenuSettings
        v-if="showUserMenu"
      />
    </template>
  </HeaderPage>
</template>

<style module lang="scss">
.logotype {
  height: pxToRem(40px);
  width: auto;
  min-height: pxToRem(40px);
  min-width: pxToRem(40px);
}
</style>
