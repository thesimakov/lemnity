import { ApiProperty } from '@nestjs/swagger'
import { Project } from '../project.entity'

export class ProjectsResponse {
  @ApiProperty({ type: [Project] })
  projects: Project[]
}
