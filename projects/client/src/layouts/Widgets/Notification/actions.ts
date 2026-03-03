 import type {
  TypedWidgetUpdater,
} from '@/stores/widgetSettings/widgetActions/types'
import type {
  NotificationWidgetType,
  Notification,
} from '@lemnity/widget-config/widgets/notification'

export const createNotificationActions = (
  updateWidget: TypedWidgetUpdater<NotificationWidgetType>
) => ({
  setNotifications: (
    notifications: Notification[]
  ) =>
    updateWidget(widget => {
      return {
        ...widget,
        notifications: [
          ...notifications,
        ],
      }
    }),
  addNotification: (
    notification: Notification
  ) =>
    updateWidget(widget => {
      return {
        ...widget,
        notifications: [
          ...widget.notifications,
          notification,
        ],
      }
    }),
  deleteNotification: (
    id: string
  ) =>
    updateWidget(widget => {
      return {
        ...widget,
        notifications: widget.notifications.filter(item => item.id !== id),
      }
    }),
  // General
  setNotificationBrandingEnabled: (
    brandingEnabled: boolean
  ) => 
    updateWidget(widget => {
      return {
        ...widget,
        brandingEnabled,
      }
    }),
})