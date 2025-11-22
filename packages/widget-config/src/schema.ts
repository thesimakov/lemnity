import { z } from 'zod'

export const IconImageSchema = z.object({
  fileName: z.string().optional(),
  url: z.string().optional()
})

export const IconButtonSchema = z.object({
  text: z.string().min(1, 'Текст обязателен'),
  buttonColor: z.string(),
  textColor: z.string()
})

export const ColorScheme = z.enum(['primary', 'custom'])
export const ImagePosition = z.enum(['center', 'left', 'right'])

// Canonical display schema
export const DisplaySchema = z.object({
  icon: z.object({
    type: z.enum(['image', 'button']),
    image: IconImageSchema.optional(),
    button: IconButtonSchema.optional(),
    position: z.enum(['bottom-left', 'top-right', 'bottom-right']),
    hide: z.enum(['always', 'afterFormSending'])
  }),
  trigger: z.object({ start: z.enum(['onClick', 'timer']), timer: z.object({ delayMs: z.number() }).optional() }),
  conditions: z
    .object({
      showRules: z.object({
        onExit: z.boolean(),
        scrollBelow: z.object({ enabled: z.boolean(), percent: z.number().nonnegative().nullable() }),
        afterOpen: z.object({ enabled: z.boolean(), seconds: z.number().nonnegative().nullable() })
      }),
      frequency: z.object({ mode: z.enum(['everyPage', 'periodically']), value: z.number().nonnegative().optional(), unit: z.enum(['sec', 'min']).optional() }),
      dontShow: z.object({ afterWin: z.boolean(), afterShows: z.number().nonnegative().nullable() }),
      limits: z.object({ afterWin: z.boolean(), afterShows: z.number().nonnegative().nullable() })
    })
    .optional(),
  schedule: z
    .object({
      date: z.object({ enabled: z.boolean(), value: z.string() }),
      time: z.object({ enabled: z.boolean(), value: z.string() }),
      weekdays: z.object({ enabled: z.boolean(), days: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])), weekdaysOnly: z.boolean() })
    })
    .optional()
}).superRefine((val, ctx) => {
  if (val.trigger.start === 'onClick' && typeof val.schedule !== 'undefined') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['schedule'], message: 'schedule недопустим при onClick' })
  }
  if (val.trigger.start === 'timer' && typeof val.schedule === 'undefined') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['schedule'], message: 'schedule обязателен при timer' })
  }
  if (val.trigger.start === 'onClick' && typeof val.conditions !== 'undefined') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['conditions'], message: 'conditions недопустим при onClick' })
  }
  if (val.trigger.start === 'timer' && typeof val.conditions === 'undefined') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['conditions'], message: 'conditions обязателен при timer' })
  }
})

export const FormCanonicalSchema = z.object({
  companyLogo: z.object({ enabled: z.boolean(), fileName: z.string().optional(), url: z.string().optional() }),
  template: z.union([
    z.object({ enabled: z.literal(true), key: z.string().min(1) }),
    z.object({
      enabled: z.literal(false),
      templateSettings: z.object({
        image: z.object({ enabled: z.boolean().optional(), fileName: z.string().optional(), url: z.string().optional() }).optional(),
        contentPosition: z.enum(['left', 'right']),
        colorScheme: ColorScheme,
        windowFormat: z.enum(['sidePanel', 'modalWindow']),
        customColor: z.string().optional()
      })
    })
  ]),
  formTexts: z.object({ title: z.object({ text: z.string(), color: z.string() }), description: z.object({ text: z.string(), color: z.string() }), button: z.object({ text: z.string(), color: z.string(), backgroundColor: z.string(), icon: z.string() }) }),
  countdown: z.object({ enabled: z.boolean(), endDate: z.any().optional() }),
  contacts: z.object({ phone: z.object({ enabled: z.boolean(), required: z.boolean() }), email: z.object({ enabled: z.boolean(), required: z.boolean() }), name: z.object({ enabled: z.boolean(), required: z.boolean() }) }),
  agreement: z.object({ enabled: z.boolean(), text: z.string(), policyUrl: z.string(), agreementUrl: z.string(),color: z.string()}),
  adsInfo: z.object({ enabled: z.boolean(), text: z.string(), policyUrl: z.string(),color: z.string()}),
  link: z.string().optional(),
  border: z.object({ enabled: z.boolean(), color: z.string() }).optional(),
  sectors: z.object({
    randomize: z.boolean(),
    items: z.array(
      z.object({ 
        id: z.string(), 
        mode: z.enum(['text', 'icon']), 
        text: z.string().optional(), 
        icon: z.string().optional(), 
        color: z.string(), 
        promo: z.string().optional(), 
        chance: z.number().nonnegative().optional(), 
        isWin: z.boolean().optional(), 
        textSize: z.number().nonnegative().optional(), 
        iconSize: z.number().nonnegative().optional(),
        textColor: z.string().optional() }).superRefine((v, ctx) => {
        if (v.mode === 'text') {
          if (!v.text) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['text'], message: 'text обязателен при mode=text' })
          if (typeof v.icon !== 'undefined') ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icon'], message: 'icon не должен присутствовать при mode=text' })
        }
        if (v.mode === 'icon') {
          if (!v.icon) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icon'], message: 'icon обязателен при mode=icon' })
          if (typeof v.text !== 'undefined') ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['text'], message: 'text не должен присутствовать при mode=icon' })
        }
      })
    )
  }),
  messages: z.object({
    onWin: z.object({
      enabled: z.boolean(),
      text: z.string(),
      textSize: z.number().nonnegative(),
      description: z.string(),
      descriptionSize: z.number().nonnegative(),
      colorScheme: z.object({
        enabled: z.boolean(),
        scheme: ColorScheme,
        discount: z.object({ color: z.string(), bgColor: z.string() }).optional(),
        promo: z.object({ color: z.string(), bgColor: z.string() }).optional()
      })
    }),
    limitShows: z.object({ enabled: z.boolean(), text: z.string() }),
    limitWins: z.object({ enabled: z.boolean(), text: z.string() }),
    allPrizesGiven: z.object({ enabled: z.boolean(), text: z.string() })
  })
}).superRefine((val, ctx) => {
  if (!val.template.enabled) {
    const hasContentPosition = typeof val.template.templateSettings?.contentPosition !== 'undefined'
    if (val.template.templateSettings?.windowFormat === 'modalWindow' && !hasContentPosition) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['template', 'templateSettings', 'contentPosition'], message: 'contentPosition обязателен при windowFormat=modalWindow' })
    }
    if (val.template.templateSettings?.windowFormat === 'sidePanel' && hasContentPosition) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['template', 'templateSettings', 'contentPosition'], message: 'contentPosition недопустим при windowFormat=sidePanel' })
    }
  }
  const cs = val.messages.onWin.colorScheme
  if (cs.enabled && cs.scheme === 'custom') {
    if (!cs.discount) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['messages','onWin','colorScheme','discount'], message: 'Обязателен при пользовательской схеме' })
    if (!cs.promo) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['messages','onWin','colorScheme','promo'], message: 'Обязателен при пользовательской схеме' })
  }
})

const WidgetSchemaExtension = z.object({
  widget: z
    .object({
      countdown: z
        .object({
          imagePosition: ImagePosition.optional()
        })
        .optional(),
      borderColor: z.string().optional()
    })
    .optional()
})

export const WidgetSettingsSchema = z
  .object({
    id: z.string(),
    display: DisplaySchema,
    form: FormCanonicalSchema,
    integration: z.object({ scriptSnippet: z.string() })
  })
  .merge(WidgetSchemaExtension)

export type CanonicalWidgetSettings = z.infer<typeof WidgetSettingsSchema>

export function validateCanonical(settings: unknown): { ok: boolean; issues: { path: string; message: string }[] } {
  const parsed = WidgetSettingsSchema.safeParse(settings)
  if (parsed.success) return { ok: true, issues: [] }
  return { ok: false, issues: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) }
}


