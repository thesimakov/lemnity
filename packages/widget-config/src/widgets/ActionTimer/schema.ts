import { z } from 'zod'
import {
  ImagePositionSchema,
  type WidgetTypeId,
  buildWidgetSettingsSchema
} from '../base.js'

const WidgetType: WidgetTypeId = 'ACTION_TIMER'

const ActionTimerWidgetSchema = z.object({
  type: z.literal(WidgetType),
  countdown: z.object({
    textBeforeCountdown: z.string(),
    textBeforeCountdownColor: z.string(),
    badgeText: z.string(),
    badgeBackground: z.string(),
    badgeColor: z.string(),
    eventDate: z.iso.datetime(),
    enabled: z.boolean(),
    imageUrl: z.string().url().optional(),
    imagePosition: ImagePositionSchema
  })
})

export const actionTimerSchema = buildWidgetSettingsSchema(WidgetType, ActionTimerWidgetSchema)

