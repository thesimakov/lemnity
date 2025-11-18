import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { ActionTimerWidgetSettings } from '@/stores/widgetSettings/types'
import { useMemo } from 'react'

export const useActionTimerSettings = () => {
  const widget = useWidgetSettingsStore(s => s?.settings?.widget)
  const updateActionTimer = useWidgetSettingsStore(s => s.updateActionTimer)
  const setActionTimerImage = useWidgetSettingsStore(s => s.setActionTimerImage)
  const setTextBeforeCountdown = useWidgetSettingsStore(s => s.setTextBeforeCountdown)
  const setTextBeforeCountdownColor = useWidgetSettingsStore(s => s.setTextBeforeCountdownColor)

  const settings =
    widget?.type === WidgetTypeEnum.ACTION_TIMER ? (widget as ActionTimerWidgetSettings) : null

  return useMemo(
    () => ({
      settings,
      updateActionTimer,
      setActionTimerImage,
      setTextBeforeCountdown,
      setTextBeforeCountdownColor
    }),
    [settings, updateActionTimer, setActionTimerImage, setTextBeforeCountdown]
  )
}
