/**
 * Генерирует случайный код ошибки с настраиваемой длиной и набором символов
 * @param length Длина кода ошибки (по умолчанию: 8)
 * @param charset Символы для генерации кода (по умолчанию: буквенно-цифровые)
 * @returns Случайно сгенерированная строка кода ошибки
 */
function createErrorCode(
  length: number = 8,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
): string {
  const charsetLength = charset.length
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charsetLength)]).join('')
}

/**
 * Генерирует префиксированный код ошибки с определённым контекстом
 * @param context Необязательный префикс контекста для кода ошибки
 * @param length Длина случайной части кода ошибки (по умолчанию: 6)
 * @returns Префиксированный код ошибки
 */
function createContextualErrorCode(
  context: string = 'ERR',
  length: number = 6,
): string {
  return `${context}-${createErrorCode(length)}`
}

enum LogContext {
  APP = 'APP',
  AUTH = 'AUTH',
  USER = 'USER',
  JWT = 'JWT',
  REQUEST = 'REQUEST',
  ROUTE = 'ROUTE',
  INIT = 'INIT',
}

const Logger = {
  create(code?: string, initialContext?: Record<string, any>) {
    const isProduction = import.meta.env.MODE === 'production'
    return {
      error(message: string, error?: unknown, context?: Record<string, any>) {
        const finalContext = { ...initialContext, ...context, code }
        if (!isProduction)
          console.error(`[ERROR] ${code}: ${message}`, error, finalContext)
      },

      warning(message: string, context: Record<string, any> = {}) {
        const finalContext = { ...initialContext, ...context, code }
        if (!isProduction)
          console.warn(`[WARNING] ${code}: ${message}`, finalContext)
      },

      info(message: string, context: Record<string, any> = {}) {
        const finalContext = { ...initialContext, ...context, code }
        if (!isProduction)
          console.warn(`[INFO] ${code}: ${message}`, finalContext)
      },
    }
  },
}

export {
  createContextualErrorCode,
  createErrorCode,
  LogContext,
  Logger,
}
