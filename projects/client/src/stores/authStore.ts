import { create } from 'zustand'
import * as authService from '@services/auth.ts'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { isTokenExpiredOrNearExpiry } from '@common/utils/jwt'

type SessionStatus = 'unknown' | 'authenticated' | 'guest'

interface AuthState {
  accessToken: string | null
  sessionStatus: SessionStatus
  setSession: (token: string) => void
  clearSession: () => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  refreshToken: () => Promise<string | null>
  logout: () => Promise<void>
  bootstrap: () => Promise<void>
}

const initialState: Pick<AuthState, 'accessToken' | 'sessionStatus'> = {
  accessToken: null,
  sessionStatus: 'unknown'
}

// Дедупликация параллельных вызовов refresh
let refreshPromise: Promise<string | null> | null = null

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        login: async (email: string, password: string) => {
          const { accessToken } = await authService.login({ email, password })
          get().setSession(accessToken)
        },
        register: async (email: string, password: string, name: string) => {
          const { accessToken } = await authService.register({ email, password, name })
          get().setSession(accessToken)
        },
        setSession: (token: string) =>
          set({ accessToken: token, sessionStatus: 'authenticated' }, false, 'auth/setSession'),
        clearSession: () => {
          set(initialState, false, 'auth/clearSession')
        },
        refreshToken: async () => {
          if (!refreshPromise) {
            refreshPromise = authService.refreshToken().finally(() => {
              refreshPromise = null
            })
          }
          const newToken = await refreshPromise
          if (newToken) {
            set(
              { accessToken: newToken, sessionStatus: 'authenticated' },
              false,
              'auth/refresh:success'
            )
            return newToken
          }
          set({ accessToken: null, sessionStatus: 'guest' }, false, 'auth/refresh:fail')
          return null
        },
        logout: async () => {
          await authService.logout()
          set(initialState, false, 'auth/logout')
        },
        bootstrap: async () => {
          let token: string | null = null
          set(s => {
            token = s.accessToken
            return s
          })

          try {
            if (!token) {
              set({ accessToken: null, sessionStatus: 'guest' }, false, 'auth/bootstrap:no-token')
              return
            }

            if (isTokenExpiredOrNearExpiry(token)) {
              const newToken = await authService.refreshToken()
              if (newToken) {
                set(
                  { accessToken: newToken, sessionStatus: 'authenticated' },
                  false,
                  'auth/bootstrap:refresh'
                )
              } else {
                set({ accessToken: null, sessionStatus: 'guest' }, false, 'auth/bootstrap:guest')
              }
            } else {
              set({ sessionStatus: 'authenticated' }, false, 'auth/bootstrap:token-valid')
            }
          } catch {
            set({ accessToken: null, sessionStatus: 'guest' }, false, 'auth/bootstrap:error')
          }
        }
      }),
      {
        name: 'auth',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: s => ({ accessToken: s.accessToken })
      }
    ),
    { name: 'authStore' }
  )
)

export default useAuthStore
