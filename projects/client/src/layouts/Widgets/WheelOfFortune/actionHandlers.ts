import type { ActionHandler } from '../actions'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import usePreviewRuntimeStore from '@/stores/previewRuntimeStore'
import {
  fetchPublicWheelSpinResult,
  getCollectorSessionId,
  sendEvent,
  sendPublicRequest
} from '@/common/api/publicApi'

const WHEEL_SPIN_RESULT_KEY_PREFIX = 'lemnity.wheel_of_fortune.spin_result.'

const getSpinResultStorageKey = (widgetId: string) => `${WHEEL_SPIN_RESULT_KEY_PREFIX}${widgetId}`

export const wheelActionHandlers: Record<string, ActionHandler> = {
  'wheel.spin': ctx => {
    const helpers = ctx.helpers ?? {}
    const emit = helpers.emit as ((eventKey: string) => void) | undefined
    const setTimer = helpers.setTimer as ((ms: number, cb: () => void) => void) | undefined
    const clearTimer = helpers.clearTimer as (() => void) | undefined
    const setScreen = helpers.setScreen as ((screen: string) => void) | undefined

    const runtime = usePreviewRuntimeStore.getState()
    const status = runtime.values['wheel.status'] as 'idle' | 'spinning' | 'locked' | undefined
    if (status === 'spinning' || status === 'locked') return
    runtime.setValue('wheel.status', 'spinning')

    const payload = (ctx.payload ?? {}) as Record<string, unknown>
    const lead = (payload.lead ?? {}) as Record<string, unknown>
    const url = payload.url as string | undefined
    const referrer = payload.referrer as string | undefined
    const userAgent = payload.userAgent as string | undefined

    const widgetId = useWidgetSettingsStore.getState().settings?.id
    const projectId = useWidgetSettingsStore.getState().projectId ?? undefined
    if (!widgetId) {
      runtime.setValue('wheel.status', 'idle')
      return
    }

    void (async () => {
      try {
        const sessionId = getCollectorSessionId()
        if (!sessionId) {
          runtime.setValue('wheel.status', 'idle')
          return
        }

        const result = await fetchPublicWheelSpinResult(widgetId, sessionId)
        if (!result) {
          runtime.setValue('wheel.status', 'idle')
          return
        }

        if ('blocked' in result && result.blocked) {
          runtime.setValue('wheel.winningSectorId', result.sectorId)
          runtime.setValue('wheel.result', result)

          try {
            window.sessionStorage?.setItem(
              getSpinResultStorageKey(widgetId),
              JSON.stringify(result)
            )
          } catch {
            // ignore
          }

          emit?.('wheel.spin')

          const finish = () => {
            if (result.isWin) setScreen?.('prize')
            runtime.setValue('wheel.status', 'locked')
          }

          if (setTimer) {
            clearTimer?.()
            setTimer(5000, finish)
          } else {
            finish()
          }

          return
        }

        runtime.setValue('wheel.winningSectorId', result.sectorId)
        runtime.setValue('wheel.result', result)

        const prizes: string[] = []
        if (result.sector.mode === 'text' && result.sector.text?.trim())
          prizes.push(result.sector.text)
        if (result.sector.mode === 'icon' && result.sector.icon?.trim())
          prizes.push(result.sector.icon)
        if (result.sector.promo?.trim()) prizes.push(result.sector.promo)

        void sendPublicRequest({
          widgetId,
          fullName: (lead.name as string | undefined) ?? undefined,
          phone: (lead.phone as string | undefined) ?? undefined,
          email: (lead.email as string | undefined) ?? undefined,
          prizes,
          sectorId: result.sectorId,
          isWin: result.isWin,
          url,
          referrer,
          userAgent
        })

        void sendEvent({
          event_name: 'wheel.spin',
          widget_id: widgetId,
          project_id: projectId,
          url,
          referrer,
          user_agent: userAgent,
          payload: { result }
        })

        emit?.('wheel.spin')

        const finish = () => {
          if (result.isWin) {
            setScreen?.('prize')
            runtime.setValue('wheel.status', 'locked')
          } else {
            runtime.setValue('wheel.status', 'locked')
          }
        }

        try {
          window.sessionStorage?.setItem(getSpinResultStorageKey(widgetId), JSON.stringify(result))
        } catch {
          // ignore
        }

        if (setTimer) {
          clearTimer?.()
          setTimer(5000, finish)
        } else {
          finish()
        }
      } catch {
        runtime.setValue('wheel.status', 'idle')
      }
    })()
  },
  'wheel.close': ctx => {
    const helpers = ctx.helpers ?? {}
    const clearTimer = helpers.clearTimer as (() => void) | undefined
    const close = helpers.close as (() => void) | undefined
    const setScreen = helpers.setScreen as ((screen: string) => void) | undefined
    const widgetId = useWidgetSettingsStore.getState().settings?.id
    const projectId = useWidgetSettingsStore.getState().projectId ?? undefined
    if (widgetId) {
      void sendEvent({
        event_name: 'wheel.close',
        widget_id: widgetId,
        project_id: projectId
      })
    }
    clearTimer?.()
    close?.()
    setScreen?.('main')
  }
}
