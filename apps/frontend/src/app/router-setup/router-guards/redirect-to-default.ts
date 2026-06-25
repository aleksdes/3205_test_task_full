import type { NavigationGuard } from 'vue-router'
import { HomeRoute } from '../routes/user-scope-routes'

export const redirectToDefaultRoute: NavigationGuard = (to, from, next) => {
  const isRedirected = to.redirectedFrom
  const isRoot =
    to.path === '/' &&
    (from.path === '/' || from.path === '/auth/login' || from.path.includes('/auth'))

  if (isRedirected) return next()
  if (isRoot) return next(HomeRoute.raw) // дефолтный маршрут
  next()
}
