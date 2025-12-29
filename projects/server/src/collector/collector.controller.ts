import { Body, Controller, InternalServerErrorException, Post, Req } from '@nestjs/common'
import type { Request } from 'express'
import type { CreateEventDto } from '@lemnity/nest-common'
import { ConfigService } from '@nestjs/config'

@Controller('public')
export class CollectorController {
  private readonly collectorBaseUrl: string

  constructor(private readonly config: ConfigService) {
    this.collectorBaseUrl = (this.config.get<string>('COLLECTOR_API_URL') ?? '').trim()
  }

  @Post('collect')
  async collect(@Body() body: CreateEventDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      ''

    const payload = {
      ...body,
      ip,
      user_agent: body.user_agent ?? req.headers['user-agent'],
      referrer: body.referrer ?? req.headers.referer
    }

    const res = await fetch(`${this.collectorBaseUrl.replace(/\/+$/, '')}/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new InternalServerErrorException(
        `Collector collect failed (${res.status}): ${text || res.statusText}`
      )
    }

    return { status: 'accepted' }
  }
}
