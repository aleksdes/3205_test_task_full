import type { ComputedRef, SlotsType } from 'vue'
import type { ISideBarItemRoute } from '@/components/sidebar'

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
  /**
   * Флаг указывающий на ширину панели
   * {true} указывает на минимизированный вид панели
   * {false} указывает на расширенный вид панели
   */
  rail: boolean
}

export declare interface SideNavigationBarSlots extends SlotsType {
  ['rail-button']: () => any
  default: (args: SideNavigationBarState) => any

  /**
   * Нижний слот панели
   */
  bottom: (args: SideNavigationBarState) => any

  /**
   * Слот в заголовке панели
   */
  leading: (args: SideNavigationBarState) => any
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
