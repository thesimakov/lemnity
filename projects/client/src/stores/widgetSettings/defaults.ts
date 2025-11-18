import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { DayKey, WidgetSettings } from './types'
import { getWidgetDefinitionBase } from './widgetDefinitions'

const defaultDays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const buildDefaults = (id: string, widgetType: WidgetTypeEnum): WidgetSettings => {
  const definition = getWidgetDefinitionBase(widgetType)

  return {
    id,
    widgetType,
    form: definition.buildFormSettings(),
    widget: definition.buildWidgetSettings(),
    display: {
      startShowing: 'onClick',
      timer: { delayMs: 20000 },
      icon: {
        type: 'image',
        image: { fileName: '', url: '' },
        button: { text: '', buttonColor: '#5951E5', textColor: '#FFFFFF' },
        position: 'bottom-left',
        hide: 'always'
      },
      weekdays: { enabled: true, days: defaultDays, weekdaysOnly: false },
      showRules: {
        onExit: false,
        scrollBelow: { enabled: false, percent: null },
        afterOpen: { enabled: false, seconds: null }
      },
      frequency: { mode: 'everyPage' },
      dontShow: { afterWin: false, afterShows: null },
      limits: { afterWin: false, afterShows: null },
      schedule: {
        date: { enabled: true, value: 'fromDate' },
        time: { enabled: true, value: 'fromTime' }
      }
    },
    integration: { scriptSnippet: '' }
  }
}

const allWidgetTypes: WidgetTypeEnum[] = Object.values(WidgetTypeEnum) as WidgetTypeEnum[]

export const STATIC_DEFAULTS_BY_TYPE: Record<WidgetTypeEnum, WidgetSettings> = Object.fromEntries(
  allWidgetTypes.map(widgetType => [widgetType, buildDefaults('', widgetType)])
) as Record<WidgetTypeEnum, WidgetSettings>

export const getStaticDefaults = (widgetType: WidgetTypeEnum): WidgetSettings =>
  STATIC_DEFAULTS_BY_TYPE[widgetType]
