import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { WidgetType, Prisma } from '@lemnity/database'

export class CreateWidgetDto {
  @ApiProperty({
    description: 'The ID of the project this widget belongs to',
    example: 'clxxx123456'
  })
  @IsString()
  @IsNotEmpty()
  projectId: string

  @ApiProperty({
    description: 'The name of the widget',
    example: 'My Wheel Widget'
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The type of the widget',
    enum: WidgetType,
    example: WidgetType.WHEEL_OF_FORTUNE
  })
  @IsEnum(WidgetType)
  @IsNotEmpty()
  type: WidgetType

  @ApiProperty({
    description: 'Whether the widget is enabled',
    example: true,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @ApiProperty({
    description: 'JSON configuration for the widget',
    example: { colors: ['#FF0000', '#00FF00'], prizes: ['10% off', '20% off'] },
    required: false
  })
  @IsOptional()
  config?: Prisma.InputJsonValue
}
