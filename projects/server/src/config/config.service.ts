import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  CURRENT_VERSION,
  migrateToCurrent,
  validateCanonical,
  type CanonicalWidgetSettings
} from '@lemnity/widget-config'

@Injectable()
export class ConfigService {
  constructor(private readonly prisma: PrismaService) {}

  validateAndCanonicalize(raw: unknown): { data: CanonicalWidgetSettings; version: number } {
    const migrated = migrateToCurrent(raw)
    const validation = validateCanonical(migrated.data)
    if (!validation.ok) {
      throw new BadRequestException({ message: 'Invalid widget config', issues: validation.issues })
    }
    return { data: migrated.data as CanonicalWidgetSettings, version: CURRENT_VERSION }
  }

  // async save(widgetId: string, raw: unknown) {
  //   const { data, version } = this.validateAndCanonicalize(raw)
  //   return this.prisma.widget.update({ where: { id: widgetId }, data: { config: data, configVersion: version } })
  // }
}
