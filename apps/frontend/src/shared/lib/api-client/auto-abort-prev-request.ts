import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const ongoingRequests = new Map<string, AbortController>()

function buildRequestId(config: AxiosRequestConfig): string {
  return `${config.method}-${config.url}`
}

/**
 * Добавляет запрос в список выполняемых и отменяет предыдущие запросы
 * @param config
 */
export function autoAbortPrevRequest(config: InternalAxiosRequestConfig) {
  const requestID = buildRequestId(config)

  if (config.method?.toLowerCase() !== 'get') {
    return config
  }

  if (ongoingRequests.has(requestID) && !ongoingRequests.get(requestID)?.signal.aborted) {
    ongoingRequests.get(requestID)?.abort()
    ongoingRequests.delete(requestID)
  }

  const abortController = new AbortController()
  if (!ongoingRequests.has(requestID)) {
    config.signal = abortController.signal
    ongoingRequests.set(requestID, abortController)
  }

  return config
}

/**
 * Удаление запроса из списка выполняемых
 * @param response
 */
export function autoAbortCleanUp(response: AxiosResponse) {
  const requestID = buildRequestId(response.config)
  ongoingRequests.delete(requestID)
  return response
}

export function setupAutoAbortRequest(axios: AxiosInstance) {
  axios.interceptors.request.use(autoAbortPrevRequest)
  axios.interceptors.response.use(autoAbortCleanUp)
}
