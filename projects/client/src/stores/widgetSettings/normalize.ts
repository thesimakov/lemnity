import type { WidgetSettings } from './types'
import { mergeObjectsDeep } from './utils'

export function normalize(current: WidgetSettings, defaults: WidgetSettings): WidgetSettings {
  return mergeObjectsDeep(defaults, current)
}

export function trimInactiveBranches(s: WidgetSettings): WidgetSettings {
  const copy: WidgetSettings = structuredClone(s)
  if (copy.display.icon?.type === 'image') {
    const icon = copy.display.icon as Omit<typeof copy.display.icon, 'button'> & {
      button?: unknown
    }
    delete icon.button
  }
  if (copy.display.icon?.type === 'button') {
    const icon = copy.display.icon as Omit<typeof copy.display.icon, 'image'> & { image?: unknown }
    delete icon.image
  }

  if (copy.display.frequency.mode === 'everyPage') {
    delete copy.display.frequency.value
    delete copy.display.frequency.unit
  }

  if (copy.display.startShowing === 'onClick') {
    type DisplayWithOptionalTimer = Omit<typeof copy.display, 'timer'> & {
      timer?: { delayMs: number }
    }
    const d = copy.display as DisplayWithOptionalTimer
    delete d.timer
  }

  if (copy.form.template.enabled) {
    // При выборе шаблона храним только enabled=true и key (user settings удаляем)
    const templateRemoveSettings = copy.form.template as Omit<
      typeof copy.form.template,
      'templateSettings'
    > & { templateSettings?: unknown }
    delete templateRemoveSettings.templateSettings
  } else {
    // При пользовательских настройках удаляем key, оставляем templateSettings
    const templateRemoveKey = copy.form.template as Omit<typeof copy.form.template, 'key'> & {
      key?: unknown
    }
    delete templateRemoveKey.key

    const ts = copy.form.template.templateSettings as
      | (typeof copy.form.template.templateSettings & { customColor?: unknown })
      | undefined
    if (ts && ts.colorScheme !== 'custom') {
      delete (ts as { customColor?: unknown }).customColor
    }

    if (ts?.image && ts.image.enabled === false) {
      const img = ts.image as typeof ts.image & { fileName?: unknown; url?: unknown }
      delete img.fileName
      delete img.url
    }
  }

  if (copy.form.companyLogo.enabled === false) {
    delete copy.form.companyLogo.fileName
    delete copy.form.companyLogo.url
  }

  if (copy.form.countdown && copy.form.countdown.enabled === false) {
    delete copy.form.countdown.endDate
  }

  // // Agreement/AdsInfo: если выключены — обнуляем текстовые поля
  // if (copy.form.agreement && copy.form.agreement.enabled === false) {
  //   const a = copy.form.agreement as typeof copy.form.agreement & { text?: string; policyUrl?: string }
  //   delete a.text
  //   delete a.policyUrl
  // }
  // if (copy.form.adsInfo && copy.form.adsInfo.enabled === false) {
  //   const a = copy.form.adsInfo as typeof copy.form.adsInfo & { text?: string; policyUrl?: string }
  //   delete a.text
  //   delete a.policyUrl
  // }

  // // Messages: для выключенных сообщений удаляем текст
  // const msg = copy.form.messages as typeof copy.form.messages & {
  //   onWin?: { enabled: boolean; text?: string }
  //   limitShows?: { enabled: boolean; text?: string }
  //   limitWins?: { enabled: boolean; text?: string }
  //   allPrizesGiven?: { enabled: boolean; text?: string }
  // }
  // if (msg.onWin && msg.onWin.enabled === false) delete msg.onWin.text
  // if (msg.limitShows && msg.limitShows.enabled === false) delete msg.limitShows.text
  // if (msg.limitWins && msg.limitWins.enabled === false) delete msg.limitWins.text
  // if (msg.allPrizesGiven && msg.allPrizesGiven.enabled === false) delete msg.allPrizesGiven.text

  copy.form.sectors.items = copy.form.sectors.items.map(item => {
    const next = { ...item } as typeof item & {
      promo?: string | undefined
      chance?: number | undefined
    }
    if (!next.promo) delete next.promo
    if (typeof next.chance === 'undefined' || Number.isNaN(next.chance)) delete next.chance

    if (next.mode === 'text') {
      delete (next as { icon?: unknown }).icon
    } else if (next.mode === 'icon') {
      delete (next as { text?: unknown }).text
    }
    return next
  })

  if (copy.display.dontShow.afterWin) {
    copy.display.dontShow.afterShows = null
  }

  return copy
}

export function canonicalize(s: WidgetSettings): WidgetSettings {
  const out: WidgetSettings = structuredClone(s)
  // Сформировать каноническую структуру display
  const trigger =
    out.display.startShowing === 'timer'
      ? { start: 'timer' as const, timer: out.display.timer }
      : { start: 'onClick' as const }
  const conditions =
    out.display.startShowing === 'timer'
      ? {
          showRules: out.display.showRules,
          frequency: out.display.frequency,
          dontShow: out.display.dontShow,
          limits: out.display.limits
        }
      : undefined
  const schedule =
    out.display.startShowing === 'timer'
      ? {
          date: out.display.schedule.date,
          time: out.display.schedule.time,
          weekdays: out.display.weekdays
        }
      : undefined
  // Пересобрать display согласно канон-схеме
  // Примечание: icon остаётся неизменным (после trimInactiveBranches)
  // Тип WidgetSettings здесь соответствует текущей форме; канон. форма проверяется схемой при сохранении
  const rebuilt: { icon: unknown; trigger: unknown; conditions?: unknown; schedule?: unknown } = {
    icon: out.display.icon,
    trigger
  }
  if (conditions) rebuilt.conditions = conditions
  if (schedule) rebuilt.schedule = schedule
  ;(out as unknown as { display: unknown }).display = rebuilt

  // Канонизировать form.template согласно правилам схемы
  if (out.form.template.enabled) {
    // preset-режим: только enabled и key
    const keyOnly = { enabled: true as const, key: out.form.template.key ?? '' }
    ;(out as unknown as { form: typeof out.form }).form = {
      ...out.form,
      template: keyOnly
    }
  } else {
    // пользовательские настройки: только enabled=false и templateSettings
    const tsOnly = { enabled: false as const, templateSettings: out.form.template.templateSettings }
    ;(out as unknown as { form: typeof out.form }).form = {
      ...out.form,
      template: tsOnly
    }
  }
  return out
}

// Convert canonical server shape into UI WidgetSettings shape using provided defaults
export function fromCanonical(canonical: unknown, defaults: WidgetSettings): WidgetSettings {
  const canonicalScheme = canonical as Record<string, unknown> | null | undefined
  if (!canonicalScheme) return defaults

  const out: WidgetSettings = structuredClone(defaults)

  // form
  const form = (canonicalScheme as { form?: Record<string, unknown> }).form
  if (form) {
    const tpl = (form as { template?: Record<string, unknown> }).template
    if (tpl && Object.prototype.hasOwnProperty.call(tpl, 'key')) {
      // preset mode
      const key = (tpl as { key?: string }).key ?? ''
      ;(out as unknown as { form: typeof out.form }).form = {
        ...out.form,
        ...(form as typeof out.form),
        template: { enabled: true, key }
      }
    } else if (tpl) {
      // custom mode
      const ts = (tpl as { templateSettings?: unknown }).templateSettings
      ;(out as unknown as { form: typeof out.form }).form = {
        ...out.form,
        ...(form as typeof out.form),
        template: {
          enabled: false,
          templateSettings:
            (ts as typeof out.form.template.templateSettings) ?? out.form.template.templateSettings
        }
      }
    } else {
      ;(out as unknown as { form: typeof out.form }).form = {
        ...out.form,
        ...(form as typeof out.form)
      }
    }
  }

  // display
  const display = (canonicalScheme as { display?: Record<string, unknown> }).display
  if (display) {
    const trigger = (display as { trigger?: { start?: string; timer?: unknown } }).trigger
    const conditions = (display as { conditions?: unknown }).conditions
    const schedule = (
      display as { schedule?: { date?: unknown; time?: unknown; weekdays?: unknown } }
    ).schedule
    const icon = (display as { icon?: unknown }).icon

    const startShowing = trigger?.start === 'timer' ? 'timer' : 'onClick'
    const timer =
      trigger?.start === 'timer'
        ? ((trigger?.timer as typeof out.display.timer) ?? out.display.timer)
        : out.display.timer
    ;(out as unknown as { display: typeof out.display }).display = {
      ...out.display,
      icon: (icon as typeof out.display.icon) ?? out.display.icon,
      startShowing,
      timer,
      showRules:
        (conditions as { showRules?: typeof out.display.showRules })?.showRules ??
        out.display.showRules,
      frequency:
        (conditions as { frequency?: typeof out.display.frequency })?.frequency ??
        out.display.frequency,
      dontShow:
        (conditions as { dontShow?: typeof out.display.dontShow })?.dontShow ??
        out.display.dontShow,
      limits: (conditions as { limits?: typeof out.display.limits })?.limits ?? out.display.limits,
      weekdays: (schedule?.weekdays as typeof out.display.weekdays) ?? out.display.weekdays,
      schedule: {
        date: (schedule?.date as typeof out.display.schedule.date) ?? out.display.schedule.date,
        time: (schedule?.time as typeof out.display.schedule.time) ?? out.display.schedule.time
      }
    }
  }

  return out
}
