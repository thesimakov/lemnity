import { useCallback } from 'react'
import WheelOfFortunePreview from '../Widgets/WheelOfFortune/WheelOfFortunePreview'
import WidgetPreviewLayout from './WidgetPreviewLayout/WidgetPreviewLayout'
import useWidgetPreviewStore, { type WidgetType } from '@/stores/widgetPreviewStore'

const WidgetPreview = () => {
  const { widgetType } = useWidgetPreviewStore()

  const getWidgetPreview = useCallback((widgetType: WidgetType | null) => {
    if (!widgetType) return null

    switch (widgetType) {
      case 'WHEEL_OF_FORTUNE':
        return <WheelOfFortunePreview />
      default:
        return null
    }
  }, [])

  return <WidgetPreviewLayout>{getWidgetPreview(widgetType)}</WidgetPreviewLayout>
}

export default WidgetPreview
