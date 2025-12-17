export const getWindowOrigin = () => {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

let apiBaseOverride: string | null = null

export const setApiBaseOverride = (value?: string | null) => {
  apiBaseOverride = value && value.trim() ? value.trim() : null
}

export const getApiBase = () => {
  if (apiBaseOverride) return apiBaseOverride
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined
  if (fromEnv && fromEnv.trim()) return fromEnv.trim()
  // Avoid Vite dev origin (5173/5174) returning HTML; fallback to backend default
  return 'http://localhost:3000/api'
}

export const API_BASE = getApiBase()