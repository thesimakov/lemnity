import { create } from 'zustand'
import type { User } from '@lemnity/api-sdk/models'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      set => ({
        user: null,
        setUser: (user: User | null) => set({ user }),
        clearUser: () => set({ user: null })
      }),
      {
        name: 'user',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: s => ({ user: s.user })
      }
    ),
    { name: 'userStore' }
  )
)

export default useUserStore
