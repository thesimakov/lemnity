import type { PublicWidgetResponse } from './types'

export const getWindowOrigin = () => {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export const getApiBase = () => {
  return getWindowOrigin().includes('localhost') ? 'http://localhost:3000/api' : 'https://app.lemnity.ru/api'
}

export const findEmbedScript = () => {
  if (typeof document === 'undefined') return null
  const scripts = [
    document.currentScript as HTMLScriptElement | null | undefined,
    ...Array.from(document.querySelectorAll<HTMLScriptElement>('script'))
  ]
  const isProd = !getWindowOrigin().includes('localhost')
  for (const script of scripts) {
    if (script?.src?.includes(isProd ? 'app.lemnity.ru/embed.js' : '/embed.js')) {
      console.log(script)
      return script
    }
  }
  return null
}

const buildPublicWidgetUrl = (widgetId: string) => {
  const base = getApiBase()
  return `${base}/public/widgets/${encodeURIComponent(widgetId)}`
}

export const fetchPublicWidget = async (widgetId: string): Promise<PublicWidgetResponse> => {
  const res = await fetch(buildPublicWidgetUrl(widgetId), {
    method: 'GET',
    credentials: 'omit'
  })
  if (!res.ok) {
    throw new Error(`Failed to load widget ${widgetId}: ${res.status}`)
  }
  return (await res.json()) as PublicWidgetResponse
}

export const ensureContainer = (widgetId: string) => {
  const el = document.createElement('div')
  el.id = `lemnity-widget-${widgetId}`
  el.style.zIndex = '2147483000'
  el.style.display = 'block'
  el.style.position = 'fixed'
  document.body.appendChild(el)
  return el
}