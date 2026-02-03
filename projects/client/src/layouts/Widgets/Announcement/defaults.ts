import type {
  DisplaySettings,
  FieldsSettings,
  IntegrationSettings
} from '@/stores/widgetSettings/types'
import type { AnnouncementWidgetSettings } from './types'
import { WidgetTypeEnum } from '@lemnity/api-sdk'

export const buildAnnouncementWidgetSettings = (): AnnouncementWidgetSettings => ({
  type: WidgetTypeEnum.ANNOUNCEMENT
})

export const buildAnnouncementFieldsSettings = (): FieldsSettings =>
  ({}) as FieldsSettings
export const buildAnnouncementDisplaySettings = (): DisplaySettings =>
  ({}) as DisplaySettings
export const buildAnnouncementIntegrationSettings = (): IntegrationSettings =>
  ({}) as IntegrationSettings
