import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Counters = Record<string, number>
type Values = Record<string, unknown>

type PreviewRuntimeState = {
  counters: Counters
  values: Values
  emit: (eventKey: string) => void
  setValue: (key: string, value: unknown) => void
  reset: (eventKey?: string) => void
}

const usePreviewRuntimeStore = create<PreviewRuntimeState>()(
  devtools(
    set => ({
      counters: {},
      values: {},
      emit: (eventKey: string) =>
        set(state => ({
          counters: { ...state.counters, [eventKey]: (state.counters[eventKey] ?? 0) + 1 }
        })),
      setValue: (key: string, value: unknown) =>
        set(state => ({ values: { ...state.values, [key]: value } })),
      reset: (eventKey?: string) =>
        set(state => {
          if (!eventKey) return { counters: {}, values: {} }
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
