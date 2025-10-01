import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { CreateProjectResponse } from './entities/responses/create-project.entity'
import { GetProjectResponse } from './entities/responses/get-project.entity'
import { UpdateProjectResponse } from './entities/responses/update-project.entity'
import { DeleteProjectResponse } from './entities/responses/delete-project.entity'
import { ApiResponse } from '@nestjs/swagger'
import { ProjectsResponse } from './entities/responses/projects.entity'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiResponse({ status: 201, type: CreateProjectResponse })
  @Auth()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: string
  ): Promise<CreateProjectResponse> {
    return this.projectService.create(createProjectDto, userId)
  }

  @Get()
  @ApiResponse({ status: 200, type: ProjectsResponse })
  @Auth()
  findAll(@CurrentUser('id') userId: string): Promise<ProjectsResponse> {
    return this.projectService.findAll(userId).then(projects => ({ projects }))
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GetProjectResponse })
  @Auth()
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<GetProjectResponse | null> {
    return this.projectService.findOne(userId, id)
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateProjectResponse })
  @Auth()
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<UpdateProjectResponse> {
    return this.projectService.update(userId, id, updateProjectDto)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: DeleteProjectResponse })
  @Auth()
  remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<DeleteProjectResponse> {
    return this.projectService.remove(userId, id)
  }
}
