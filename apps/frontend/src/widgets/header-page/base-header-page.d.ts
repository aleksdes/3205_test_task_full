import type { SlotsType } from 'vue'

export declare interface HeaderPageProps {
  /**
   * Название заголовка страницы
   */
  title?: string
  /**
   * Фиксация хедера вверху страницы
   * По дефолту false
   */
  sticky?: boolean
  loading?: boolean
  showUserMenu?: boolean
  showSupport?: boolean
  showSelectorRestaurant?: boolean
}

export declare interface HeaderPageSlots extends SlotsType {
  /**
   * Слот для заголовка или дополнительноый контент к заголовку
   */
  title: () => any
  /**
   * Слот для центральной части заголовка
   */
  center: () => any
  /**
   * Слот для правой части заголовка, где располагается селект выбора ресторана
   */
  append: () => any
  /**
   * Слот для контента под хедером, где фильтры по датам
   */
  ['append-outer']: () => any
}
