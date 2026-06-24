import type { Router } from 'vue-router'
import { redirectToDefaultRoute } from './redirect-to-default'

export function setupGuards(router: Router) {
  router.beforeEach(redirectToDefaultRoute)
}
