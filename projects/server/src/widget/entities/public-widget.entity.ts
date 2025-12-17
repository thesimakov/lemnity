import { ApiProperty } from '@nestjs/swagger'
import { WidgetType, Prisma } from '@lemnity/database'

export class PublicWidget {
  @ApiProperty({ description: 'Widget id', example: 'w_123' })
  id: string

  @ApiProperty({ description: 'Project id', example: 'p_123' })
  projectId: string

  @ApiProperty({ description: 'Widget type', enum: WidgetType })
  type: WidgetType

  @ApiProperty({ description: 'Whether widget is enabled' })
  enabled: boolean

  @ApiProperty({
    description: 'Canonical widget configuration',
    nullable: true,
    required: false
  })
  config: Prisma.JsonValue | null
}
