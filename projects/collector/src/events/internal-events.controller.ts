import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ClickhouseService } from '../infra/clickhouse.service'
import { InternalTokenGuard } from '../auth/internal-token.guard'
import type { CollectedEvent } from './events.types'

@Controller('internal/events')
@UseGuards(InternalTokenGuard)
export class InternalEventsController {
  constructor(private readonly clickhouse: ClickhouseService) {}

  @Post('collect')
  async collect(@Body() body: unknown) {
    const messages = extractMessages(body)
    const normalized = normalizeCollectedEvents(messages)
    const inserted = await this.clickhouse.insertEvents(normalized)
    return { ok: true, received: messages.length, normalized: normalized.length, inserted }
  }
}

function normalizeCollectedEvents(messages: unknown[]): CollectedEvent[] {
  const out: CollectedEvent[] = []

  for (const rawItem of messages) {
    const candidates = expandCandidateRecords(rawItem)
    for (const item of candidates) {
      const widget_id = typeof item.widget_id === 'string' ? item.widget_id : undefined
      const event_name = typeof item.event_name === 'string' ? item.event_name : undefined
      if (!widget_id || !event_name) continue

      const event_time = parseDateLike(item.event_time)
      const project_id = typeof item.project_id === 'string' ? item.project_id : undefined
      const session_id = typeof item.session_id === 'string' ? item.session_id : undefined
      const user_id = typeof item.user_id === 'string' ? item.user_id : undefined
      const url = typeof item.url === 'string' ? item.url : undefined
      const referrer = typeof item.referrer === 'string' ? item.referrer : undefined
      const user_agent = typeof item.user_agent === 'string' ? item.user_agent : undefined
      const ip = typeof item.ip === 'string' ? item.ip : undefined
      const payload = isRecord(item.payload) ? (item.payload as Record<string, unknown>) : undefined

      out.push({
        event_time,
        widget_id,
        project_id,
        session_id,
        event_name,
        user_id,
        url,
        referrer,
        user_agent,
        ip,
        payload
      })
    }
  }

  return out
}

function extractMessages(body: unknown): unknown[] {
  let cur: unknown = body
  const seen = new WeakSet<object>()

  while (true) {
    if (typeof cur === 'string') {
      const parsed = tryParseJson(cur)
      if (parsed === undefined) return []
      cur = parsed
      continue
    }

    if (Array.isArray(cur)) return cur
    if (!isRecord(cur)) return []

    if (seen.has(cur)) return []
    seen.add(cur)

    if ('messages' in cur) {
      cur = cur.messages
      continue
    }

    if (cur.data !== undefined) {
      cur = cur.data
      continue
    }

    if (cur.body !== undefined) {
      cur = cur.body
      continue
    }

    return []
  }
}

function expandCandidateRecords(value: unknown): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = []
  const stack: unknown[] = [value]
  const seen = new WeakSet<object>()

  while (stack.length) {
    const cur = stack.pop()
    if (cur === undefined) continue

    if (typeof cur === 'string') {
      const parsed = tryParseJson(cur)
      if (parsed !== undefined) stack.push(parsed)
      continue
    }

    if (Array.isArray(cur)) {
      for (let i = cur.length - 1; i >= 0; i -= 1) stack.push(cur[i])
      continue
    }

    if (!isRecord(cur)) continue

    if (typeof cur.widget_id === 'string' && typeof cur.event_name === 'string') {
      out.push(cur)
      continue
    }

    if (seen.has(cur)) continue
    seen.add(cur)

    if (cur.message !== undefined) stack.push(cur.message)
    if (cur.event !== undefined) stack.push(cur.event)
    if (cur.data !== undefined) stack.push(cur.data)
    if (cur.body !== undefined) stack.push(cur.body)
  }

  return out
}

function tryParseJson(value: string): unknown | undefined {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return undefined
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseDateLike(value: unknown): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}
