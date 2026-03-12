import { cn } from '@heroui/theme'
import Input from './Input'

type FontSizeSettingsProps = {
  value: number
  xs?: boolean
  onChange?: (value: number) => void
}

const FontSizeSettings = (props: FontSizeSettingsProps) => {
  const handleInputChange = (value: string) => {
    return props.onChange && props.onChange(Number(value))
  }

  return (
    <div
      className={cn(
        'shrink-0 px-2.5',
        props.xs ? 'w-30 h-10' : 'w-48 h-12.5 ',
        'flex flex-row gap-2.5 items-center',
        'border border-[#E5E5E5] rounded-[5px] bg-white',
      )}
    >
      <span className='text-[16px] leading-4.75'>
        {props.xs ? 'Текст' : 'Размер текста'}
      </span>

      <Input
        type='number'
        value={props.value.toString()}
        onValueChange={handleInputChange}
        min={0}
        classNames={{
          base: 'min-w-[unset] max-w-11.75',
          inputWrapper: cn(
            'min-h-[unset]',
            props.xs ? 'max-h-7' : 'max-h-10.5'
          ),
          input: cn(
            'text-center',
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            '[&]:remove-spin-buttons'
          )
        }}
      />
    </div>
  )
}

export default FontSizeSettings
