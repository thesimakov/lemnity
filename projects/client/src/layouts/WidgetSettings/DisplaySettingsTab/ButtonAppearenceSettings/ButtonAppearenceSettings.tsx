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
  const [buttonText, setButtonText] = useState('')
  // const [textColor, setTextColor] = useState('')
  const [buttonColor, setButtonColor] = useState('')
  const [icon, setIcon] = useState(heartDislikeIcon)

  return (
    <div className="flex flex-row gap-2.5">
      <Input
        value={buttonText}
        onValueChange={setButtonText}
        placeholder="Супер кнопка"
        classNames={{
          inputWrapper: cn(
            'rounded-md border bg-white border-[#E4E4E7] rounded-[5px]',
            'shadow-none h-12.75 min-h-10 px-2.5',
          ),
          input: 'text-base'
        }}
      />

      <div className='min-w-18'>
        <ColorPicker>
          <Button>:o</Button>
        </ColorPicker>
        {/* <Select
          aria-label='Цвет текста'
          selectedKeys={[textColor]}
          items={COLORS}
          classNames={{
            trigger: cn(
              'shadow-none border border-[#D9D9E0] rounded-[5px]',
              'h-[51px] bg-white',
            ),
            value: 'hidden',
          }}
          startContent={
            <div className='shrink-0 w-5 h-5'>
              <Circle fill={textColor} />
            </div>
          }
          onChange={(e) => { setTextColor(e.target.value) }}
        >
          {
            (item) => (
              <SelectItem
                key={item.color}
                aria-label={`Text color: ${item.text}`}
                startContent={
                  <div className='shrink-0 w-5 h-5'>
                    <Circle fill={item.color} />
                  </div>
                }
                classNames={{
                  title: "hidden",
                }}
              >
              </SelectItem>
            )
          }
        </Select> */}
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
        <Select
          aria-label='Цвет кнопки'
          placeholder='Цвет кнопки'
          selectedKeys={[buttonColor]}
          items={COLORS}
          classNames={{
            trigger: cn(
              'shadow-none border border-[#D9D9E0] rounded-[5px]',
              'h-[51px] bg-white',
            ),
            value: cn('text-base')
          }}
          renderValue={(items) => (
            items.map((item) => (
              <div key={item.key} className='flex flex-row gap-1.25 items-center'>
                <span className='text-base text-[#797979]'>
                  Цвет кнопки
                </span>
                {
                  item.data &&
                  <div className='shrink-0'>
                    <Circle fill={item.data.color} />
                    {/* <SvgIcon
                      src={circle} className={`fill-[${item.data.color}]`}
                    /> */}
                  </div>
                }
              </div>
            ))
          )}
          onChange={(e) => { setButtonColor(e.target.value) }}
        >
          {
            (item) => (
              <SelectItem
                key={item.color}
                textValue={item.text}
                startContent={
                  <Circle fill={item.color} />
                  // <SvgIcon src={circle} className={`fill-[${item.color}]`} />
                }
              >
                <span>{item.text}</span>
              </SelectItem>
            )
          }
        </Select>
      </div>
    </div>
  )
}

export default ButtonAppearenceSettings