import type { RouteParamsSchemaBuilder } from '@/shared/lib/route-composition-factory'
import 'vue-router'

export enum RouteAccessibility {
  privateOnly,
  publicOnly,
  private,
  public,
}

export interface NavigationPolicy {
  /**
   * Указывает на доступность роута
   */
  routeAccessibility?: RouteAccessibility
  allow?: () => boolean
}

declare module 'vue-router' {
  interface RouteMeta {
    arguments?: RouteParamsSchemaBuilder
    policy?: NavigationPolicy
  }
}
