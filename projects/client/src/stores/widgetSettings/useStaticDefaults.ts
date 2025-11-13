import { useMemo } from 'react'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { getStaticDefaults } from './defaults'

export const useWidgetStaticDefaults = () => {
  const widgetType = useWidgetSettingsStore(s => s.settings?.widgetType)
  if (!widgetType) throw new Error('Widget settings not initialized')
  return useMemo(() => getStaticDefaults(widgetType), [widgetType])
}
