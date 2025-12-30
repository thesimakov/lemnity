import { request } from '@common/api/httpWrapper'
import { API } from '@common/api/endpoints'
import type { StatsFilterDto } from '@lemnity/nest-common'

export type StatsSummary = { events: number }
export type StatsTimeseriesPoint = { bucket: string; events: number }
export type StatsEvent = {
  event_time: string
  widget_id: string
  project_id?: string
  session_id?: string
  event_name: string
  user_id?: string
  url?: string
  referrer?: string
  user_agent?: string
  ip?: string
  payload?: Record<string, unknown>
}

const paramsFromFilter = (filter: Partial<StatsFilterDto>) =>
  Object.fromEntries(
    Object.entries(filter).filter(([, v]) => v !== undefined && v !== null && v !== '')
  )

export async function fetchSummary(filter: Partial<StatsFilterDto>) {
  const res = await request<StatsSummary>(API.STATS.SUMMARY, {
    method: 'GET',
    params: paramsFromFilter(filter)
  })
  return res.data
}

export async function fetchTimeseries(filter: Partial<StatsFilterDto>) {
  const res = await request<StatsTimeseriesPoint[]>(API.STATS.TIMESERIES, {
    method: 'GET',
    params: paramsFromFilter(filter)
  })
  return res.data
}

export async function fetchEvents(filter: Partial<StatsFilterDto>) {
  const res = await request<StatsEvent[]>(API.STATS.EVENTS, {
    method: 'GET',
    params: paramsFromFilter(filter)
  })
  return res.data
}
