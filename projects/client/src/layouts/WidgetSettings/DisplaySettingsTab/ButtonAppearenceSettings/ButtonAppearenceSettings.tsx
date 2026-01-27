import { useState } from 'react'
import { Input } from '@heroui/input'
import { cn } from '@heroui/theme'

import ColorPicker from '@/components/ColorPicker'
import IconPicker, { type IconName } from '@/components/IconPicker'

import { useFABMenuSettings } from '@/layouts/Widgets/FABMenu/hooks'
import { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import type { FABMenuWidgetSettings } from '@/layouts/Widgets/FABMenu/types'

type ButtonAppearance = {
  text?: string
  textColor?: string
  backgroundColor: string
  icon: string
}

type ButtonAppearenceSettingsProps = {
  onChange: (value: ButtonAppearance) => void
}

// @ts-expect-error: emnrorr
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ButtonAppearenceSettings = (props: ButtonAppearenceSettingsProps) => {
  const [isInputInvalid, setIsInputInvalid] = useState(false)

  const defaults = useWidgetStaticDefaults()
  const {
    settings,
    setFABMenuButtonTextColor,
    setFABMenuButtonBackgroundColor,
    setFABMenuTriggerText,
    setFABMenuTriggerIcon
  } = useFABMenuSettings()

  if (!settings || !defaults) {
    // TODO: Сообщение пользователю с просьбой обновить страницу
    return
  }

  const initialFABMenuTextColor =
    settings.triggerTextColor ?? (defaults.widget as FABMenuWidgetSettings).triggerTextColor

  const initialFABMenuBackgroundColor =
    settings.triggerBackgroundColor ??
    (defaults.widget as FABMenuWidgetSettings).triggerBackgroundColor

  const handleTriggerTextChange = (value: string) => {
    if (value.length > 20) {
      // TODO: сообщение пользователю
      setIsInputInvalid(true)
      return
    }

    setIsInputInvalid(false)
    setFABMenuTriggerText(value)
  }

  const initialFABMenuTriggerIcon =
    settings.triggerIcon ?? (defaults.widget as FABMenuWidgetSettings).triggerIcon

  const handleTriggerIconChange = (icon: IconName) => {
    setFABMenuTriggerIcon(icon)
  }

  return (
    <div className="flex flex-row flex-wrap gap-2.5 @container">
      <Input
        value={settings.triggerText}
        onValueChange={handleTriggerTextChange}
        isInvalid={isInputInvalid}
        placeholder="Супер кнопка"
        classNames={{
          base: 'min-w-40 flex-3',
          inputWrapper: cn(
            'border bg-white border-[#E4E4E7] rounded-[5px]',
            'shadow-none h-12.75 min-h-10 px-2.5'
          ),
          input: 'text-base'
        }}
      />

      <ColorPicker
        initialColor={initialFABMenuTextColor}
        onColorChange={setFABMenuButtonTextColor}
        triggerText="Цвет шрифта"
      />

      <IconPicker initialIcon={initialFABMenuTriggerIcon} onIconChange={handleTriggerIconChange} />

      <ColorPicker
        initialColor={initialFABMenuBackgroundColor}
        onColorChange={setFABMenuButtonBackgroundColor}
        triggerText="Цвет кнопки"
      />
    </div>
  )
}

export default ButtonAppearenceSettings
