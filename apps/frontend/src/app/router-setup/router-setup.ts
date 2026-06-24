import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './router-guards'
import routes from './routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export function useRouterSetup(app: App) {
  setupGuards(router)
  app.use(router)
}
