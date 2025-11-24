import type {
  MutableWidgetSettings,
  WidgetCanonicalizer
} from '../../canonicalizer.types.js'

const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null

const canonicalizeDisplaySurface = (settings: MutableWidgetSettings) => {
  const display = isObject(settings.display) ? settings.display : null
  if (!display) return

  const icon = isObject(display.icon) ? display.icon : null
  if (icon) {
    if (icon.type === 'image') {
      delete icon.button
    } else if (icon.type === 'button') {
      delete icon.image
    }
  }

  const frequency = isObject(display.frequency) ? display.frequency : null
  if (frequency?.mode === 'everyPage') {
    frequency.value = undefined
    frequency.unit = undefined
  }

  const dontShow = isObject(display.dontShow) ? display.dontShow : null
  if (dontShow?.afterWin) {
    dontShow.afterShows = null
  }
}

const canonicalizeFieldsSurface = (settings: MutableWidgetSettings) => {
  const fields = isObject(settings.fields) ? settings.fields : null
  if (!fields) return

  const template = isObject(fields.template) ? fields.template : null
  if (template) {
    if (template.enabled) {
      delete template.templateSettings
    } else {
      delete template.key
      const templateSettings = isObject(template.templateSettings) ? template.templateSettings : null
      if (templateSettings) {
        if (templateSettings.colorScheme !== 'custom') {
          delete templateSettings.customColor
        }
        const image = isObject(templateSettings.image) ? templateSettings.image : null
        if (image && image.enabled === false) {
          delete image.fileName
          delete image.url
        }
        if (templateSettings.windowFormat === 'sidePanel') {
          delete templateSettings.contentPosition
        }
      }
    }
  }

  const companyLogo = isObject(fields.companyLogo) ? fields.companyLogo : null
  if (companyLogo && companyLogo.enabled === false) {
    companyLogo.fileName = undefined
    companyLogo.url = undefined
  }

  const countdown = isObject(fields.countdown) ? fields.countdown : null
  if (countdown && countdown.enabled === false) {
    countdown.endDate = undefined
  }

  const messages = isObject(fields.messages) ? fields.messages : null
  const onWin = isObject(messages?.onWin) ? messages?.onWin : null
  const colorScheme = isObject(onWin?.colorScheme) ? onWin.colorScheme : null
  if (colorScheme?.scheme === 'primary') {
    delete colorScheme.discount
    delete colorScheme.promo
  }
}

const canonicalizeActionTimerWidget = (settings: MutableWidgetSettings) => {
  const widget = isObject(settings.widget) ? settings.widget : null
  if (!widget || widget.type !== 'ACTION_TIMER') return
  const countdown = isObject(widget.countdown) ? widget.countdown : null
  if (!countdown) return

  const eventDate = countdown.eventDate
  if (eventDate instanceof Date) {
    const ms = eventDate.getTime()
    if (!Number.isNaN(ms)) {
      countdown.eventDate = eventDate.toISOString()
    } else {
      countdown.eventDate = undefined
    }
  }
}

export const canonicalizeActionTimer: WidgetCanonicalizer = settings => {
  canonicalizeDisplaySurface(settings)
  canonicalizeFieldsSurface(settings)
  canonicalizeActionTimerWidget(settings)
  return settings
}


