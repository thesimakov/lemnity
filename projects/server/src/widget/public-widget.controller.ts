import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { WidgetService } from './widget.service'
import { PublicWidget } from './entities/public-widget.entity'
import type { Request } from 'express'
import { extractRequestOriginHost } from '../common/origin'

type PublicWheelSpinSector = {
  id: string
  mode: 'text' | 'icon'
  text?: string
  icon?: string
  promo?: string
  chance?: number
  isWin?: boolean
}

type PublicWheelSpinResult = {
  sectorId: string
  isWin: boolean
  sector: PublicWheelSpinSector
}

type PublicWheelSpinAlreadySpun = {
  blocked: true
  reason: 'already_spun'
  sectorId: string
  isWin: boolean
  sector: PublicWheelSpinSector
}

type PublicWheelSpinResponse = PublicWheelSpinResult | PublicWheelSpinAlreadySpun

@ApiTags('public-widgets')
@Controller('public/widgets')
export class PublicWidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: PublicWidget })
  findOne(@Param('id') id: string, @Req() req: Request): Promise<PublicWidget> {
    return this.widgetService.findPublic(id, extractRequestOriginHost(req))
  }

  @Post(':id/spin')
  @ApiResponse({ status: 200 })
  spin(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request
  ): Promise<PublicWheelSpinResponse> {
    const sessionId =
      typeof (body as { sessionId?: unknown } | null | undefined)?.sessionId === 'string'
        ? (body as { sessionId: string }).sessionId
        : undefined

    return this.widgetService.spinWheelPublic(id, sessionId, extractRequestOriginHost(req))
  }
}
