import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickhouseService } from './clickhouse.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ClickhouseService],
  exports: [ClickhouseService],
})
export class ClickhouseModule {}
