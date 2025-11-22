import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { FormSettings, StubWidgetSettings, WidgetSpecificSettings } from './types'
import {
  buildWheelWidgetSettings,
  buildWheelFormSettings
} from '@/layouts/Widgets/WheelOfFortune/defaults'
import {
  buildActionTimerWidgetSettings,
  buildActionTimerFormSettings
} from '@/layouts/Widgets/CountDown/defaults'
import {
  buildFABMenuWidgetSettings,
  buildFABMenuFormSettings
} from '@/layouts/Widgets/FABMenu/defaults'
import { resolveWidgetDefinition } from './resolveWidgetDefinition'

export type WidgetDefinitionBase = {
  type: WidgetTypeEnum
  buildWidgetSettings: () => WidgetSpecificSettings
  buildFormSettings: () => FormSettings
}

/**
 * Creates a stub widget settings builder for unimplemented widget types.
 * Возвращает минимальную структуру, чтобы подсветить, что виджет ещё не реализован.
 */
const buildStubWidgetSettings = (widgetType: WidgetTypeEnum): StubWidgetSettings => ({
  type: widgetType,
  stub: true,
  message: `Widget ${widgetType} is not yet implemented`
})

/**
 * Создаёт FormSettings для нереализованных виджетов.
 * Используется только как заглушка до полноценной реализации.
 */
const buildStubFormSettings = (): FormSettings => ({
  companyLogo: { enabled: true, fileName: '', url: '' },
  template: {
    enabled: false,
    key: '',
    templateSettings: {
      image: { enabled: false, fileName: '', url: '' },
      windowFormat: 'modalWindow',
      contentPosition: 'left',
      colorScheme: 'primary',
      customColor: '#46b530'
    }
  },
  formTexts: {
    title: { text: 'Виджет в разработке', color: '#FFFFFF' },
    description: {
      text: 'Этот виджет ещё не реализован. Пожалуйста, используйте другой тип виджета.',
      color: '#FFFFFF'
    },
    button: {
      text: 'В разработке',
      color: '#FFFFFF',
      backgroundColor: '#999999',
      icon: 'rocket'
    }
  },
  countdown: { enabled: true },
  contacts: {
    phone: { enabled: true, required: true },
    email: { enabled: true, required: true },
    name: { enabled: true, required: false }
  },
  agreement: {
    enabled: true,
    text: 'Я даю Согласие на обработку персональных данных в соотвествии с Политикой конфиденциальности',
    agreementUrl: 'lemnity.ru/agreement',
    policyUrl: 'lemnity.ru/political',
    color: '#FFFFFF'
  },
  adsInfo: {
    enabled: true,
    text: 'Нажимая на кнопку, вы даёте своё согласие на получение рекламно-информационной рассылки.',
    policyUrl: 'lemnity.ru/ads',
    color: '#FFFFFF'
  },
  link: '',
  border: { enabled: true, color: '#FFFFFF' },
  messages: {
    onWin: {
      enabled: true,
      text: 'Вы выиграли!',
      textSize: 0,
      description: 'Не забудьте использовать промокод во время оформления заказа!',
      descriptionSize: 0,
      colorScheme: { enabled: true, scheme: 'primary' }
    },
    limitShows: { enabled: false, text: '' },
    limitWins: { enabled: false, text: '' },
    allPrizesGiven: { enabled: false, text: '' }
  }
})

/**
 * Реализованные виджеты: используют свои build* из папок конкретных виджетов.
 */
const implementedWidgetDefinitions: Partial<Record<WidgetTypeEnum, WidgetDefinitionBase>> = {
  [WidgetTypeEnum.WHEEL_OF_FORTUNE]: {
    type: WidgetTypeEnum.WHEEL_OF_FORTUNE,
    buildWidgetSettings: buildWheelWidgetSettings,
    buildFormSettings: buildWheelFormSettings
  },
  [WidgetTypeEnum.ACTION_TIMER]: {
    type: WidgetTypeEnum.ACTION_TIMER,
    buildWidgetSettings: buildActionTimerWidgetSettings,
    buildFormSettings: buildActionTimerFormSettings
  },
  [WidgetTypeEnum.FAB_MENU]: {
    type: WidgetTypeEnum.FAB_MENU,
    buildWidgetSettings: buildFABMenuWidgetSettings,
    buildFormSettings: buildFABMenuFormSettings
  }
}

/**
 * Нереализованные типы: общие stub‑настройки.
 */
const unimplementedWidgetTypes: WidgetTypeEnum[] = [
  WidgetTypeEnum.CONVEYOR_OF_GIFTS,
  WidgetTypeEnum.POSTCARD,
  WidgetTypeEnum.CHEST_WITH_ACTION,
  WidgetTypeEnum.ADVENT_CALENDAR,
  WidgetTypeEnum.TEASER
]

const stubWidgetDefinitions: Partial<Record<WidgetTypeEnum, WidgetDefinitionBase>> =
  Object.fromEntries(
    unimplementedWidgetTypes.map(widgetType => [
      widgetType,
      {
        type: widgetType,
        buildWidgetSettings: () => buildStubWidgetSettings(widgetType),
        buildFormSettings: buildStubFormSettings
      } as WidgetDefinitionBase
    ])
  )

const definitions = {
  ...implementedWidgetDefinitions,
  ...stubWidgetDefinitions
} as Record<WidgetTypeEnum, WidgetDefinitionBase>

export const WIDGET_DEFINITIONS_BASE = definitions

const resolveWidgetDefinitionBase = resolveWidgetDefinition<
  typeof definitions,
  WidgetDefinitionBase
>(definitions)

export const getWidgetDefinitionBase = (widgetType: WidgetTypeEnum): WidgetDefinitionBase =>
  resolveWidgetDefinitionBase(widgetType)
