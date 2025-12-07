import { IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PayloadDto {
  [key: string]: unknown;
}

export class CreateEventDto {
  @IsString()
  @MaxLength(128)
  event_name!: string;

  @IsString()
  @MaxLength(128)
  widget_id!: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  project_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  session_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  user_id?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsOptional()
  user_agent?: string;

  @ValidateNested()
  @Type(() => PayloadDto)
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
