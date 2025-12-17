export const getWindowOrigin = () => {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

let apiBaseOverride: string | null = null

export const setApiBaseOverride = (value?: string | null) => {
  apiBaseOverride = value && value.trim() ? value.trim() : null
}

const getScriptOrigin = () => {
  if (typeof document === 'undefined') return null
  const candidates: (HTMLScriptElement | null | undefined)[] = [
    document.currentScript as HTMLScriptElement | null | undefined,
    ...Array.from(document.querySelectorAll<HTMLScriptElement>('script'))
  ]

  for (const script of candidates) {
    const src = script?.src
    if (!src) continue
    try {
      const url = new URL(src)
      if (url.pathname.includes('/embed.js') || url.pathname.includes('/src/embed/index')) {
        return url.origin
      }
    } catch {
      // ignore malformed src
    }
  }
  return null
}

export const getApiBase = () => {
  if (apiBaseOverride) return apiBaseOverride
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined
  if (fromEnv && fromEnv.trim()) return fromEnv.trim()
  const fromScript = getScriptOrigin()
  if (fromScript) return `${fromScript}/api`
  // Safe production fallback if script origin is unavailable (non-browser contexts)
  return 'https://app.lemnity.ru/api'
}

export const API_BASE = getApiBase()