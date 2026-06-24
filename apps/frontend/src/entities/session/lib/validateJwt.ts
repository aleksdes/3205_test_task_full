import { jwtDecode } from 'jwt-decode'
import { createContextualErrorCode, LogContext, Logger } from '@/shared/lib/logger'

function decodeJwt(token: string | null) {
  if (!token)
    return null

  try {
    return jwtDecode(token)
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_: any) {
    return null
  }
}

export default function validateJwt(token: string | null) {
  const logger = Logger.create(createContextualErrorCode(LogContext.JWT))

  if (!token)
    return false

  try {
    const decoded = decodeJwt(token)
    if (!decoded)
      return false
    const { exp } = decoded
    if (!exp)
      return false

    const currentTime = Date.now()
    return currentTime < exp * 1000
  }
  catch (error) {
    logger.error('Ошибка декодирования токена', error, {
      token,
    })
    return false
  }
}
