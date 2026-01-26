import SwitchableField from "@/components/SwitchableField"
import useWidgetSettingsStore from "@/stores/widgetSettingsStore"
import { cn } from "@heroui/theme"

const DisableBranding = () => {
  const { settings, setBrandingEnabled } = useWidgetSettingsStore()

  if (!settings) {
    return
  }

  const handeToggle = () => {
    setBrandingEnabled(!settings.display.brandingEnabled)
  }

  return (
    <SwitchableField
      title="Брендинг"
      switchLabel="Функция доступна для бизнес тарифа. Оплатить"
      enabled={settings.display.brandingEnabled}
      onToggle={handeToggle}
    >
      <div
        className={cn(
          'border border-[#C0C0C0] rounded-[3.38px] px-2.5',
          'flex flex-row items-center text-left h-7.5'
        )}
      >
        <span
          className="text-[#AAAAAA] text-[16px] leading-4.75"
        >
          Сделано на Lemnity
        </span>
      </div>
    </SwitchableField>
  )
}

export default DisableBranding
