<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { computed, ref, toRefs } from 'vue'
import { useCurrentUser } from '@/entities/session'

const props = withDefaults(defineProps<{
  mini?: boolean
}>(), {
  mini: false,
})

const { mini } = toRefs(props)
const visible = ref(false)
const { currentUser, fullName, userInitials } = useCurrentUser()
const { width: widthWindow } = useWindowSize()

// Вычисляем отображаемое имя пользователя
const displayName = computed(() => {
  if (fullName.value) {
    return fullName.value
  }
  return 'Пользователь'
})

// Логин пользователя
const userDesc = computed(() => currentUser.value?.fullName || currentUser.value?.login || '')
</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" position="right">
      <template #header>
        <div class="flex items-center gap-3">
          <Avatar
            :label="currentUser?.avatar ? '' : userInitials"
            :image="currentUser?.avatar"
            class="shrink-0" :class="[$style['user-avatar']]"
            style="background-color: rgba(0, 0, 0, 0.2); color: black"
            shape="circle"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ displayName }}
            </p>
            <p v-if="userDesc" class="text-xs truncate">
              {{ userDesc }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center gap-2">
          <Button
            label="Выйти"
            icon="pi pi-sign-out"
            class="w-full"
            rounded
          />
        </div>
      </template>
    </Drawer>

    <div
      class="flex items-center gap-2 cursor-pointer" :class="[$style['user-menu-trigger']]"
      @click="visible = true"
    >
      <Avatar
        :label="currentUser?.avatar ? '' : userInitials"
        :image="currentUser?.avatar"
        class="shrink-0" :class="[$style['user-avatar']]"
        style="background-color: rgba(0, 0, 0, 0.2); color: black"
        shape="circle"
      />
      <div v-if="widthWindow >= 1024 && !mini" class="flex-1 min-w-0" :class="[$style['user-avatar__info']]">
        <p :class="$style['user-avatar__title']" class="font-medium truncate">
          {{ displayName }}
        </p>
        <p v-if="userDesc" :class="$style['user-avatar__desc']" class="truncate">
          {{ userDesc }}
        </p>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.user-menu-trigger {
  --user-avatar__color: white;
}

.user-avatar {
  width: pxToRem(42px) !important;
  height: pxToRem(42px) !important;

  &__info {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: pxToRem(150px);
  }
  &__title {
    font-size: pxToRem(16px);
    line-height: 1;
    color: var(--user-avatar__color);
  }
  &__desc {
    font-size: pxToRem(14px);
    color: color-mix(in srgb, var(--user-avatar__color), black 10%);
  }
}
</style>
