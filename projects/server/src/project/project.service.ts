import { Injectable } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto, userId: string) {
    const project: Prisma.ProjectCreateInput = {
      title: createProjectDto.title,
      websiteUrl: createProjectDto.websiteUrl,
      enabled: createProjectDto.enabled,
      user: { connect: { id: userId } }
    }

    return this.prisma.project.create({
      data: project,
      include: { widgets: true }
    })
  }

  findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: { widgets: true }
    })
  }

  findOne(userId: string, id: string) {
    return this.prisma.project.findFirst({
      where: { id, userId },
      include: { widgets: true }
    })
  }

  update(userId: string, id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id, userId },
      data: updateProjectDto,
      include: { widgets: true }
    })
  }

  remove(userId: string, id: string) {
    return this.prisma.project.delete({
      where: { id, userId },
      include: { widgets: true }
    })
  }
}
