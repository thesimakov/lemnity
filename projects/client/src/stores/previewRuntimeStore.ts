import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Counters = Record<string, number>

type PreviewRuntimeState = {
  counters: Counters
  emit: (eventKey: string) => void
  reset: (eventKey?: string) => void
}

const usePreviewRuntimeStore = create<PreviewRuntimeState>()(
  devtools(
    set => ({
      counters: {},
      emit: (eventKey: string) =>
        set(state => ({
          counters: { ...state.counters, [eventKey]: (state.counters[eventKey] ?? 0) + 1 }
        })),
      reset: (eventKey?: string) =>
        set(state => {
          if (!eventKey) return { counters: {} }
          if (!(eventKey in state.counters)) return state
          const copy = { ...state.counters }
          delete copy[eventKey]
          return { counters: copy }
        })
    }),
    { name: 'previewRuntime' }
  )
)

export default usePreviewRuntimeStore
