import { IsNotEmpty, IsString, MaxLength, IsUrl, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty({
    description: 'The title of the project',
    example: 'My Project'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string

  @ApiProperty({
    description: 'The website URL of the project',
    example: 'https://app.lemnity.ru'
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  websiteUrl: string

  @ApiProperty({
    description: 'Whether the project is enabled',
    example: true
  })
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean
}
