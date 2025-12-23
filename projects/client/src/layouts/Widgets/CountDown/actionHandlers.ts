import type { ActionHandler } from '../actions'

export const actionTimerHandlers: Record<string, ActionHandler> = {
  'actionTimer.submit': ctx => {
    const helpers = ctx.helpers ?? {}
    const setTimer = helpers.setTimer as ((ms: number, cb: () => void) => void) | undefined
    const clearTimer = helpers.clearTimer as (() => void) | undefined
    const setScreen = helpers.setScreen as ((screen: string) => void) | undefined
    if (setTimer && setScreen) {
      clearTimer?.()
      setTimer(1500, () => setScreen('prize'))
    } else {
      setScreen?.('prize')
    }
  }
}
