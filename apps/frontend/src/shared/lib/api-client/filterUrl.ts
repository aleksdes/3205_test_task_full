import type { InternalAxiosRequestConfig } from 'axios'

export function filterUrl(options: InternalAxiosRequestConfig) {
  if (options.url?.endsWith('/'))
    options.url = options.url.slice(0, -1)
  return options
}
