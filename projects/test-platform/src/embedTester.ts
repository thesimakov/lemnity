const STORAGE_WIDGET_ID = 'lemnity:test-platform:widgetId'
const STORAGE_WIDGET_HISTORY = 'lemnity:test-platform:widgetHistory'

export const DEFAULT_EMBED_SRC = 'http://localhost:5173/embed.js'

export function getCurrentWidgetId(): string {
  const params = new URLSearchParams(window.location.search)
  return (params.get('widgetId') || window.localStorage.getItem(STORAGE_WIDGET_ID) || '').trim()
}

export function setCurrentWidgetId(next: string) {
  const widgetId = next.trim()

  if (widgetId) window.localStorage.setItem(STORAGE_WIDGET_ID, widgetId)
  else window.localStorage.removeItem(STORAGE_WIDGET_ID)

  const url = new URL(window.location.href)
  if (widgetId) url.searchParams.set('widgetId', widgetId)
  else url.searchParams.delete('widgetId')

  window.location.assign(url.toString())
}

export function parseWidgetId(input: string): string {
  const raw = input.trim()
  if (!raw) return ''

  // Accept:
  // - <script src="http://localhost:5173/embed.js?widgetId=..." ...></script>
  // - http://localhost:5173/embed.js?widgetId=...
  // - widgetId itself
  const directId = raw.match(/^[a-z0-9]{8,}$/i)?.[0]
  if (directId) return directId

  const srcMatch = raw.match(/src\s*=\s*["']([^"']+)["']/i)
  const urlLike = srcMatch?.[1] ?? raw

  try {
    const url = new URL(urlLike, window.location.origin)
    return (url.searchParams.get('widgetId') || '').trim()
  } catch {
    const m = urlLike.match(/[?&]widgetId=([^&#"'\s]+)/i)
    return (m?.[1] ? decodeURIComponent(m[1]) : '').trim()
  }
}

export function formatEmbedScriptTag(widgetId: string): string {
  return `<script src="${DEFAULT_EMBED_SRC}?widgetId=${widgetId.trim()}" type="module" defer></script>`
}

export function getHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_WIDGET_HISTORY)
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    return Array.isArray(arr) ? arr.filter(Boolean) : []
  } catch {
    return []
  }
}

export function pushHistory(widgetId: string, limit = 12) {
  const id = widgetId.trim()
  if (!id) return
  const prev = getHistory()
  const next = [id, ...prev.filter(x => x !== id)].slice(0, limit)
  window.localStorage.setItem(STORAGE_WIDGET_HISTORY, JSON.stringify(next))
}


