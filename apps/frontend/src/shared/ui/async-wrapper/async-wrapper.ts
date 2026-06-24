export interface AsyncWrapperProps {
  isLoading: boolean;
  isUpdating?: boolean;
  loadingLabel?: string;
  error?: Record<string, any> | boolean | string | null;
  noData?: boolean;
  /**
   * Управляет свойством position для отображения ошибки
   */
  isErrorFixed?: boolean;
  /**
   * Управляет свойством position для отображения loading
   */
  isLoadingFixed?: boolean;
  /**
   * Управляет свойством position для отображения updating
   */
  isUpdatingFixed?: boolean;
  /**
   * Выключение анимации появления оверлея обновления контента
   */
  disableUpdatingAnimation?: boolean;
  disableShowErrorPopup?: boolean;
  spinnerColor?: string;
}

export interface AsyncWrapperSlots {
  loading: () => any;
  default: () => any;
  error: () => any;
  noData: () => any;
}

export interface AsyncWrapperEmits {
  (e: 'closeError'): void;
}
