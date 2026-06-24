import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { HomeRoute, SettingsRoute } from '@/app/router-setup/routes/user-scope-routes'

export interface ISideBarItemRoute {
  id: string
  label: string
  route: RouteRecordRaw
  icon: string | Component
}

export const menuItems: ISideBarItemRoute[] = [
  {
    id: 'home',
    label: 'Домашняя',
    route: HomeRoute.raw,
    icon: 'pi pi-home',
  },
  {
    id: 'other',
    label: 'Настройки',
    route: SettingsRoute.raw,
    icon: 'pi pi-cog',
  },
]
