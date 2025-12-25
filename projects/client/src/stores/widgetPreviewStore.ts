import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { WidgetTypeEnum } from '@lemnity/api-sdk'

export type PreviewMode = 'desktop' | 'mobile'
export type WidgetType = WidgetTypeEnum

interface PreviewState {
  mode: PreviewMode
  setMode: (mode: PreviewMode) => void
}

const initialState: Pick<PreviewState, 'mode'> = {
  mode: 'desktop'
}

const useWidgetPreviewStore = create<PreviewState>()(
  devtools(
    set => ({
      ...initialState,
      setMode: (mode: PreviewMode) => set({ mode })
    }),
    { name: 'widgetPreviewStore' }
  )
)

export default useWidgetPreviewStore
