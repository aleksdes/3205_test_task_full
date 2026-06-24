import type { Store } from 'pinia'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum MenuItem {}

export interface CurrentUserState {
  avatar?: string
  firstName?: string
  lastName?: string
  middleName?: string
  fullName?: string
  login?: string
}

/**
 * Описание структуры данных сессии
 */
export declare interface SessionState {
  accessToken: string | null
  refreshToken: string | null
  expiresIn: number | null
  currentUser: CurrentUserState | null
  roles: string[]
  menuItems: MenuItem[]
  isFake: boolean
  adminAuthData: IAdminAuthData | null
}

export interface IAdminAuthData {
  impersonateLogin: string
  impersonateAxaptaId: string
  impersonateRoles?: string[]
}

/**
 * Описание интерфейса хранилища сессии
 * @see {SessionState}
 */
export declare interface SessionStore extends Store<'session', SessionState> {}

export const useSessionState: () => SessionStore = defineStore('session', () => {
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const expiresIn = ref(null)
  const isFake = ref(false)

  const currentUser = ref<CurrentUserState | null>(null)
  const roles = ref<string[]>([])
  const menuItems = ref<MenuItem[]>([])

  const adminAuthData = ref<IAdminAuthData | null>(null)

  return {
    accessToken,
    refreshToken,
    expiresIn,
    currentUser,
    roles,
    menuItems,
    isFake,
    adminAuthData,
  }
}, {
  persist: true,
})
