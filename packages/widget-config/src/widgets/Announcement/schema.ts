import { z } from 'zod'
import {
  LooseSurfaceSchema,
  type WidgetTypeId,
  buildWidgetSettingsSchema
} from '../base.js'

const WidgetType: WidgetTypeId = 'ANNOUNCEMENT'

const AnnouncementWidgetSchema = z.object({
  type: z.literal(WidgetType)
})

const customSurfaces = {
  fields: LooseSurfaceSchema,
  display: LooseSurfaceSchema,
  integration: LooseSurfaceSchema
} as const

export const announcementSchema = buildWidgetSettingsSchema(
  WidgetType,
  AnnouncementWidgetSchema,
  customSurfaces
)
