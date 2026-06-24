import { AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import { Api, HttpClient } from '@/shared/generated/api'
import { setupAutoAbortRequest } from './auto-abort-prev-request.ts'
import { filterUrl } from './filterUrl'
import { networkWatcher } from './network-watcher'

type SecurityPolicy = unknown

let late_apiClient: Api<any>

export function createInstance() {
  let API_TARGET = import.meta.env.VITE_API_TARGET
  if (API_TARGET && API_TARGET.endsWith('/'))
    API_TARGET = API_TARGET.slice(0, -1)

  if (!API_TARGET) {
    throw new Error(`
      Не установлена переменная окружения VITE_API_TARGET
    `)
  }

  const httpClient = new HttpClient({
    baseURL: API_TARGET,
  })

  axiosRetry(httpClient.instance as any, {
    retries: 3,
    retryCondition(error) {
      return (
        error.code !== AxiosError.ERR_CANCELED // Игнорирование ошибок отмены запросов
        && ['401', '422', '400'].includes(`${error.status}`) === false) // Игнорирование ошибок которые не исправить повторным запросом
    },
  })

  return httpClient
}

function setupApiClient(): Api<SecurityPolicy> {
  const httpClient = createInstance()

  setupAutoAbortRequest(httpClient.instance)

  httpClient.instance.interceptors.request.use(networkWatcher)
  httpClient.instance.interceptors.request.use(filterUrl)

  late_apiClient = new Api(httpClient)

  return late_apiClient
}

export function useApiClient() {
  return late_apiClient || setupApiClient()
}
