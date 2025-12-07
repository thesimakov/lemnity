import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CollectorService } from '../collector/collector.service'
import { StatsFilterDto } from '@lemnity/nest-common'

@Injectable()
export class StatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly collector: CollectorService
  ) {}

  private async ensureWidgetAccess(widgetId: string, userId: string) {
    const widget = await this.prisma.widget.findFirst({
      where: {
        id: widgetId,
        project: { userId }
      },
      select: { id: true }
    })
    if (!widget) {
      throw new ForbiddenException('Widget not found or access denied')
    }
  }

  private normalizeFilter(filter: StatsFilterDto): StatsFilterDto {
    return {
      ...filter,
      limit: filter.limit ? Number(filter.limit) : undefined,
      offset: filter.offset ? Number(filter.offset) : undefined
    }
  }

  async summary(filter: StatsFilterDto, userId: string) {
    await this.ensureWidgetAccess(filter.widget_id, userId)
    return this.collector.summary(this.normalizeFilter(filter))
  }

  async timeseries(filter: StatsFilterDto, userId: string) {
    await this.ensureWidgetAccess(filter.widget_id, userId)
    return this.collector.timeseries(this.normalizeFilter(filter))
  }

  async events(filter: StatsFilterDto, userId: string) {
    await this.ensureWidgetAccess(filter.widget_id, userId)
    return this.collector.events(this.normalizeFilter(filter))
  }
}
