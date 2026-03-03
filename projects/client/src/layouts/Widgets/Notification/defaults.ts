import type {
  DisplaySettings,
  FieldsSettings,
  IntegrationSettings,
} from '@/stores/widgetSettings/types'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type {
  NotificationWidgetType,
} from '@lemnity/widget-config/widgets/notification'

export const notificationWidgetDefaults: NotificationWidgetType = {
  type: WidgetTypeEnum.NOTIFICATION,
  brandingEnabled: true,
}

export const buildNotificationWidgetSettings = (): NotificationWidgetType =>
  notificationWidgetDefaults

export const buildNotificationFieldsSettings = (): FieldsSettings =>
  ({}) as FieldsSettings
export const buildNotificationDisplaySettings = (): DisplaySettings =>
  ({}) as DisplaySettings
export const buildNotificationIntegrationSettings = (): IntegrationSettings =>
  ({}) as IntegrationSettings
