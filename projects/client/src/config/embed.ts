const FALLBACK_PATH = '/embed.js'

const getWindowOrigin = () => {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export const getEmbedScriptUrl = (): string => {
  const origin = getWindowOrigin()
  return origin ? `${origin}${FALLBACK_PATH}` : FALLBACK_PATH
}

export const buildEmbedSnippet = (widgetId: string): string => {
  const scriptUrl = getEmbedScriptUrl()
  const url = (() => {
    try {
      const u = new URL(
        scriptUrl,
        typeof window !== 'undefined' ? window.location.origin : undefined
      )
      u.searchParams.set('widgetId', widgetId)
      return u.toString()
    } catch {
      // fallback if URL  не сработал
      const sep = scriptUrl.includes('?') ? '&' : '?'
      return `${scriptUrl}${sep}widgetId=${encodeURIComponent(widgetId)}`
    }
  })()

  return `<script src="${url}" type="module" defer></script>`
}
