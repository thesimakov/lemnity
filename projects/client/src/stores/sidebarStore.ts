import { create } from 'zustand'

interface SidebarState {
  isVisible: boolean
  toggle: () => void
  hide: () => void
  show: () => void
}

export const useSidebarStore = create<SidebarState>(set => ({
  isVisible: true,
  toggle: () => set(state => ({ isVisible: !state.isVisible })),
  hide: () => set({ isVisible: false }),
  show: () => set({ isVisible: true })
}))
