import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common'
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

    const subscriptionId = isRecord(body) && typeof body.subscriptionId === 'string' ? body.subscriptionId : undefined
    console.log(
      `4. collector(/collect from gateway): ${JSON.stringify({
        subscriptionId: subscriptionId ?? null,
        received: messages.length,
        normalized: normalized.length,
        inserted,
        sampleEventNames: normalized.map((e) => e.event_name).slice(0, 10),
      })}`,
    )
    
    if (messages.length > 0 && inserted === 0) {
      throw new BadRequestException({ ok: false, received: messages.length, normalized: normalized.length, inserted })
    }
    return { ok: true, received: messages.length, normalized: normalized.length, inserted }
  }
}

function normalizeCollectedEvents(messages: unknown[]): CollectedEvent[] {
  const out: CollectedEvent[] = []

  for (const rawItem of messages) {
    const item = normalizeSingleMessage(rawItem)
    if (!item) continue

    out.push(item)
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

function normalizeSingleMessage(raw: unknown): CollectedEvent | null {
  let cur: unknown = raw
  const seen = new WeakSet<object>()

  while (true) {
    if (typeof cur === 'string') {
      const parsed = tryParseJson(cur)
      if (parsed === undefined) return null
      cur = parsed
      continue
    }

    if (!isRecord(cur)) return null

    if (seen.has(cur)) return null
    seen.add(cur)

    const widget_id = typeof cur.widget_id === 'string' && cur.widget_id.trim() ? cur.widget_id : undefined
    const event_name = typeof cur.event_name === 'string' && cur.event_name.trim() ? cur.event_name : undefined
    if (widget_id && event_name) {
      const event_time = parseDateLike(cur.event_time)
      const project_id = typeof cur.project_id === 'string' ? cur.project_id : undefined
      const session_id = typeof cur.session_id === 'string' ? cur.session_id : undefined
      const user_id = typeof cur.user_id === 'string' ? cur.user_id : undefined
      const url = typeof cur.url === 'string' ? cur.url : undefined
      const referrer = typeof cur.referrer === 'string' ? cur.referrer : undefined
      const user_agent = typeof cur.user_agent === 'string' ? cur.user_agent : undefined
      const ip = typeof cur.ip === 'string' ? cur.ip : undefined
      const payload = isRecord(cur.payload) ? (cur.payload as Record<string, unknown>) : undefined

      return {
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
        payload,
      }
    }

    if ('message' in cur) {
      cur = cur.message
      continue
    }
    if (cur.event !== undefined) {
      cur = cur.event
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

    return null
  }
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
