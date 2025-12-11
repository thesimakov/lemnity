import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { CreateEventDto } from '@lemnity/nest-common';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('collect')
  async collect(@Body() body: CreateEventDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';

    await this.eventsService.enqueueEvent({
      ...body,
      ip,
      user_agent: body.user_agent ?? req.headers['user-agent'],
      referrer: body.referrer ?? req.headers.referer
    });

    return { status: 'accepted' };
  }
}
