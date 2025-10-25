import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import type { WidgetTypeEnum } from '@lemnity/api-sdk'

export type PreviewMode = 'desktop' | 'mobile'
export type WidgetType = WidgetTypeEnum

interface PreviewState {
  mode: PreviewMode
  setMode: (mode: PreviewMode) => void
  widgetType: WidgetType | null
  setWidgetType: (widgetType: WidgetType | null) => void

  init: (params: { initialType: WidgetType | null }) => void
  clear: () => void
}

const initialState: Pick<PreviewState, 'mode' | 'widgetType'> = {
  mode: 'desktop',
  widgetType: null
}

const useWidgetPreviewStore = create<PreviewState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setMode: (mode: PreviewMode) => set({ mode }),
        setWidgetType: (widgetType: WidgetType | null) => set({ widgetType }),
        init: ({ initialType }) => {
          if (get().widgetType == null) set({ widgetType: initialType })
        },
        clear: () => set({ widgetType: null })
      }),
      {
        name: 'widget-preview',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({ mode: state.mode })
      }
    ),
    { name: 'widgetPreviewStore' }
  )
)

export default useWidgetPreviewStore
