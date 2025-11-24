import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  DisplaySettings,
  Extendable,
  FieldsSettings,
  IntegrationSettings,
  WidgetSettings
} from './types'
import {
  buildStubFieldsSettings,
  getWidgetDefinitionBase,
  getWidgetSurfaceModes
} from './widgetDefinitions'
import { buildStandardDisplaySettings } from './displayDefaults'

const buildStandardIntegrationSettings = (): IntegrationSettings => ({ scriptSnippet: '' })

type LooseFieldsSettings = Extendable<Record<string, unknown>>

const buildLooseFieldsSettings = (): LooseFieldsSettings => ({})

const buildLooseDisplaySettings = (): DisplaySettings => ({}) as DisplaySettings

const buildLooseIntegrationSettings = (): IntegrationSettings => ({}) as IntegrationSettings

export const buildDefaults = (id: string, widgetType: WidgetTypeEnum): WidgetSettings => {
  const definition = getWidgetDefinitionBase(widgetType)
  const surfaces = getWidgetSurfaceModes(widgetType)

  const fieldsBuilder: () => FieldsSettings | LooseFieldsSettings =
    surfaces.fields === 'standard'
      ? (definition.buildFieldsSettings ?? buildStubFieldsSettings)
      : (definition.buildFieldsSettings ?? buildLooseFieldsSettings)
  const displayBuilder =
    surfaces.display === 'standard'
      ? (definition.buildDisplaySettings ?? buildStandardDisplaySettings)
      : (definition.buildDisplaySettings ?? buildLooseDisplaySettings)
  const integrationBuilder =
    surfaces.integration === 'standard'
      ? (definition.buildIntegrationSettings ?? buildStandardIntegrationSettings)
      : (definition.buildIntegrationSettings ?? buildLooseIntegrationSettings)

  return {
    id,
    widgetType,
    fields: (fieldsBuilder() ?? {}) as FieldsSettings,
    widget: definition.buildWidgetSettings(),
    display: displayBuilder(),
    integration: integrationBuilder()
  }
}

const allWidgetTypes: WidgetTypeEnum[] = Object.values(WidgetTypeEnum) as WidgetTypeEnum[]

export const STATIC_DEFAULTS_BY_TYPE: Record<WidgetTypeEnum, WidgetSettings> = Object.fromEntries(
  allWidgetTypes.map(widgetType => [widgetType, buildDefaults('', widgetType)])
) as Record<WidgetTypeEnum, WidgetSettings>

export const getStaticDefaults = (widgetType: WidgetTypeEnum): WidgetSettings =>
  STATIC_DEFAULTS_BY_TYPE[widgetType]
