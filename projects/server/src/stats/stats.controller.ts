import { Controller, Get, Query } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { StatsService } from './stats.service'
import { StatsFilterDto } from '@lemnity/nest-common'

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  @Auth()
  summary(@Query() filter: StatsFilterDto, @CurrentUser('id') userId: string) {
    return this.statsService.summary(filter, userId)
  }

  @Get('timeseries')
  @Auth()
  timeseries(@Query() filter: StatsFilterDto, @CurrentUser('id') userId: string) {
    return this.statsService.timeseries(filter, userId)
  }

  @Get('events')
  @Auth()
  events(@Query() filter: StatsFilterDto, @CurrentUser('id') userId: string) {
    return this.statsService.events(filter, userId)
  }
}
