import WheelOfFortune from './WheelOfFortune'
import DynamicFieldsForm from '../Common/DynamicFieldsForm/DynamicFieldsForm'
import CloseButton from '../Common/CloseButton/CloseButton'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { useWheelOfFortuneSettings } from '@/layouts/Widgets/WheelOfFortune/hooks'

import usePreviewRuntimeStore from '@/stores/previewRuntimeStore'

const WheelMobileScreen = () => {
  const spinTrigger = usePreviewRuntimeStore(s => s.counters['wheel.spin'] ?? 0)
  const template = useWidgetSettingsStore(s => s?.settings?.form.template)
  const { colorScheme, customColor } = template?.templateSettings || {}
  const { settings } = useWheelOfFortuneSettings()

  if (!settings) return null

  const sectors = settings.sectors
  const items = sectors.randomize
    ? [...sectors.items].sort(() => Math.random() - 0.5)
    : sectors.items

  return (
    <div className="w-full rounded-2xl bg-[#F5F6F8] border border-[#E6E6E6] p-4 overflow-y-auto">
      <div
        style={{ backgroundColor: colorScheme === 'primary' ? '#725DFF' : customColor }}
        className="mx-auto w-[360px] rounded-2xl text-white p-4 relative"
      >
        <CloseButton position="right" />
        <div className="flex flex-col gap-4 items-center">
          <WheelOfFortune sectors={items} spinTrigger={spinTrigger} />
          <DynamicFieldsForm isMobile centered onSubmit={() => {}} />
        </div>
      </div>
    </div>
  )
}

export default WheelMobileScreen
