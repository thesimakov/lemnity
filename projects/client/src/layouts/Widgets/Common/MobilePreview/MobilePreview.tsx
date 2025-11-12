import type { ReactElement } from 'react'
import WheelOfFortune from '../../WheelOfFortune/WheelOfFortune'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import DynamicFieldsForm from '../DynamicFieldsForm/DynamicFieldsForm'
import CloseButton from '../CloseButton/CloseButton'

const MobileChrome = ({ children }: { children: ReactElement | ReactElement[] }) => {
  const template = useWidgetSettingsStore(s => s.settings.form.template)
  const { colorScheme, customColor } = template?.templateSettings || {}

  return (
    <div
      style={{ backgroundColor: colorScheme === 'primary' ? '#725DFF' : customColor }}
      className={`mx-auto w-[360px] rounded-2xl text-white p-4 relative`}
    >
      <CloseButton position="right" />
      {children}
    </div>
  )
}

type MobilePreviewProps = {
  spinTrigger?: number
}

const MobilePreview = ({ spinTrigger }: MobilePreviewProps) => {
  const sectors = useWidgetSettingsStore(s => s.settings.form.sectors)

  return (
    <div className="w-full rounded-2xl bg-[#F5F6F8] border border-[#E6E6E6] p-4 overflow-y-auto">
      <MobileChrome>
        <div className="flex flex-col gap-4 items-center">
          <WheelOfFortune
            sectors={
              sectors.randomize ? [...sectors.items].sort(() => Math.random() - 0.5) : sectors.items
            }
            spinTrigger={spinTrigger}
          />
          <DynamicFieldsForm isMobile centered onSubmit={() => {}} />
        </div>
      </MobileChrome>
    </div>
  )
}

export default MobilePreview
