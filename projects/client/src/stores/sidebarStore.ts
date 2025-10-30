import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface SidebarState {
  isVisible: boolean
  toggle: () => void
  hide: () => void
  show: () => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      set => ({
        isVisible: true,
        toggle: () => set(state => ({ isVisible: !state.isVisible })),
        hide: () => set({ isVisible: false }),
        show: () => set({ isVisible: true })
      }),
      {
        name: 'sidebar',
        version: 1,
        storage: createJSONStorage(() => localStorage)
      }
    ),
    {
      name: 'sidebarStore'
    }
  )
)
