import { z } from 'zod'
import {
  buildWidgetSettingsSchema,
  IconEnum,
  LooseSurfaceSchema,
  type WidgetTypeId
} from '../base.js'

const WidgetType: WidgetTypeId = 'NOTIFICATION'

const ExpirationEnum = z.enum(['6', '12', '24', '48'])

export type Expiration = z.infer<typeof ExpirationEnum>

const NotificationSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .max(150, 'Текст должен быть не длиннее 100 символов'),
  urlText: z
    .string()
    .max(20, 'Текст должен быть не длиннее 20 символов'),
  url: z.string(),
  urlFontSize: z
    .number()
    .min(0, 'Размер текста не может быть отрицательным'),
  expiration: ExpirationEnum,
})

export type Notification = z.infer<typeof NotificationSchema>

const NotificationWidgetSchema = z.object({
  type: z.literal(WidgetType),
  triggerText: z
    .string()
    .max(25, 'Текст должен быть не длиннее 25 символов'),
  triggerTextColor: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      'Цвет должен быть в HEX формате'
    ),
  triggerIcon: IconEnum,
  triggerBackgroundColor: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      'Цвет должен быть в HEX формате'
    ),

  delay: z
    .number()
    .min(0, 'Временной промежуток не может быть отприцательным'),

  notifications: z.array(NotificationSchema),

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
