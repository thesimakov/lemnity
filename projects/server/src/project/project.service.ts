import { Injectable } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'
import { migrateToCurrent, CURRENT_VERSION } from '@lemnity/widget-config'

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
    }).then(projects => projects.map(p => this.migrateProjectWidgets(p)))
  }

  findOne(userId: string, id: string) {
    return this.prisma.project.findFirst({
      where: { id, userId },
      include: { widgets: true }
    }).then(p => (p ? this.migrateProjectWidgets(p) : p))
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

  private migrateProjectWidgets<T extends { widgets?: Array<{ config: unknown; configVersion: number | null }> }>(
    project: T
  ): T {
    if (!project.widgets || project.widgets.length === 0) return project
    const widgets = project.widgets.map(w => {
      if (!w.config) return w
      const { data, version } = migrateToCurrent(w.config as unknown, w.configVersion ?? undefined)
      return { ...w, config: data as Prisma.JsonValue, configVersion: version ?? CURRENT_VERSION }
    }) as T['widgets']
    return { ...(project as any), widgets } as T
  }
}
