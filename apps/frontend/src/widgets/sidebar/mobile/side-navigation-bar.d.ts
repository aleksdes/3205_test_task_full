import type { ComputedRef, SlotsType } from 'vue'
import type { ISideBarItemRoute } from '../model'

/**
 * Передаваемые свойства в слоты панели, доступны в slot-scope
 */
export declare interface SideNavigationBarState {
  [key: string]: any
}

/**
 * Список свойств для панели навигации <SideNavigationBar />
 */
export declare interface SideNavigationBarProps {
  [key: string]: any
}

export declare interface SideNavigationBarSlots extends SlotsType {
  default: (args: SideNavigationBarState) => any
  prepend: () => any
}

export declare interface SideNavigationBarEmits {
  [key: string]: any
}

/**
 * Список свойств для элемента навигации <SideNavigationBarItem />
 */
export declare interface SideNavigationBarItemProps {
  /**
   * Описание маршрута vue-router
   */
  dataRoute: ISideBarItemRoute
  mini?: boolean
  isActive?: boolean
  isExactActive?: boolean
}

/**
 * Передаваемые свойства в слоты, доступны в slot-scope
 */
export declare interface SideNavigationBarItemState {
  isActive: ComputedRef<boolean>
  isExactActive: ComputedRef<boolean>
  mini?: boolean
  dataRoute?: ISideBarItemRoute
}

/**
 * Список слотов для элемента навигации <SideNavigationBarItem />
 */
export declare interface SideNavigationBarItemSlots extends SlotsType {
  icon: (args: SideNavigationBarItemState) => any
  default: (args: SideNavigationBarItemState) => any
}
