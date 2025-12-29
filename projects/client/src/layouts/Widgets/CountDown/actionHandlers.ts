import type { ActionHandler } from '../actions'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { sendEvent } from '@/common/api/httpWrapper'

export const actionTimerHandlers: Record<string, ActionHandler> = {
  'actionTimer.submit': ctx => {
    const helpers = ctx.helpers ?? {}
    const setTimer = helpers.setTimer as ((ms: number, cb: () => void) => void) | undefined
    const clearTimer = helpers.clearTimer as (() => void) | undefined
    const setScreen = helpers.setScreen as ((screen: string) => void) | undefined
    const widgetId = useWidgetSettingsStore.getState().settings?.id
    if (widgetId) {
      void sendEvent({
        event_name: 'countdown.submit',
        widget_id: widgetId
      })
    }
    if (setTimer && setScreen) {
      clearTimer?.()
      setTimer(1500, () => setScreen('prize'))
    } else {
      setScreen?.('prize')
    }
  }
}
