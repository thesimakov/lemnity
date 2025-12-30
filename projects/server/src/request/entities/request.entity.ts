import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RequestContact {
  @ApiPropertyOptional()
  phone?: string

  @ApiPropertyOptional()
  email?: string
}

export class RequestEntity {
  @ApiProperty()
  id: string

  @ApiProperty()
  number: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  projectId: string

  @ApiProperty()
  widgetId: string

  @ApiPropertyOptional()
  fullName?: string

  @ApiProperty({ type: RequestContact })
  contact: RequestContact

  @ApiProperty({ type: [String] })
  prizes: string[]

  @ApiProperty({ enum: ['new', 'processed', 'not_processed', 'used'] })
  status: 'new' | 'processed' | 'not_processed' | 'used'

  @ApiProperty({ enum: ['desktop', 'mobile_ios', 'mobile_android'] })
  device: 'desktop' | 'mobile_ios' | 'mobile_android'
}
