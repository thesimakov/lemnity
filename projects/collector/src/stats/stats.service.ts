import { Injectable } from '@nestjs/common';
import { StatsFilterDto } from '@lemnity/nest-common';
import { ClickhouseService } from '../infra/clickhouse.service';

@Injectable()
export class StatsService {
  constructor(private readonly clickhouse: ClickhouseService) {}

  summary(filter: StatsFilterDto) {
    return this.clickhouse.summary(filter);
  }

  timeseries(filter: StatsFilterDto) {
    return this.clickhouse.timeseries(filter);
  }

  events(filter: StatsFilterDto) {
    return this.clickhouse.events(filter);
  }
}
