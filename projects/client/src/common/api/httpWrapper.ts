// Простой и читаемый ретрай-хелпер поверх http
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { http } from '@common/api/http.ts'
import { uuidv4 } from '@/common/utils/uuidv4'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const isRetryable = (err: unknown) => {
  const e = err as AxiosError
  const s = e.response?.status
  // 5xx/429/ или нет статуса — пробуем повторить
  return !s || s >= 500 || s === 429
}

type RequestOptions<TRequest = unknown> = {
  method?: AxiosRequestConfig<TRequest>['method']
  params?: AxiosRequestConfig<TRequest>['params']
  data?: AxiosRequestConfig<TRequest>['data']
  headers?: AxiosRequestConfig<TRequest>['headers']
  retries?: number
  delayMs?: number
}

export async function request<TResponse = unknown, TRequest = unknown>(
  url: string,
  {
    method = 'GET',
    params,
    data,
    headers,
    retries = 3,
    delayMs = 300
  }: RequestOptions<TRequest> = {}
): Promise<AxiosResponse<TResponse>> {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await http.request<TResponse, AxiosResponse<TResponse>, TRequest>({
        url,
        method,
        params,
        data: data as TRequest,
        headers
      })
    } catch (err) {
      if (attempt === retries || !isRetryable(err)) throw err
      await sleep(delayMs)
      delayMs *= 2
    }
  }
  // для успокоения линтера
  throw new Error('unreachable')
}

export type CollectorEvent = {
  event_name: string
  widget_id: string
  project_id?: string
  session_id?: string
  user_id?: string
  url?: string
  referrer?: string
  user_agent?: string
  payload?: Record<string, unknown>
}

const COLLECTOR_SESSION_KEY = 'lemnity.session_id'

export function getCollectorSessionId(): string | null {
  if (typeof window === 'undefined') return null
  const existing = window.sessionStorage?.getItem(COLLECTOR_SESSION_KEY)
  if (existing) return existing
  const next = uuidv4()
  window.sessionStorage?.setItem(COLLECTOR_SESSION_KEY, next)
  return next
}

export async function sendEvent(event: CollectorEvent): Promise<boolean> {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return false
  const endpoint = (import.meta.env.VITE_COLLECT_URL ?? '/collect') as string

  try {
    const session_id = event.session_id ?? getCollectorSessionId() ?? undefined
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...event, session_id }),
      keepalive: true,
      credentials: 'omit'
    })
    return res.ok
  } catch {
    return false
  }
}
