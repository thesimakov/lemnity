import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { CreateEventDto } from '@lemnity/nest-common';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('collect')
  async collect(@Body() body: CreateEventDto, @Req() req: Request) {
    console.log(
      `1. collector(/collect ): ${JSON.stringify({
        widget_id: body.widget_id,
        event_name: body.event_name,
        project_id: body.project_id ?? null,
        session_id: body.session_id ?? null,
      })}`,
    );
    
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';

    const result = await this.eventsService.enqueueEvent({
      ...body,
      ip,
      user_agent: body.user_agent ?? req.headers['user-agent'],
      referrer: body.referrer ?? req.headers.referer
    });

    return { status: 'accepted', ...result };
  }
}
