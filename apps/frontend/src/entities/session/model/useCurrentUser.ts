import type { ComputedRef } from 'vue'
import type { CurrentUserState, MenuItem, SessionStore } from './State'
import { computed } from 'vue'
import { createContextualErrorCode, LogContext, Logger } from '@/shared/lib/logger'
import { useSessionState } from './State'

export declare interface UseCurrentUserReturn {
  /**
   * Данные аккаунта пользователя
   */
  currentUser: ComputedRef<CurrentUserState | null>;
  /**
   * Меню пользователя
   */
  menuItems: ComputedRef<MenuItem[]>;
  fullName: ComputedRef<string>;
  userInitials: ComputedRef<string>;
  setUser: (userData: CurrentUserState | null) => void;
}

export function useCurrentUser(
  store: SessionStore = useSessionState(),
): UseCurrentUserReturn {
  function setUser(userData: CurrentUserState | null) {
    const logger = Logger.create(createContextualErrorCode(LogContext.USER))

    store.currentUser = userData

    if (userData) {
      logger.info('Пользователь вошел в систему', { user: userData })
    }
    else {
      // Log user logout event
      logger.info('Пользователь вышел из системы')
    }
  }

  const fullName = computed(() => {
    if (!store.currentUser)
      return ''
    const nameParts = [store.currentUser.firstName, store.currentUser.lastName].filter(Boolean)
    return nameParts.join(' ').trim()
  })

  const userInitials = computed(() => {
    if (fullName.value) {
      return fullName.value
        .split(' ')
        .filter(Boolean)
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (store.currentUser && store.currentUser.login) {
      return store.currentUser.login.substring(0, 2).toUpperCase()
    }
    return ''
  })

  return {
    fullName,
    userInitials,
    setUser,
    currentUser: computed(() => store.currentUser),
    menuItems: computed(() => store.menuItems),
  }
}
