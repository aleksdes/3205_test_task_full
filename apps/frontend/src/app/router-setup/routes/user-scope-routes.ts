import type { RouteRecordRaw } from 'vue-router'
import { routeCompositionFactory } from '@/shared/lib/route-composition-factory'
import { RouteAccessibility } from '../types.d'

export const HomeRoute = routeCompositionFactory({
  path: '/',
  name: 'home',
  component: () => import('@/pages/user/home/HomePage.vue'),
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
