import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClickhouseService } from '../infra/clickhouse.service';
import { InternalTokenGuard } from '../auth/internal-token.guard';
import type { CollectedEvent } from './events.types';

@Controller('internal/events')
@UseGuards(InternalTokenGuard)
export class InternalEventsController {
  constructor(private readonly clickhouse: ClickhouseService) {}

  @Post('collect')
  async collect(@Body() body: unknown) {
    const maybeBody = body as { messages?: unknown } | null;
    const messages = Array.isArray(maybeBody?.messages) ? maybeBody.messages : [];
    await this.clickhouse.insertEvents(normalizeCollectedEvents(messages));
    return { ok: true };
  }
}

function normalizeCollectedEvents(messages: unknown[]): CollectedEvent[] {
  const out: CollectedEvent[] = [];

  for (const item of messages) {
    if (!isRecord(item)) continue;

    const widget_id = typeof item.widget_id === 'string' ? item.widget_id : undefined;
    const event_name = typeof item.event_name === 'string' ? item.event_name : undefined;
    if (!widget_id || !event_name) continue;

    const event_time = parseDateLike(item.event_time);
    const project_id = typeof item.project_id === 'string' ? item.project_id : undefined;
    const session_id = typeof item.session_id === 'string' ? item.session_id : undefined;
    const user_id = typeof item.user_id === 'string' ? item.user_id : undefined;
    const url = typeof item.url === 'string' ? item.url : undefined;
    const referrer = typeof item.referrer === 'string' ? item.referrer : undefined;
    const user_agent = typeof item.user_agent === 'string' ? item.user_agent : undefined;
    const ip = typeof item.ip === 'string' ? item.ip : undefined;
    const payload = isRecord(item.payload) ? (item.payload as Record<string, unknown>) : undefined;

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
      payload,
    });
  }

  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseDateLike(value: unknown): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}
