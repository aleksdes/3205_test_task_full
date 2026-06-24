import type { SlotsType } from 'vue'

export declare interface ScaffoldSlots extends SlotsType {
  /**
   * Слот для левой навигационной панели
   */
  side: () => any;

  /**
   * Слот для основного контента
   */
  default: () => any;
}
