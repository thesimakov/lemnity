import { WidgetTypeEnum } from '@lemnity/api-sdk'
import { z } from 'zod'

export const IconButtonSchema = z.object({
  text: z.string().min(1, 'Текст обязателен'),
  buttonColor: z.string(),
  textColor: z.string()
})

export const IconImageSchema = z.object({
  fileName: z.string().optional(),
  url: z.string().optional()
})

export const ColorScheme = z.enum(['primary', 'custom'])
export const ImagePositionSchema = z.enum(['center', 'left', 'right'])

export const DisplaySchemaBase = z
  .object({
    icon: z.object({
      type: z.enum(['image', 'button']),
      image: IconImageSchema.optional(),
      button: IconButtonSchema.optional(),
      position: z.enum(['bottom-left', 'top-right', 'bottom-right']),
      hide: z.enum(['always', 'afterFormSending'])
    }),
    startShowing: z.enum(['onClick', 'timer']),
    timer: z.object({ delayMs: z.number() }),
    weekdays: z.object({
      enabled: z.boolean(),
      days: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])),
      weekdaysOnly: z.boolean()
    }),
    showRules: z.object({
      onExit: z.boolean(),

      scrollBelow: z.object({ enabled: z.boolean(), percent: z.number().nonnegative().nullable() }),
      afterOpen: z.object({ enabled: z.boolean(), seconds: z.number().nonnegative().nullable() })
    }),
    frequency: z.object({
      mode: z.enum(['everyPage', 'periodically']),

      value: z.number().nonnegative().optional(),
      unit: z.enum(['sec', 'min']).optional()
    }),

    dontShow: z.object({ afterWin: z.boolean(), afterShows: z.number().nonnegative().nullable() }),
    limits: z.object({ afterWin: z.boolean(), afterShows: z.number().nonnegative().nullable() }),
    schedule: z.object({
      date: z.object({ enabled: z.boolean(), value: z.string() }),
      time: z.object({ enabled: z.boolean(), value: z.string() })
    })
  })
  .superRefine((val, ctx) => {
    // enabled=true → значения обязаны быть заданы (не null)
    if (val.showRules.scrollBelow.enabled && val.showRules.scrollBelow.percent == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['showRules', 'scrollBelow', 'percent'],
        message: 'percent обязателен, когда включено'
      })
    }
    if (val.showRules.afterOpen.enabled && val.showRules.afterOpen.seconds == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['showRules', 'afterOpen', 'seconds'],
        message: 'seconds обязателен, когда включено'
      })
    }
    if (val.frequency.mode === 'periodically') {
      if (typeof val.frequency.value === 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['frequency', 'value'],
          message: 'value обязателен при periodically'
        })
      }
      if (typeof val.frequency.unit === 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['frequency', 'unit'],
          message: 'unit обязателен при periodically'
        })
      }
    }
  })

export const FormSchema = z
  .object({
    companyLogo: z.object({
      enabled: z.boolean(),
      fileName: z.string().optional(),
      url: z.url('Файл отсутствует или некорректен').optional()
    }),
    template: z.object({
      enabled: z.boolean(),
      key: z.string().min(1, 'Выберите шаблон').optional(),
      templateSettings: z
        .object({
          image: z
            .object({
              enabled: z.boolean().optional(),
              fileName: z.string().optional(),
              url: z.url().optional()
            })
            .optional(),
          contentPosition: z.enum(['left', 'right']),
          colorScheme: z.enum(['primary', 'custom']),
          customColor: z.string().optional()
        })
        .optional()
    }),
    formTexts: z.object({
      title: z.object({ text: z.string(), color: z.string() }),
      description: z.object({ text: z.string(), color: z.string() }),
      button: z.object({
        text: z.string(),
        color: z.string(),
        backgroundColor: z.string(),
        icon: z.string()
      })
    }),
    countdown: z.object({ enabled: z.boolean(), endDate: z.any().optional() }),
    contacts: z.object({
      phone: z.object({ enabled: z.boolean(), required: z.boolean() }),
      email: z.object({ enabled: z.boolean(), required: z.boolean() }),
      name: z.object({ enabled: z.boolean(), required: z.boolean() })
    }),
    agreement: z.object({
      enabled: z.boolean(),
      text: z.string(),
      policyUrl: z.string(),
      agreementUrl: z.string(),
      color: z.string()
    }),
    adsInfo: z.object({
      enabled: z.boolean(),
      text: z.string(),
      policyUrl: z.string(),
      color: z.string()
    }),
    link: z.string().optional(),
    border: z
      .object({
        enabled: z.boolean(),
        color: z.string()
      })
      .optional(),
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
          discount: z
            .object({
              color: z.string(),
              bgColor: z.string()
            })
            .optional(),
          promo: z
            .object({
              color: z.string(),
              bgColor: z.string()
            })
            .optional()
        })
      })
    })
  })
  .superRefine((val, ctx) => {
    // Ветка выбора шаблона: enabled=true → только key, templateSettings отсутствуют
    if (val.template.enabled) {
      if (!val.template.key || val.template.key.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['template', 'key'],
          message: 'Выберите шаблон'
        })
      }
      if (typeof val.template.templateSettings !== 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['template', 'templateSettings'],
          message: 'templateSettings недопустимы при enabled=true'
        })
      }
    } else {
      // Пользовательские настройки: enabled=false → должны быть templateSettings, key отсутствует
      if (typeof val.template.templateSettings === 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['template', 'templateSettings'],
          message: 'templateSettings обязателен при enabled=false'
        })
      }
      if (typeof val.template.key !== 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['template', 'key'],
          message: 'key недопустим при enabled=false'
        })
      }
      const ts = val.template.templateSettings
      if (ts) {
        if (ts.colorScheme === 'custom' && (!ts.customColor || ts.customColor.length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['template', 'templateSettings', 'customColor'],
            message: 'customColor обязателен при colorScheme=custom'
          })
        }
        if (ts.image?.enabled && !ts.image?.url) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['template', 'templateSettings', 'image', 'url'],
            message: 'Файл отсутствует или некорректен'
          })
        }
      }
    }
    // Agreement / AdsInfo: если включено, текст и url обязательны
    if (val.agreement.enabled) {
      if (!val.agreement.text || val.agreement.text.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['agreement', 'text'],
          message: 'Текст обязателен'
        })
      }
      if (!val.agreement.policyUrl || val.agreement.policyUrl.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['agreement', 'policyUrl'],
          message: 'URL обязателен'
        })
      }
    }
    if (val.adsInfo.enabled) {
      if (!val.adsInfo.text || val.adsInfo.text.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['adsInfo', 'text'],
          message: 'Текст обязателен'
        })
      }
      if (!val.adsInfo.policyUrl || val.adsInfo.policyUrl.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['adsInfo', 'policyUrl'],
          message: 'URL обязателен'
        })
      }
    }
  })

export const IntegrationSchema = z.object({ scriptSnippet: z.string() })

const WheelSectorSchema = z
  .object({
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
    textColor: z.string().optional()
  })
  .superRefine((v, ctx) => {
    if (v.mode === 'text') {
      if (!v.text) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['text'],
          message: 'Введите текст для сектора'
        })
      }
      if (typeof v.icon !== 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['icon'],
          message: 'Иконка не может быть выбрана при режиме текста'
        })
      }
    }
    if (v.mode === 'icon') {
      if (!v.icon) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['icon'],
          message: 'Выберите иконку для сектора'
        })
      }
      if (typeof v.text !== 'undefined') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['text'],
          message: 'Сектор не может иметь текст в режиме иконки'
        })
      }
    }
  })

const WheelWidgetSchema = z.object({
  type: z.literal(WidgetTypeEnum.WHEEL_OF_FORTUNE),
  sectors: z.object({
    randomize: z.boolean(),
    items: z.array(WheelSectorSchema)
  })
})

const ActionTimerWidgetSchema = z.object({
  type: z.literal(WidgetTypeEnum.ACTION_TIMER),
  countdown: z.object({
    textBeforeCountdown: z.string(),
    badgeText: z.string(),
    badgeBackground: z.string(),
    badgeColor: z.string(),
    eventDate: z.date(),
    enabled: z.boolean(),
    textBeforeCountdownColor: z.string(),
    imageUrl: z.string().url().optional(),
    imagePosition: ImagePositionSchema
  })
})

const WidgetSchemaBase = z.union([WheelWidgetSchema, ActionTimerWidgetSchema])

const ensureWidgetMatchesType = (
  widgetType: WidgetTypeEnum,
  widget: z.infer<typeof WidgetSchemaBase>,
  ctx: z.RefinementCtx
) => {
  if (widget.type !== widgetType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['widget', 'type'],
      message: 'Тип виджета не соответствует widgetType'
    })
  }
}

export const WidgetSettingsSchemaOld = z
  .object({
    id: z.string(),
    widgetType: z.nativeEnum(WidgetTypeEnum),
    widget: WidgetSchemaBase,
    display: DisplaySchemaBase,
    form: FormSchema,
    integration: IntegrationSchema
  })
  .superRefine((val, ctx) => ensureWidgetMatchesType(val.widgetType, val.widget, ctx))

export const DisplaySchema = z
  .object({
    icon: DisplaySchemaBase.shape.icon,
    trigger: z.object({
      start: z.enum(['onClick', 'timer']),
      timer: z.object({ delayMs: z.number() }).optional()
    }),
    conditions: z
      .object({
        showRules: DisplaySchemaBase.shape.showRules,
        frequency: DisplaySchemaBase.shape.frequency,
        dontShow: DisplaySchemaBase.shape.dontShow,
        limits: DisplaySchemaBase.shape.limits
      })
      .optional(),
    schedule: z
      .object({
        date: DisplaySchemaBase.shape.schedule.shape.date,
        time: DisplaySchemaBase.shape.schedule.shape.time,
        weekdays: DisplaySchemaBase.shape.weekdays
      })
      .optional()
  })
  .superRefine((val, ctx) => {
    if (val.trigger.start === 'onClick' && typeof val.schedule !== 'undefined') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['schedule'],
        message: 'schedule недопустим при onClick'
      })
    }
    if (val.trigger.start === 'timer' && typeof val.schedule === 'undefined') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['schedule'],
        message: 'schedule обязателен при timer'
      })
    }
    if (val.trigger.start === 'onClick' && typeof val.conditions !== 'undefined') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['conditions'],
        message: 'conditions недопустим при onClick'
      })
    }
    if (val.trigger.start === 'timer' && typeof val.conditions === 'undefined') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['conditions'],
        message: 'conditions обязателен при timer'
      })
    }
  })

export const WidgetSettingsSchema = z
  .object({
    id: z.string(),
    widgetType: z.nativeEnum(WidgetTypeEnum),
    widget: WidgetSchemaBase,
    display: DisplaySchema,
    form: FormSchema,
    integration: IntegrationSchema
  })
  .superRefine((val, ctx) => ensureWidgetMatchesType(val.widgetType, val.widget, ctx))

export type Issue = { path: string; message: string }

// Валидация канонической формы (после canonicalize)
export function validateWidgetSettingsCanonical(settings: unknown): {
  ok: boolean
  issues: Issue[]
} {
  const parsed = WidgetSettingsSchema.safeParse(settings)
  if (parsed.success) return { ok: true, issues: [] }
  const issues = parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
  return { ok: false, issues }
}

// Валидация текущей плоской формы (то, что в сторе/дефолтах)
export function validateWidgetSettingsCurrent(settings: unknown): { ok: boolean; issues: Issue[] } {
  const parsed = WidgetSettingsSchemaOld.safeParse(settings)
  if (parsed.success) return { ok: true, issues: [] }
  const issues = parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
  return { ok: false, issues }
}
