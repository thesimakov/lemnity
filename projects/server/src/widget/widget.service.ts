import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { CreateWidgetDto } from './dto/create-widget.dto'
import { UpdateWidgetDto } from './dto/update-widget.dto'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'
import { ConfigService } from '../config/config.service'
import { migrateToCurrent, CURRENT_VERSION } from '@lemnity/widget-config'

@Injectable()
export class WidgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

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
      project: { connect: { id: createWidgetDto.projectId } }
    }

    if (createWidgetDto.config !== undefined) {
      const { data: canonical, version } = this.configService.validateAndCanonicalize(
        createWidgetDto.config as unknown
      )

      data.config = canonical as Prisma.InputJsonValue
      ;(data as { configVersion?: number | null }).configVersion = version
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

    const widgets = await this.prisma.widget.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })

    // Migrate configs on read so clients always get the latest canonical shape
    return widgets.map(w => {
      if (!w.config) return w
      const { data, version } = migrateToCurrent(w.config as unknown, w.configVersion ?? undefined)
      return { ...w, config: data as Prisma.JsonValue, configVersion: version ?? CURRENT_VERSION }
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

    // Return migrated config so the client always sees the latest shape
    if (widget.config) {
      const { data, version } = migrateToCurrent(
        widget.config as unknown,
        widget.configVersion ?? undefined
      )
      return {
        ...widget,
        config: data as Prisma.JsonValue,
        configVersion: version ?? CURRENT_VERSION
      }
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
    if (updateWidgetDto.config !== undefined) {
      // validate + migrate, persist config + version in the same update
      const { data: canonicalConfig, version } = this.configService.validateAndCanonicalize(
        updateWidgetDto.config as unknown
      )
      data.config = canonicalConfig as Prisma.InputJsonValue
      ;(data as { configVersion?: number | null }).configVersion = version
    }

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
