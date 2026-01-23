import { z } from 'zod'
import {
  LooseSurfaceSchema,
  type WidgetTypeId,
  buildWidgetSettingsSchema
} from '../base.js'

const FABMenuIconEnum = z.enum([
  'email',
  'phone',
  'website',
  'calendar',
  'vk',
  'vk-message',
  'telegram-message',
  'telegram-channel',
  'max-message',
  'whatsapp-message',
  'instagram',
  'youtube',
  'ok',
  'custom'
])

const FABMenuTriggerIconEnum = z.enum([
  "Balloon",
  "Basket",
  "Fish",
  "Flame",
  "Flower",
  "GameController",
  "Hammer",
  "Heart",
  "Key",
  "Moon",
  "Nuclear",
  "Paw",
  "Pizza",
  "Restaurant",
  "Rocket",
  "Send",
  "Sparkles",
  "Star",
  "Sunny",
  "Reload",
  "HeartDislike"
])

const FABMenuPayloadTypeEnum = z.enum([
  'email',
  'phone',
  'link',
  'nickname',
  'script',
  'anchor'
])

const FABMenuSectorSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: FABMenuIconEnum,
  payload: z.object({
    type: FABMenuPayloadTypeEnum,
    value: z.string(),
    helper: z.string().optional()
  }),
  color: z.string(),
  description: z.string().optional()
})

const WidgetType: WidgetTypeId = 'FAB_MENU'

const FABMenuWidgetSchema = z.object({
  type: z.literal(WidgetType),
  sectors: z.object({
    items: z.array(FABMenuSectorSchema)
  }),
  triggerTextColor: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      'Цвет должен быть в HEX формате'
    ),
  triggerBackgroundColor: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      'Цвет должен быть в HEX формате'
    ),
  triggerText: z
    .string()
    .max(20, 'Текст должен быть не длиннее 20 символов'),
  triggerIcon: FABMenuTriggerIconEnum
})

const customSurfaces = {
  fields: LooseSurfaceSchema,
  display: LooseSurfaceSchema,
  integration: LooseSurfaceSchema
} as const

export const fabMenuSchema = buildWidgetSettingsSchema(
  WidgetType,
  FABMenuWidgetSchema,
  customSurfaces
)

