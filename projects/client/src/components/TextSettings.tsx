import { Input } from '@heroui/input'
import { cn } from '@heroui/theme'

import ColorPicker from "@/components/ColorPicker"

type FontSizeSettingsProps = {
  value: number
  onChange?: (value: number) => void
}

const FontSizeSettings = (props: FontSizeSettingsProps) => {
  const handleInputChange = (value: string) => {
    return props.onChange && props.onChange(Number(value))
  }

  return (
    <div
      className={cn(
        'w-48 shrink-0 px-2.5',
        'flex flex-row gap-2.5 items-center',
        'border border-[#E5E5E5] rounded-[5px]',
      )}
    >
      <span className="text-[16px] leading-4.75">
        Размер текста
      </span>

      <Input
        type="number"
        value={props.value.toString()}
        onValueChange={handleInputChange}
        min={0}
        classNames={{
          base: 'max-w-11.75',
          inputWrapper: cn(
            'rounded-md border bg-white border-[#E8E8E8] rounded-[5px]',
            'shadow-none h-10.5 px-2.5',
          ),
          input: cn(
            'text-base text-center',
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            '[&]:remove-spin-buttons'
          )
        }}
      />
    </div>
  )
}

type MessageSettingsProps = {
  title: string
  text: string
  fontSize?: number
  textColor: string
  placeholder?: string
  onTextChange: (value: string) => void
  onFontSizeChange?: (value: number) => void
  onColorChange: (value: string) => void
}

const TextSettings = (props: MessageSettingsProps) => {
  return (
    <div className="@container min-w-76 flex flex-col gap-2.5">
      <h3 className="text-[16px] leading-4.75 text-[#060606]">
        {props.title}
      </h3>

      <div className="flex flex-row flex-wrap gap-2.5">
        <Input
          placeholder={props.placeholder || "Введите текст"}
          value={props.text}
          onValueChange={props.onTextChange}
          classNames={{
            base: 'min-w-76 flex-1',
            inputWrapper: cn(
              'rounded-md border bg-white border-[#E8E8E8] rounded-[5px]',
              'shadow-none h-12.5 px-2.5',
            ),
            input: 'placeholder:text-[#AAAAAA] text-base'
          }}
        />
        <div
          className={cn(
            'w-full flex flex-row justify-between',
            '@min-[600px]:w-fit @min-[600px]:justify-normal',
            '@min-[600px]:gap-2.5',
          )}
        >
          {/* typeof props.fontSize === 'number */}
          {(props.fontSize || props.fontSize === 0) && (
            <FontSizeSettings
              value={props.fontSize}
              onChange={props.onFontSizeChange}
            />
          )}
          <ColorPicker
            initialColor={props.textColor}
            onColorChange={props.onColorChange}
          />
        </div>
      </div>
    </div>
  )
}

export default TextSettings
