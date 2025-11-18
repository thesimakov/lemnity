import WidgetPreviewLayout from './WidgetPreviewLayout/WidgetPreviewLayout'
import useWidgetPreviewStore from '@/stores/widgetPreviewStore'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { getWidgetDefinition } from '../Widgets/registry'

const WidgetPreview = () => {
  const mode = useWidgetPreviewStore(s => s.mode)
  const { widgetType } = useWidgetSettingsStore(s => s?.settings) || {}
  const definition = widgetType && getWidgetDefinition(widgetType)
  const PanelComponent = definition?.preview?.panel

  return (
    <WidgetPreviewLayout>
      {PanelComponent ? <PanelComponent mode={mode} /> : null}
    </WidgetPreviewLayout>
  )
}

export default WidgetPreview
