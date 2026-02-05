import { Radio, RadioGroup } from "@heroui/radio"
import { cn } from "@heroui/theme"

type CustomRadio = {
  children: React.ReactNode
  value: string
}

export const CustomRadio = (props: CustomRadio) => {
  return (
    <Radio
      value={props.value}
      classNames={{
        base: cn(
          'inline-flex m-0 h-13 bg-content1 hover:bg-content2',
          'flex-row flex-1 grow max-w-1/2 cursor-pointer rounded-lg gap-4 p-4',
          'items-center border border-[#E8E8E8]',
          'data-[selected=true]:border-[#E8E8E8] px-2.5',
        ),
        control: 'bg-black w-3 h-3',
        wrapper: cn(
          'border-[#E8E8E8] group-data-[selected=true]:border-black',
          'flex items-center justify-center'
        ),
        label: 'text-[#797979] group-data-[selected=true]:text-black',
        labelWrapper: '',
      }}
    >
      {props.children}
    </Radio>
  )
}

type CustomRadioGroupOption = {
  label: string
  value: string
}

type CustomRadioGroupProps = {
  options: CustomRadioGroupOption[]
  value?: string
  onValueChange?: (value: string) => void
}

const CustomRadioGroup = (props: CustomRadioGroupProps) => {
  return (
    <RadioGroup
      value={props.value}
      onValueChange={props.onValueChange}
      orientation="horizontal"
      classNames={{
        wrapper: 'gap-2.5'
      }}
    >
      {props.options.map((option) => (
        <CustomRadio key={option.value} value={option.value}>
          {option.label}
        </CustomRadio>
      ))}
    </RadioGroup>
  )
}

export default CustomRadioGroup
