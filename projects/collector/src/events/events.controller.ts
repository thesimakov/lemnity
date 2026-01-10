import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('collect')
  async collect(@Body() body: unknown, @Req() req: Request) {
    if (!isRecord(body)) {
      throw new BadRequestException({ ok: false, error: 'invalid_body' });
    }

    const allowedKeys = new Set([
      'event_name',
      'widget_id',
      'project_id',
      'session_id',
      'user_id',
      'url',
      'referrer',
      'user_agent',
      'payload',
    ]);

    for (const key of Object.keys(body)) {
      if (!allowedKeys.has(key)) {
        throw new BadRequestException({ ok: false, error: 'unknown_field', field: key });
      }
    }

    const normalized = normalizeIncomingEvent(body);
    const widget_id = normalized.widget_id;
    const event_name = normalized.event_name;
    if (!widget_id || !event_name) {
      throw new BadRequestException({ ok: false, error: 'invalid_event' });
    }

    console.log(
      `1. collector(/collect ): ${JSON.stringify({
        widget_id,
        event_name,
        project_id: normalized.project_id ?? null,
        session_id: normalized.session_id ?? null,
      })}`,
    );

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';

    const result = await this.eventsService.enqueueEvent({
      ...normalized,
      widget_id,
      event_name,
      ip,
      user_agent: normalized.user_agent ?? req.headers['user-agent'],
      referrer: normalized.referrer ?? req.headers.referer,
    });

    return { status: 'accepted', ...result };
  }
}

function normalizeIncomingEvent(body: unknown): {
  widget_id?: string;
  event_name?: string;
  project_id?: string;
  session_id?: string;
  user_id?: string;
  url?: string;
  referrer?: string;
  user_agent?: string;
  payload?: Record<string, unknown>;
} {
  const obj = isRecord(body) ? body : {};

  const pickString = (key: string) => {
    const v = obj[key];
    return typeof v === 'string' && v.trim() ? v : undefined;
  };

  const payload = isRecord(obj.payload) ? (obj.payload as Record<string, unknown>) : undefined;

  return {
    event_name: pickString('event_name'),
    widget_id: pickString('widget_id'),
    project_id: pickString('project_id'),
    session_id: pickString('session_id'),
    user_id: pickString('user_id'),
    url: pickString('url'),
    referrer: pickString('referrer'),
    user_agent: pickString('user_agent'),
    payload,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
