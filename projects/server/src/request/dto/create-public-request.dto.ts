import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

const devices = ['desktop', 'mobile_ios', 'mobile_android'] as const
type Device = (typeof devices)[number]

export class CreatePublicRequestDto {
  @ApiProperty()
  @IsString()
  widgetId: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prizes?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sectorId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isWin?: boolean

  @ApiPropertyOptional({ enum: devices })
  @IsOptional()
  @IsIn(devices)
  device?: Device

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referrer?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAgent?: string
}
