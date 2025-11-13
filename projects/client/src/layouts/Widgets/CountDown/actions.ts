import type { ActionTimerWidgetSettings } from '@/stores/widgetSettings/types'
import type { WidgetActions, TypedWidgetUpdater } from '@/stores/widgetSettings/widgetActions/types'

export const createActionTimerActions = (
  updateWidget: TypedWidgetUpdater<ActionTimerWidgetSettings>
): Partial<WidgetActions> => ({
  updateActionTimer: (updates: Partial<ActionTimerWidgetSettings['countdown']>) =>
    updateWidget(widget => ({
      ...widget,
      countdown: {
        ...widget.countdown,
        ...updates
      }
    })),
  setActionTimerImage: (imageUrl?: string) =>
    updateWidget(widget => ({
      ...widget,
      countdown: {
        ...widget.countdown,
        imageUrl
      }
    }))
})
