import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { SettingsSurface } from '@lemnity/widget-config'
import type {
  DisplaySettings,
  Extendable,
  FieldsSettings,
  IntegrationSettings,
  StubWidgetSettings,
  WidgetSpecificSettings
} from './types'
import {
  buildWheelWidgetSettings,
  buildWheelFieldsSettings
} from '@/layouts/Widgets/WheelOfFortune/defaults'
import {
  buildActionTimerWidgetSettings,
  buildActionTimerFieldsSettings
} from '@/layouts/Widgets/CountDown/defaults'
import {
  buildFABMenuWidgetSettings,
  buildFABMenuFieldsSettings,
  buildFABMenuDisplaySettings,
  buildFABMenuIntegrationSettings
} from '@/layouts/Widgets/FABMenu/defaults'
import { resolveWidgetDefinition } from './resolveWidgetDefinition'

type SettingsSurfaceMode = 'standard' | 'custom'
type WidgetSettingsSurfaces = Partial<Record<SettingsSurface, SettingsSurfaceMode>>
type LooseFieldsSettings = Extendable<Record<string, unknown>>

const DEFAULT_SURFACE_MODES: Record<SettingsSurface, SettingsSurfaceMode> = {
  fields: 'standard',
  display: 'standard',
  integration: 'standard'
}

export type WidgetDefinitionBase = {
  type: WidgetTypeEnum
  buildWidgetSettings: () => WidgetSpecificSettings
  buildFieldsSettings?: () => FieldsSettings | LooseFieldsSettings
  buildDisplaySettings?: () => DisplaySettings
  buildIntegrationSettings?: () => IntegrationSettings
  settingsSurfaces?: WidgetSettingsSurfaces
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
 * Создаёт FieldsSettings для нереализованных виджетов.
 * Используется только как заглушка до полноценной реализации.
 */
export const buildStubFieldsSettings = (): LooseFieldsSettings => ({})

/**
 * Реализованные виджеты: используют свои build* из папок конкретных виджетов.
 */
const implementedWidgetDefinitions: Partial<Record<WidgetTypeEnum, WidgetDefinitionBase>> = {
  [WidgetTypeEnum.WHEEL_OF_FORTUNE]: {
    type: WidgetTypeEnum.WHEEL_OF_FORTUNE,
    buildWidgetSettings: buildWheelWidgetSettings,
    buildFieldsSettings: buildWheelFieldsSettings
  },
  [WidgetTypeEnum.ACTION_TIMER]: {
    type: WidgetTypeEnum.ACTION_TIMER,
    buildWidgetSettings: buildActionTimerWidgetSettings,
    buildFieldsSettings: buildActionTimerFieldsSettings
  },
  [WidgetTypeEnum.FAB_MENU]: {
    type: WidgetTypeEnum.FAB_MENU,
    buildWidgetSettings: buildFABMenuWidgetSettings,
    buildFieldsSettings: buildFABMenuFieldsSettings,
    buildDisplaySettings: buildFABMenuDisplaySettings,
    buildIntegrationSettings: buildFABMenuIntegrationSettings,
    settingsSurfaces: {
      fields: 'custom',
      display: 'custom'
    }
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
        buildFieldsSettings: buildStubFieldsSettings
      } as WidgetDefinitionBase
    ])
  )

const definitions = {
  ...implementedWidgetDefinitions,
  ...stubWidgetDefinitions
} as Record<WidgetTypeEnum, WidgetDefinitionBase>

export const WIDGET_DEFINITIONS_BASE = definitions

const resolveSurfaceModes = (definition: WidgetDefinitionBase) => ({
  ...DEFAULT_SURFACE_MODES,
  ...(definition.settingsSurfaces ?? {})
})

export const getWidgetSurfaceModes = (
  widgetType: WidgetTypeEnum
): Record<SettingsSurface, SettingsSurfaceMode> =>
  resolveSurfaceModes(WIDGET_DEFINITIONS_BASE[widgetType])

export const usesStandardSurface = (
  widgetType: WidgetTypeEnum,
  surface: SettingsSurface
): boolean => getWidgetSurfaceModes(widgetType)[surface] === 'standard'

const resolveWidgetDefinitionBase = resolveWidgetDefinition<
  typeof definitions,
  WidgetDefinitionBase
>(definitions)

export const getWidgetDefinitionBase = (widgetType: WidgetTypeEnum): WidgetDefinitionBase =>
  resolveWidgetDefinitionBase(widgetType)

export type { SettingsSurface } from '@lemnity/widget-config'
export type { SettingsSurfaceMode }
