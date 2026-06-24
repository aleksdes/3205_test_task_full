import { routeCompositionFactory } from '@/shared/lib/route-composition-factory'

export const _404 = routeCompositionFactory({
  path: '/:pathMatch(.*)*',
  name: 'error',
  component: () => import('@/pages/errors/404.vue'),
})
