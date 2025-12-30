import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import type { CreatePublicRequestDto } from './dto/create-public-request.dto'
import type { ListRequestsDto } from './dto/list-requests.dto'
import type { UpdateRequestDto } from './dto/update-request.dto'
import type { Request as DbRequest } from '@lemnity/database'
import { subDays } from 'date-fns'
import type { RequestEntity } from './entities/request.entity'

const buildRequestNumber = (seq: number) => `${String(seq).padStart(4, '0')}`

const sanitizeString = (value: string | undefined) => {
  const v = value?.trim()
  return v ? v : undefined
}

const guessDeviceFromUserAgent = (userAgent: string | undefined) => {
  const ua = (userAgent ?? '').toLowerCase()
  if (!ua) return 'desktop' as const
  if (ua.includes('android')) return 'mobile_android' as const
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios'))
    return 'mobile_ios' as const
  return 'desktop' as const
}

const toEntity = (r: DbRequest): RequestEntity => ({
  id: r.id,
  number: buildRequestNumber(r.seq),
  createdAt: r.createdAt.toISOString(),
  projectId: r.projectId,
  widgetId: r.widgetId,
  fullName: r.fullName ?? undefined,
  contact: {
    phone: r.phone ?? undefined,
    email: r.email ?? undefined
  },
  prizes: r.prizes ?? [],
  status: r.status,
  device: r.device
})

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async createPublic(dto: CreatePublicRequestDto, meta: { ip?: string; userAgent?: string }) {
    const widgetId = sanitizeString(dto.widgetId)
    if (!widgetId) throw new BadRequestException('widgetId is required')

    const widget = await this.prisma.widget.findFirst({
      where: { id: widgetId, enabled: true, project: { enabled: true } },
      select: { id: true, projectId: true }
    })
    if (!widget) throw new NotFoundException('Widget not found')

    const userAgent = sanitizeString(dto.userAgent ?? meta.userAgent)

    const created = await this.prisma.request.create({
      data: {
        widget: { connect: { id: widget.id } },
        project: { connect: { id: widget.projectId } },
        fullName: sanitizeString(dto.fullName),
        phone: sanitizeString(dto.phone),
        email: sanitizeString(dto.email),
        prizes: (dto.prizes ?? []).filter(Boolean),
        status: 'new',
        device: dto.device ?? guessDeviceFromUserAgent(userAgent),
        url: sanitizeString(dto.url),
        referrer: sanitizeString(dto.referrer),
        userAgent,
        ip: sanitizeString(meta.ip)
      }
    })

    return toEntity(created)
  }

  async list(userId: string, query: ListRequestsDto) {
    const period = query.period ?? '30d'
    const take = query.take ?? 50
    const skip = query.skip ?? 0

    const createdAtFilter = (() => {
      if (period === 'all') return undefined
      if (period === '7d') return { gte: subDays(new Date(), 7) }
      if (period === '90d') return { gte: subDays(new Date(), 90) }
      return { gte: subDays(new Date(), 30) }
    })()

    const where = {
      project: { userId },
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {})
    } as const

    const [items, total] = await Promise.all([
      this.prisma.request.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      this.prisma.request.count({ where })
    ])

    return { requests: items.map(toEntity), total }
  }

  async update(userId: string, id: string, dto: UpdateRequestDto) {
    const existing = await this.prisma.request.findFirst({
      where: { id, project: { userId } }
    })
    if (!existing) throw new NotFoundException('Request not found')

    const updated = await this.prisma.request.update({
      where: { id: existing.id },
      data: { status: dto.status }
    })

    return toEntity(updated)
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.request.findFirst({
      where: { id, project: { userId } },
      select: { id: true }
    })
    if (!existing) throw new NotFoundException('Request not found')
    await this.prisma.request.delete({ where: { id: existing.id } })
    return { id: existing.id }
  }
}
