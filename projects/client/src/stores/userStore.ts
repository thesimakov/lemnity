import { create } from 'zustand'
import type { User } from '@lemnity/api-sdk/models'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  clearUser: () => set({ user: null })
}))

export default useUserStore
