import { ApiProperty } from '@nestjs/swagger'
import { Widget } from '../../widget/entities/widget.entity'

export class Project {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() websiteUrl: string
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
  @ApiProperty() enabled: boolean
  @ApiProperty({ type: [Widget], required: false }) widgets?: Widget[]
}
