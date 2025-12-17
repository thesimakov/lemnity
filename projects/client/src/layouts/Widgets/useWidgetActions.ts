import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { ActionContext, WidgetAction } from './actions'

export const useWidgetActions = () => {
  const actions = useWidgetSettingsStore(s => s.settings?.actions) ?? []

  const find = (name: string, predicate?: (action: WidgetAction) => boolean) => {
    return (
      actions.find(action => action.name === name && (predicate ? predicate(action) : true)) ?? null
    )
  }

  const run = (
    name: string,
    ctx: ActionContext,
    predicate?: (action: WidgetAction) => boolean,
    resolveHandler?: (handlerId?: string) => ((ctx: ActionContext) => void) | undefined
  ) => {
    const action = find(name, predicate) ?? find(name)
    if (!action) return false
    const handler = resolveHandler ? resolveHandler(action.handlerId) : undefined
    if (handler) handler({ ...ctx, payload: action.payload })
    return Boolean(handler)
  }

  return { actions, find, run }
}
