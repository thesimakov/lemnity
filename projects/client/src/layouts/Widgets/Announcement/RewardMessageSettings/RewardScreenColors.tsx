import { useState } from 'react'

import CustomRadioGroup from '@/components/CustomRadioGroup'
import SwitchableField from '@/components/SwitchableField'
import ColorPicker from '@/components/ColorPicker'

type ColorSchemeType = 'system' | 'custom'

const RewardScreenColors = () => {
  const [enabled, setEnabled] = useState(true)
  const [colorSchemeType, setColorSchemeType] =
    useState<ColorSchemeType>('system')
  
  const options = [
    { label: 'Основная', value: 'system' },
    { label: 'Пользовательская', value: 'custom' },
  ]

  const handleTypeChange = (value: string) => {
    setColorSchemeType(value as ColorSchemeType)
  }

  return (
    <SwitchableField
      title="Цветовая гамма"
      enabled={enabled}
      onToggle={setEnabled}
      classNames={{
        title: 'text-[16px] leading-4.75 font-normal',
      }}
    >
      <div className="flex flex-col gap-2.5">
        <CustomRadioGroup
          options={options}
          value={colorSchemeType}
          onValueChange={handleTypeChange}
        />

        {colorSchemeType === 'custom' && (
          <div className="w-full flex flex-col gap-2.5">
            <div className="w-full flex flex-row flex-wrap gap-2.5">
              <ColorPicker
                initialColor="#FFC943"
                onColorChange={() => {}}
                triggerText="Цвет поля скидки"
                classNames={{ triggerButton: 'min-w-64' }}
              />
              <ColorPicker
                initialColor="#000000"
                onColorChange={() => {}}
                triggerText="Шрифт поля скидки"
                classNames={{ triggerButton: 'min-w-64' }}
              />
            </div>

            <div className="w-full flex flex-row flex-wrap gap-2.5">
              <ColorPicker
                initialColor="#3DADFF"
                onColorChange={() => {}}
                triggerText="Цвет поля промокод"
                classNames={{ triggerButton: 'min-w-64' }}
              />
              <ColorPicker
                initialColor="#FFFFFF"
                onColorChange={() => {}}
                triggerText="Шрифт поля промокод"
                classNames={{ triggerButton: 'min-w-64' }}
              />
            </div>
          </div>
        )}
      </div>
    </SwitchableField>
  )
}

export default RewardScreenColors
