import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class StatsFilterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  widget_id!: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  project_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  event_name?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsOptional()
  session_id?: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;

  @IsIn(['hour', 'day'])
  @IsOptional()
  granularity?: 'hour' | 'day';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5000)
  @IsOptional()
  limit?: number = 500;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
