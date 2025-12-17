import { Controller, Get, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { WidgetService } from './widget.service'
import { PublicWidget } from './entities/public-widget.entity'

@ApiTags('public-widgets')
@Controller('public/widgets')
export class PublicWidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: PublicWidget })
  findOne(@Param('id') id: string): Promise<PublicWidget> {
    return this.widgetService.findPublic(id)
  }
}
