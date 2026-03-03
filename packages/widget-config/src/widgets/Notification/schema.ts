import { z } from 'zod'
import {
  buildWidgetSettingsSchema,
  LooseSurfaceSchema,
  type WidgetTypeId
} from '../base.js'

const WidgetType: WidgetTypeId = 'NOTIFICATION'

const NotificationWidgetSchema = z.object({
  type: z.literal(WidgetType),
  brandingEnabled: z.boolean(),
})

export type NotificationWidgetType =
  z.infer<typeof NotificationWidgetSchema>

const customSurfaces = {
  fields: LooseSurfaceSchema,
  display: LooseSurfaceSchema,
  integration: LooseSurfaceSchema,
} as const

export const notificationSchema = buildWidgetSettingsSchema(
  WidgetType,
  NotificationWidgetSchema,
  customSurfaces
)
