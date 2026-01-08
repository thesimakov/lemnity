import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  Req
} from '@nestjs/common'
import type { Request } from 'express'
import type { CreateEventDto } from '@lemnity/nest-common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma.service'
import {
  extractRequestOriginHost,
  extractWebsiteHosts,
  isDevOriginHostAllowed,
  isHostAllowedByWebsiteHosts
} from '../common/origin'

@Controller('public')
export class CollectorController {
  private readonly collectorBaseUrl: string

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.collectorBaseUrl = (this.config.get<string>('COLLECTOR_API_URL') ?? '').trim()
  }

  @Post('collect')
  async collect(@Body() body: CreateEventDto, @Req() req: Request) {
    const originHost = extractRequestOriginHost(req)
    if (!originHost) throw new ForbiddenException('Origin is required')

    const widgetId = (body?.widget_id ?? '').trim()
    if (!widgetId) throw new ForbiddenException('widget_id is required')

    const widget = await this.prisma.widget.findFirst({
      where: { id: widgetId, enabled: true, project: { enabled: true } },
      select: { id: true, project: { select: { websiteUrl: true } } }
    })
    if (!widget) throw new ForbiddenException('Widget not found')

    const isProd = process.env.NODE_ENV === 'production'
    if (isProd || !isDevOriginHostAllowed(originHost)) {
      const websiteHosts = extractWebsiteHosts(widget.project.websiteUrl)
      if (!websiteHosts.length || !isHostAllowedByWebsiteHosts(originHost, websiteHosts)) {
        throw new ForbiddenException('Origin is not allowed')
      }
    }

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
