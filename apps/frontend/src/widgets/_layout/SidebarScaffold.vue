<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import Button from 'primevue/button'
import { ref, useCssModule } from 'vue'
import { UserMenuSettings } from '@/features/user-menu-settings'
import { Scaffold } from '@/shared/ui'

import {
  menuItems,
  SideNavigationBar,
  SideNavigationBarItem,
  SideNavigationBarItemMobile,
  SideNavigationBarMobile,
} from '../sidebar'

const railSidebar = ref(false)
const { width } = useWindowSize()
const styles = useCssModule()

// Функции управления меню
function toggleMenu() {
  railSidebar.value = !railSidebar.value
}
</script>

<template>
  <Scaffold>
    <template #side>
      <SideNavigationBar
        v-if="width >= 768"
        :rail="railSidebar"
      >
        <SideNavigationBarItem
          v-for="(item, index) in menuItems"
          :key="index"
          :mini="!railSidebar"
          :data-route="item"
        />

        <template #bottom>
          <Button
            :icon="`pi pi-angle-double-${railSidebar ? 'left' : 'right'}`"
            :class="[styles['button-rail'], { [styles['button-rail--mini']]: !railSidebar }]"
            severity="contrast"
            variant="text"
            rounded
            :aria-label="railSidebar ? 'Свернуть сайдбар' : 'Развернуть сайдбар'"
            :title="railSidebar ? 'Свернуть' : 'Развернуть'"
            :label="railSidebar ? 'Свернуть' : ''"
            @click="toggleMenu"
          />

          <UserMenuSettings
            :mini="!railSidebar"
          />
        </template>
      </SideNavigationBar>

      <SideNavigationBarMobile
        v-else
      >
        <SideNavigationBarItemMobile
          v-for="(item, index) in menuItems"
          :key="index"
          :data-route="item"
        />
      </SideNavigationBarMobile>
    </template>

    <router-view />
  </Scaffold>
</template>

<style module lang="scss">
.logotype {
  height: pxToRem(40px);
  width: auto;
  margin-bottom: 1.5rem;
}

.button-rail {
  width: 100% !important;
  margin-bottom: pxToRem(8px);

  &--mini {
    width: pxToRem(40px) !important;
    height: pxToRem(40px) !important;
  }
}
</style>
