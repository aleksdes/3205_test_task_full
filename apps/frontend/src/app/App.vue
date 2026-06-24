<script setup>
import { ConfirmDialog, DynamicDialog, Toast } from 'primevue'
import { ref } from 'vue'
import { baseInit } from '@/app/base-init'
import { useCurrentUser } from '@/entities/session'
import { createContextualErrorCode, LogContext, Logger } from '@/shared/lib/logger'
import SplashScreen from './SplashScreen.vue'

const { setUser } = useCurrentUser()

const appReady = ref(false)
const logger = Logger.create(createContextualErrorCode(LogContext.APP))

async function start() {
  try {
    await baseInit(
      setUser({
        firstName: 'Алексей',
        lastName: 'Валерьевич',
        middleName: 'Киселев',
        login: 'a.kiselev',
        jobTitle: 'Frontend Developer',
        avatar: '/images/mock-images/my-avatar.jpg',
      }),
    )
  }
  catch (e) {
    logger.error(e)
  }
  finally {
    appReady.value = true
  }
}
start()
</script>

<template>
  <SplashScreen v-if="!appReady" />
  <router-view v-else />

  <Toast />
  <DynamicDialog />
  <ConfirmDialog />
</template>

<style lang="scss" scoped>
</style>
