 import type {
  TypedWidgetUpdater,
} from '@/stores/widgetSettings/widgetActions/types'
import type {
  NotificationWidgetType,
} from '@lemnity/widget-config/widgets/notification'

export const createNotificationActions = (
  updateWidget: TypedWidgetUpdater<NotificationWidgetType>
) => ({
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