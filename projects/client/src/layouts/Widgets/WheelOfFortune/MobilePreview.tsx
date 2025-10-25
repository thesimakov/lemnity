import type { ReactElement } from 'react'
import WheelOfFortune from './WheelOfFortune'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import DynamicFieldsForm from '../DynamicFieldsForm/DynamicFieldsForm'

const MobileChrome = ({ children }: { children: ReactElement | ReactElement[] }) => {
  const template = useWidgetSettingsStore(s => s.settings.form.template)
  const { colorScheme, customColor } = template?.templateSettings || {}

  return (
    <div
      style={{ backgroundColor: colorScheme === 'primary' ? '' : customColor }}
      className={`mx-auto w-[360px] rounded-2xl text-white p-4 relative`}
    >
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute right-3 top-3 w-7 h-7 rounded-full bg-white/30 text-white"
      >
        ×
      </button>
      {children}
    </div>
  )
}

const MobilePreview = () => {
  const sectors = useWidgetSettingsStore(s => s.settings.form.sectors)

  return (
    <div className="w-full rounded-2xl bg-[#F5F6F8] border border-[#E6E6E6] p-4">
      <MobileChrome>
        <div className="flex flex-col gap-4 items-center">
          <WheelOfFortune
            sectors={
              sectors.randomize ? [...sectors.items].sort(() => Math.random() - 0.5) : sectors.items
            }
          />
          <DynamicFieldsForm centered />
        </div>
      </MobileChrome>
    </div>
  )
}

export default MobilePreview
