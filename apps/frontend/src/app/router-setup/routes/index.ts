import type { RouteRecordRaw } from 'vue-router'
import { routeCompositionFactory } from '@/shared/lib/route-composition-factory'
import { _404 } from './error'
import { userGroupRoutes } from './user-scope-routes'

/**
 * Группа маршрутов где в макете есть сайдбар
 */
const withSidebarLayout = routeCompositionFactory({
  path: '',
  component: () => import('@/widgets/_layout/SidebarScaffold.vue'),
  children: [
    userGroupRoutes,
  ],
})

/**
 * Группа роутов с макетом без сайдбара
 */
const withBaseLayout = routeCompositionFactory({
  path: '',
  component: () => import('@/widgets/_layout/BaseScaffold.vue'),
  children: [
    _404.raw,
  ],
})

const _routes: RouteRecordRaw[] = [
  withSidebarLayout.raw,
  withBaseLayout.raw,
]
export default _routes
