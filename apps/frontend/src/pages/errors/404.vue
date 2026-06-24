<script setup lang="ts">
import Button from 'primevue/button'
import { HomeRoute } from '@/app/router-setup/routes/user-scope-routes'
</script>

<template>
  <div>
    <p>
      404
    </p>
    <h3>
      Страница не найдена
    </h3>

    <router-link :to="HomeRoute.raw">
      <Button>
        На главную
      </Button>
    </router-link>
  </div>
</template>

<style module lang="scss">
</style>
