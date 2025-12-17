import type { ActionHandler } from '../actions'

export const wheelActionHandlers: Record<string, ActionHandler> = {
  'wheel.spin': ctx => {
    const helpers = ctx.helpers ?? {}
    const emit = helpers.emit as ((eventKey: string) => void) | undefined
    const setTimer = helpers.setTimer as ((ms: number, cb: () => void) => void) | undefined
    const clearTimer = helpers.clearTimer as (() => void) | undefined
    const setScreen = helpers.setScreen as ((screen: string) => void) | undefined
    emit?.('wheel.spin')
    if (setTimer && setScreen) {
      clearTimer?.()
      setTimer(5000, () => setScreen('prize'))
    } else {
      setScreen?.('prize')
    }
  },
  'wheel.close': ctx => {
    const helpers = ctx.helpers ?? {}
    const clearTimer = helpers.clearTimer as (() => void) | undefined
    const close = helpers.close as (() => void) | undefined
    const setScreen = helpers.setScreen as ((screen: string) => void) | undefined
    clearTimer?.()
    close?.()
    setScreen?.('main')
  }
}
