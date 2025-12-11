import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StatsFilterDto } from '@lemnity/nest-common';
import { InternalTokenGuard } from '../auth/internal-token.guard';
import { StatsService } from './stats.service';

@Controller('internal/stats')
@UseGuards(InternalTokenGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('summary')
  summary(@Body() filter: StatsFilterDto) {
    return this.statsService.summary(filter);
  }

  @Post('timeseries')
  timeseries(@Body() filter: StatsFilterDto) {
    return this.statsService.timeseries(filter);
  }

  @Post('events')
  events(@Body() filter: StatsFilterDto) {
    return this.statsService.events(filter);
  }
}
