import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { CreateWidgetDto } from './dto/create-widget.dto'
import { UpdateWidgetDto } from './dto/update-widget.dto'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class WidgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWidgetDto: CreateWidgetDto, userId: string) {
    // Verify that the project belongs to the user
    const project = await this.prisma.project.findFirst({
      where: { id: createWidgetDto.projectId, userId }
    })

    if (!project) {
      throw new ForbiddenException('Project not found or access denied')
    }

    const data: Prisma.WidgetCreateInput = {
      name: createWidgetDto.name,
      type: createWidgetDto.type,
      enabled: createWidgetDto.enabled ?? false,
      config: createWidgetDto.config ?? Prisma.JsonNull,
      project: { connect: { id: createWidgetDto.projectId } }
    }

    return this.prisma.widget.create({ data })
  }

  async findAllByProject(projectId: string, userId: string) {
    // Verify that the project belongs to the user
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId }
    })

    if (!project) {
      throw new ForbiddenException('Project not found or access denied')
    }

    return this.prisma.widget.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findOne(id: string, userId: string) {
    const widget = await this.prisma.widget.findUnique({
      where: { id },
      include: { project: true }
    })

    if (!widget) {
      throw new NotFoundException('Widget not found')
    }

    // Verify that the widget's project belongs to the user
    if (widget.project.userId !== userId) {
      throw new ForbiddenException('Access denied')
    }

    return widget
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto, userId: string) {
    // First verify access
    await this.findOne(id, userId)

    const data: Prisma.WidgetUpdateInput = {}
    if (updateWidgetDto.name !== undefined) data.name = updateWidgetDto.name
    if (updateWidgetDto.type !== undefined) data.type = updateWidgetDto.type
    if (updateWidgetDto.enabled !== undefined) data.enabled = updateWidgetDto.enabled
    if (updateWidgetDto.config !== undefined) data.config = updateWidgetDto.config

    return this.prisma.widget.update({
      where: { id },
      data
    })
  }

  async remove(id: string, userId: string) {
    // First verify access
    await this.findOne(id, userId)

    return this.prisma.widget.delete({ where: { id } })
  }

  async toggleEnabled(id: string, enabled: boolean, userId: string) {
    // First verify access
    await this.findOne(id, userId)

    return this.prisma.widget.update({
      where: { id },
      data: { enabled }
    })
  }
}
