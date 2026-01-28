import { cn } from '@heroui/theme'
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover'
import { Input } from '@heroui/input'
import { useState } from 'react'
import { Button } from '@heroui/button'
import { useMask } from '@react-input/mask'
import useDebouncedCallback from '@/hooks/useDebouncedCallback'

type ColorCircleProps = {
  color: string
  stroke?: string
  selected?: boolean
  onColorChange: (color: string) => void
}

const ColorCircle = (props: ColorCircleProps) => {
  return (
    <div
      className={cn(
        'rounded-full w-9.5 h-9.5 cursor-pointer',
        'box-content border-3 border-white',
        props.stroke && !props.selected && 'border m-0.5'
      )}
      style={{
        backgroundColor: props.color,
        borderColor: props.selected ? '#9747FF' : props.stroke
      }}
      onClick={() => props.onColorChange(props.color)}
    />
  )
}

const TriggerColorCircle = (props: { fill: string; stroke?: string }) => {
  return (
    <svg
      className="shrink-0"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="9.5" fill={props.fill} stroke={props.stroke ?? 'black'} />
    </svg>
  )
}

type ColorPickerItem = {
  color: string
  stroke?: string
}

type ColorPickerProps = {
  initialColor: string
  triggerText?: string
  onColorChange: (color: string) => void
}

const defaultColors: ColorPickerItem[] = [
  { color: '#000000' },
  { color: '#757575' },
  { color: '#F14821' },
  { color: '#FF9E43' },
  { color: '#FFC943' },
  { color: '#66D576' },
  { color: '#5AD8CC' },
  { color: '#3DADFF' },
  { color: '#884EFF' },
  { color: '#FB4ABF' },
  { color: '#FFC0EB' },
  { color: '#FFFFFF', stroke: '#6E4949' },
  { color: '#B3B3B3' },
  { color: '#D9D9D9' },
  { color: '#FEC7C2' },
  { color: '#FFE1BF' },
  { color: '#FFEBBC' },
  { color: '#CCF4D2' },
  { color: '#C6FAF8' },
  { color: '#C1E5FF' },
  { color: '#DDD3F4' }
]

const ColorPicker = ({ initialColor, triggerText, onColorChange }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState(() => initialColor)
  const [inputValue, setInputValue] = useState(() => initialColor)

  const inputRef = useMask({
    mask: '#______',
    replacement: { _: /[0-9a-fA-F]/ },
    showMask: false
  })

  const isValidHex = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    return cleanHex.length === 6 || cleanHex.length === 0
  }

  const isInvalid = !isValidHex(inputValue)

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    setInputValue(color)
    onColorChange(color)
  }

  const debouncedOnColorChange = useDebouncedCallback(onColorChange, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase()
    setInputValue(value)
    setSelectedColor(value)
    debouncedOnColorChange(value)
  }

  return (
    <Popover
      placement="bottom-start"
      classNames={{
        base: cn('bg-white rounded-[10px]', 'shadow-[0px_8px_15px_6px_rgba(0,0,0,0.15)]'),
        content: cn('w-149.5 h-30.5 flex-row flex-wrap gap-0.75 p-4 justify-start')
      }}
    >
      <PopoverTrigger>
        <Button
          className={cn(
            'rounded-[5px] h-12.75 bg-white',
            'border border-[#E4E4E7] p-3.75',
            'flex items-center justify-center gap-1.25',
            triggerText ? 'min-w-45 flex-1' : 'w-18 shrink-0'
          )}
        >
          {triggerText && <span className="text-base text-[#797979]">{triggerText}</span>}
          <TriggerColorCircle fill={selectedColor} />
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="1em"
            className="w-4 h-4 transition-transform duration-150 ease motion-reduce:transition-none data-[open=true]:rotate-180"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {defaultColors.map(item => (
          <ColorCircle
            key={item.color}
            color={item.color}
            stroke={item.stroke}
            selected={item.color.toUpperCase() === selectedColor.toUpperCase()}
            onColorChange={handleColorChange}
          />
        ))}

        <Input
          ref={inputRef}
          placeholder="Свой код"
          value={inputValue}
          onChange={handleChange}
          spellCheck="false"
          isInvalid={isInvalid}
          isRequired
          classNames={{
            base: 'w-33.5 ml-1',
            inputWrapper: cn(
              'rounded-md border bg-white border-[#E8E8E8] rounded-[5px]',
              'shadow-none h-10.5 px-2.5'
            ),
            input: 'text-base text-center'
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker
