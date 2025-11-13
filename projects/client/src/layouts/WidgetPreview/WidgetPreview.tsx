import { useCallback } from 'react'
import WheelOfFortunePreview from '../Widgets/WheelOfFortune/WheelOfFortunePreview'
import CountDownPreview from '../Widgets/CountDown/CountDownPreview'
import WidgetPreviewLayout from './WidgetPreviewLayout/WidgetPreviewLayout'
import useWidgetPreviewStore, { type WidgetType } from '@/stores/widgetPreviewStore'

type WidgetPreviewProps = {
  spinTrigger?: number
}

const WidgetPreview = ({ spinTrigger }: WidgetPreviewProps) => {
  const { widgetType } = useWidgetPreviewStore()

  const getWidgetPreview = useCallback(
    (widgetType: WidgetType | null) => {
      if (!widgetType) return null

      switch (widgetType) {
        case 'WHEEL_OF_FORTUNE':
          return <WheelOfFortunePreview spinTrigger={spinTrigger} />
        case 'ACTION_TIMER':
          return <CountDownPreview />
        default:
          return null
      }
    },
    [spinTrigger]
  )

  return <WidgetPreviewLayout>{getWidgetPreview(widgetType)}</WidgetPreviewLayout>
}

export default WidgetPreview
