import type { InternalAxiosRequestConfig } from 'axios'
import { useOnline } from '@vueuse/core'

export function networkWatcher(options: InternalAxiosRequestConfig) {
  const isOnline = useOnline()
  if (!isOnline.value)
    throw new Error('Сеть недоступна')

  return options
}
