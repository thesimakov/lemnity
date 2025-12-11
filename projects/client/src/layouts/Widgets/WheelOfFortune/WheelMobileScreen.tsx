import WheelOfFortune from './WheelOfFortune'
import DynamicFieldsForm from '../Common/DynamicFieldsForm/DynamicFieldsForm'
import CloseButton from '../Common/CloseButton/CloseButton'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { useWheelOfFortuneSettings } from '@/layouts/Widgets/WheelOfFortune/hooks'

import usePreviewRuntimeStore from '@/stores/previewRuntimeStore'

const WheelMobileScreen = () => {
  const spinTrigger = usePreviewRuntimeStore(s => s.counters['wheel.spin'] ?? 0)
  const template = useWidgetSettingsStore(s => s?.settings?.fields?.template)
  const { colorScheme, customColor } = template?.templateSettings || {}
  const { settings } = useWheelOfFortuneSettings()

  if (!settings) return null

  const sectors = settings.sectors
  const pointerPositionDeg = 225

  return (
    <div className="w-full rounded-2xl bg-[#F5F6F8] border border-[#E6E6E6] p-4 overflow-y-auto">
      <div
        style={{ backgroundColor: colorScheme === 'primary' ? '#725DFF' : customColor }}
        className="mx-auto w-[360px] rounded-2xl text-white pb-4 pt-0 relative overflow-hidden"
      >
        <CloseButton position="right" />
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-full overflow-hidden pt-[50%]">
            <div className="absolute top-[-100%] left-1/2 -translate-x-1/2 w-full max-w-none aspect-square">
              <WheelOfFortune
                sectors={sectors.items}
                sectorsRandomize={sectors.randomize}
                winningSectorId={undefined}
                pointerPositionDeg={pointerPositionDeg}
                spinTrigger={spinTrigger}
                borderColor={settings?.borderColor}
                borderThickness={settings?.borderThickness}
              />
            </div>
          </div>
          <div className="w-full px-4">
            <DynamicFieldsForm isMobile centered onSubmit={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WheelMobileScreen
