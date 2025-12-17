import type { PreviewMode } from '@/stores/widgetPreviewStore'
import type { InitOptions } from './types'
import EmbedManager from './embedManager'
import { API_BASE, setApiBaseOverride } from './utils'

const manager = new EmbedManager()

const api = {
  init: (options: InitOptions) => {
    if (options.apiBase) setApiBaseOverride(options.apiBase)
    return manager.init(options)
  },
  destroy: (widgetId?: string) => manager.destroy(widgetId)
}

const autoInitFromQuery = () => {
  // Debug traces to see why init may not fire
  console.debug('[LemnityWidgets] autoInitFromQuery start')
  const isEmbedScriptSrc = (src: string) =>
    src.includes('/embed.js') || src.includes('/src/embed/index')

  const current =
    (document.currentScript as HTMLScriptElement | null) ??
    Array.from(document.querySelectorAll<HTMLScriptElement>('script')).find(el => isEmbedScriptSrc(el.src))
  if (!current) return
  try {
    const url = new URL(current.src)
    const widgetId = url.searchParams.get('widgetId')
    if (!widgetId) return
    const mode = (url.searchParams.get('mode') as PreviewMode | null) ?? 'desktop'
    const container = url.searchParams.get('container') ?? undefined
    const apiBase = url.searchParams.get('apiBase') ?? undefined
    if (apiBase) setApiBaseOverride(apiBase)
    console.debug('[LemnityWidgets] init from query', {
      widgetId,
      mode,
      container,
      apiBase: apiBase ?? API_BASE
    })
    api.init({ widgetId, mode, container, apiBase }).catch(err => console.error('[LemnityWidgets]', err))
  } catch {
    // ignore parse errors
  }
}

const bootstrap = () => {
  const w = window as unknown as typeof window & {
    LemnityWidgets?: {
      init?: (options: InitOptions) => Promise<void>
      destroy?: (widgetId?: string) => Promise<void>
      queue?: { type: 'init'; payload: InitOptions }[]
    }
  }

  const queued = w.LemnityWidgets?.queue ?? []
  w.LemnityWidgets = { ...w.LemnityWidgets, ...api, queue: [] }
  queued.forEach(job => {
    if (job?.type === 'init' && job.payload) {
      api.init(job.payload).catch((err: unknown) => console.error('[LemnityWidgets]', err))
    }
  })
  autoInitFromQuery()
}

if (document.readyState === 'complete') {
  bootstrap()
} else {
  window.addEventListener('load', bootstrap, { once: true })
}
