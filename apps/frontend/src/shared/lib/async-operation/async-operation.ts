import type { ComputedRef, MaybeRef, Ref, WritableComputedRef } from 'vue'
import { get, useDebounceFn } from '@vueuse/core'
import { AxiosError } from 'axios'
import { computed, ref, watch } from 'vue'

export interface UseAsyncOperationOptions<ARGS extends any[]> {
  /**
   * Если {true} вызывает метод немедленно
   */
  immediateCall?: boolean
  /**
   * Параметры для вызова асинхронного метода
   */
  immediateCallInitialParams?: ARGS
  /**
   * Устанавливает debounce интервал, вызова асинхронного метода
   */
  debounce?: number
  /**
   * Отслеживаемые зависимости, изменение одной из зависимости
   * запустит асинхронную операцию
   */
  dependencies?: Array<Ref | ComputedRef | WritableComputedRef<any>>
  /**
   * По умолчанию композиция заглушает исклочение не позволяя ему подниматься
   * Это свойство заставляет композицию выбросить оригинальное исключение
   */
  rethrowExceptions?: boolean
}

export interface UseAsyncOperationReturn<T, ARGS extends any[]> {
  call: (...args: ARGS) => Promise<T | void>
  loading: ComputedRef<boolean>
  updating: ComputedRef<boolean>
  error: ComputedRef<any | null>
  errorMessage: ComputedRef<string | null>

  /**
   * Сброс хранилища
   */
  $reset: () => void
}

function parseAxiosError(error: AxiosError<{ detail?: string } | undefined>) {
  if (error.code === 'ERR_NETWORK') {
    return 'Ошибка сети'
  }

  if (error.response?.data?.detail) {
    return error.response.data.detail
  }

  if ((error.response?.data as any)?.message) {
    return (error.response as any).data.message
  }

  switch (Number(error.response?.status)) {
    case 401:
      return 'Требуется авторизация'
    case 403:
      return 'Доступ запрещен'
    case 404:
      return 'Ресурс не найден'
    case 422:
      return `Некорректные данные ${error.message}`
    case 500:
      return 'Внутренняя ошибка сервера'
    case 405:
    case 406:
    case 407: {
      return 'Доступ запрещен'
    }
    case 501:
    case 502: {
      return 'Ошибка сервера'
    }
    case 503:
    case 504: {
      return 'Сервис недоступен'
    }

    default: {
      return `Неизвестная ошибка (${error.message})`
    }
  }
}

function exportErrorMessage(error: unknown): string | null {
  if (!error)
    return null
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof AxiosError) {
    return parseAxiosError(error)
  }
  if (error instanceof Error) {
    return error.message ? error.message : 'Внутренняя ошибка.'
  }

  return 'Неизвестная ошибка'
}

export function useAsyncOperation<T = any, ARGS extends any[] = []>(
  callable: MaybeRef<(...args: ARGS) => any>,
  options?: UseAsyncOperationOptions<ARGS>,
): UseAsyncOperationReturn<T, ARGS> {
  const isLoadedOnce = ref(false)
  const loading = ref(!!options?.immediateCall)
  const errorCall = ref<any | null>(null)

  function handleError(error: any) {
    errorCall.value = error
    console.error(error)
    // Сброс состояния загрузки только в том случае если
    // ошибка НЕ спровоцирована AbortSignal
    /** @see call - async-operation.ts:123 */
    loading.value = false
    if (options?.rethrowExceptions)
      throw error
  }

  async function call(...args: ARGS): Promise<T | void> {
    try {
      loading.value = true
      errorCall.value = null
      const result = await get(callable)(...args)
      // Finally выполнится независимо от выброса исключения,
      // поэтому не используется для сохранения состояния
      // загрузки в случае отмены предыдушего запроса
      // до момента фактического выполнения текущего
      loading.value = false
      isLoadedOnce.value = true
      return result
    }
    catch (evaluationError) {
      if (!(evaluationError instanceof AxiosError && evaluationError.code === 'ERR_CANCELED'))
        handleError(evaluationError)
    }
  }

  if (options?.immediateCall) {
    call(...(options?.immediateCallInitialParams || ([] as unknown as ARGS)))
  }

  if (options?.dependencies && options.dependencies?.length > 0) {
    watch(options.dependencies, () => {
      call(...(options?.immediateCallInitialParams || ([] as unknown as ARGS)))
    })
  }

  function $reset() {
    loading.value = false
    errorCall.value = null
    isLoadedOnce.value = false
  }

  return {
    call: (options?.debounce && options.debounce > 0) ? useDebounceFn(call, options.debounce) : call,
    loading: computed(() => loading.value),
    updating: computed(() => isLoadedOnce.value && loading.value),
    error: computed(() => errorCall.value),
    errorMessage: computed(() => exportErrorMessage(errorCall.value)),
    $reset,
  }
}
