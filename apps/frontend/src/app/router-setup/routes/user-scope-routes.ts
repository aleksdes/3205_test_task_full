import type { RouteRecordRaw } from 'vue-router'
import { z } from 'zod'
import { routeCompositionFactory } from '@/shared/lib/route-composition-factory'
import { RouteAccessibility } from '../types.d'

export const HomeRoute = routeCompositionFactory({
  path: '/',
  name: 'home',
  component: () => import('@/pages/user/home/HomePage.vue'),
}, {
  query: {
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  },
})

export const SettingsRoute = routeCompositionFactory({
  path: 'settings',
  name: 'settings',
  component: () => import('@/pages/user/settings/SettingsPage.vue'),
})

export const userGroupRoutes: RouteRecordRaw = {
  path: '/',
  children: [
    HomeRoute.raw,
    SettingsRoute.raw,
  ],
  meta: {
    policy: {
      routeAccessibility: RouteAccessibility.public,
    },
  },
}
