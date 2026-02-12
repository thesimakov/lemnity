import { z } from 'zod'
import {
  IconEnum,
  LooseSurfaceSchema,
  type WidgetTypeId,
  buildWidgetSettingsSchema
} from '../base.js'

const WidgetType: WidgetTypeId = 'ANNOUNCEMENT'

const FormatEnum = z.enum(['countdown', 'announcement'])
const ContentEnum = z.enum(['imageOnTop', 'background', 'video'])
const ContentAlignmentEnum = z.enum(['top', 'center', 'bottom'])

export type Format = z.infer<typeof FormatEnum>
export type Content = z.infer<typeof ContentEnum>
export type ContentAlignment = z.infer<typeof ContentAlignmentEnum>
export type Icon = z.infer<typeof IconEnum>

const WidgetAppearenceSchema = z.object({
  format: FormatEnum,
  companyLogoEnabled: z.boolean(),
  companyLogoUrl: z.string().optional(),
  // will use system colors if not set
  backgroundColor: z
    .string()
    .optional(),
  borderRadius: z.number(),

  contentEnabled: z.boolean(),
  contentType: ContentEnum,
  contentAlignment: ContentAlignmentEnum.optional(),
  contentUrl: z
    .string()
    .optional(),
})

export type WidgetAppearence = z.infer<typeof WidgetAppearenceSchema>

const InfoSettingsSchema = z.object({
  title: z.string(),
  description: z.string(),

  countdownDate: z.string(),
  countdownEnabled: z.boolean(),
  countdownBackgroundColor: z.string().optional(),
  countdownFontColor: z.string().optional(),

  buttonText: z.string(),
  buttonFontColor: z.string(),
  buttonBackgroundColor: z.string(),
  icon: IconEnum,
  link: z.string(),
})

export type InfoSettings = z.infer<typeof InfoSettingsSchema>

const FormSettingsSchema = z.object({
  title: z.string(),
  titleFontColor: z.string(),
  description: z.string(),
  descriptionFontColor: z.string(),
  
  contactAcquisitionEnabled: z.boolean(),
  nameFieldEnabled: z.boolean(),
  nameFieldRequired: z.boolean(),
  emailFieldEnabled: z.boolean(),
  emailFieldRequired: z.boolean(),
  phoneFieldEnabled: z.boolean(),
  phoneFieldRequired: z.boolean(),

  agreementEnabled: z.boolean(),
  agreement: z.object({
    enabled: z.boolean(),
    policyUrl: z.string(),
    agreementUrl: z.string(),
    color: z.string()
  }),
  adsInfoEnabled: z.boolean(),
  adsInfo: z.object({
    enabled: z.boolean(),
    policyUrl: z.string(),
    color: z.string()
  }),
})

export type FormSettings = z.infer<typeof FormSettingsSchema>

const RewardMessageSettingsSchema = z.object({
  title: z.string(),
  titleFontSize: z
    .number()
    .nonnegative(),
  titleFontColor: z.string(),

  description: z.string(),
  descriptionFontSize: z
    .number()
    .nonnegative(),
  descriptionFontColor: z.string(),

  discount: z.string(),
  discountFontSize: z
    .number()
    .nonnegative(),
  discountFontColor: z.string(),

  promo: z.string(),
  promoFontSize: z
    .number()
    .nonnegative(),
  promoFontColor: z.string(),

  customColorSchemeEnabled: z.boolean(),
  customDiscountBackgroundColor: z.string().optional(),
  customPromoBackgroundColor: z.string().optional(),
})

export type RewardMessageSettings = z.infer<typeof RewardMessageSettingsSchema>

const AnnouncementWidgetSchema = z.object({
  type: z.literal(WidgetType),
  appearence: WidgetAppearenceSchema,
  infoSettings: InfoSettingsSchema.optional(),
  formSettings: FormSettingsSchema.optional(),
  rewardMessageSettings: RewardMessageSettingsSchema.optional(),
  brandingEnabled: z.boolean(),
})

export type AnnouncementWidget =
  z.infer<typeof AnnouncementWidgetSchema>

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
