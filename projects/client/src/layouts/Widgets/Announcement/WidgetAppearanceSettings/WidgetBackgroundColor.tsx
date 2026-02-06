import { useState } from "react"

import CustomRadioGroup from "@/components/CustomRadioGroup"
import BorderedContainer from "@/layouts/BorderedContainer/BorderedContainer"
import ColorPicker from "@/components/ColorPicker"

type WidgetBackgroundType = 'system' | 'custom'

const WidgetBackgroundColor = () => {
  const [type, setWidgetType] = useState<WidgetBackgroundType>('system')

  const options = [
    { label: 'Основная', value: 'system' },
    {
      label: 'Пользовательская',
      value: 'custom',
      payloadNode: <ColorPicker
        disabled={type !== 'custom'}
        initialColor="#FFC943"
        onColorChange={() => {}}
      />
    },
  ]

  const handleTypeChange = (value: string) => {
    setWidgetType(value as WidgetBackgroundType)
  }

  return (
    <BorderedContainer>
      <div className="w-full flex flex-col gap-6">
        <h2 className="text-[16px] leading-4.75">Цветовая гамма</h2>

        <div className="w-full flex flex-row gap-2.5">
          <div className="grow">
            <CustomRadioGroup
              options={options}
              value={type}
              onValueChange={handleTypeChange}
            />
          </div>
        </div>
      </div>
    </BorderedContainer>
  )
}

export default WidgetBackgroundColor
