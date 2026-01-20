import { useState } from 'react'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { cn } from '@heroui/theme'

import SvgIcon from '@/components/SvgIcon'
import ColorPicker from '@/components/ColorPicker'

// import circle from '@/assets/icons/circle.svg'
import lightIcon from '@/assets/icons/light.svg'
import balloonIcon from '@/assets/icons/balloon.svg'
import heartDislikeIcon from '@/assets/icons/heart-dislike.svg'
import { Button } from '@heroui/button'
import { useFABMenuSettings } from '@/layouts/Widgets/FABMenu/hooks'
import { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import type { FABMenuWidgetSettings } from '@/layouts/Widgets/FABMenu/types'
import { withDefaults } from '@/stores/widgetSettings/utils'

type ButtonAppearance = {
  text?: string
  textColor?: string
  backgroundColor: string
  icon: string
}

type ButtonAppearenceSettingsProps = {
  onChange: (value: ButtonAppearance) => void
}

const Circle = (props: { fill: string, stroke?: string }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9.5" fill={props.fill} stroke={props.stroke ?? 'black'}/>
    </svg>
  )
}

const COLORS = [
  { color: '#E11D48', text: 'Красный' },
  { color: '#67E8F9', text: 'Аква' },
  { color: '#FEE2E2', text: 'Розовый' },
  { color: '#000000', text: 'Чёрный' },
]

const ICONS = [
  { icon: lightIcon, textValue: 'Light icon' },
  { icon: balloonIcon, textValue: 'Balloon icon' },
  { icon: heartDislikeIcon, textValue: 'Heart dislike icon' },
]

// @ts-expect-error: emnrorr
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ButtonAppearenceSettings = (props: ButtonAppearenceSettingsProps) => {
  const [icon, setIcon] = useState(heartDislikeIcon)
  const [isInputInvalid, setIsInputInvalid] = useState(false)

  const defaults = useWidgetStaticDefaults()
  const {
    settings,
    setFABMenuButtonTextColor,
    setFABMenuButtonBackgroundColor,
    setFABMenuTriggerText
  } = useFABMenuSettings()

  if (!settings || !defaults) {
    // TODO: Сообщение пользователю с просьбой обновить страницу
    return
  }

  const initialFABMenuTextColor = settings.triggerTextColor
    ?? (defaults.widget as FABMenuWidgetSettings).triggerTextColor

  const handleTextColorChange = (color: string) => {
    console.log(color)
    setFABMenuButtonTextColor(color)
  }

  const initialFABMenuBackgroundColor = settings.triggerBackgroundColor
    ?? (defaults.widget as FABMenuWidgetSettings).triggerBackgroundColor
  
  const handleBackgroundColorChange = (color: string) => {
    console.log(color)
    setFABMenuButtonBackgroundColor(color)
  }

  const handleTriggerTextChange = (value: string) => {
    if (value.length > 14) {
      // TODO: сообщение пользователю
      setIsInputInvalid(true)
      return
    }

    setIsInputInvalid(false)
    setFABMenuTriggerText(value)
  }

  return (
    <div className="flex flex-row gap-2.5">
      <Input
        value={settings.triggerText}
        onValueChange={handleTriggerTextChange}
        isInvalid={isInputInvalid}
        placeholder="Супер кнопка"
        classNames={{
          inputWrapper: cn(
            'border bg-white border-[#E4E4E7] rounded-[5px]',
            'shadow-none h-12.75 min-h-10 px-2.5',
          ),
          input: 'text-base'
        }}
      />

      <div className=''>
        <ColorPicker
          initialColor={initialFABMenuTextColor}
          onColorChange={handleTextColorChange}
        />
      </div>
      
      <div className='min-w-18'>
        <Select
          aria-label='Иконка кнопки'
          selectedKeys={[icon]}
          items={ICONS}
          classNames={{
            trigger: cn(
              'shadow-none border border-[#D9D9E0] rounded-[5px]',
              'h-[51px] bg-white',
            ),
            value: 'hidden',
          }}
          startContent={
            <div className='shrink-0 w-5 h-5'>
              <SvgIcon src={icon} />
            </div>
          }
          onChange={(e) => { setIcon(e.target.value) }}
        >
          {
            (item) => (
              <SelectItem
                key={item.icon}
                aria-label={item.textValue}
                startContent={
                  <div className='shrink-0 w-5 h-5'>
                    <SvgIcon src={item.icon} />
                  </div>
                }
                classNames={{
                  title: "hidden",
                }}
              >
              </SelectItem>
            )
          }
        </Select>
      </div>

      <div className='min-w-43'>
        <ColorPicker
          initialColor={initialFABMenuBackgroundColor}
          onColorChange={handleBackgroundColorChange}
          triggerText='Цвет кнопки'
        />
      </div>
    </div>
  )
}

export default ButtonAppearenceSettings