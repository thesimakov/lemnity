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
          'inline-flex m-0 h-12.75 bg-content1 hover:bg-content2',
          'flex-row flex-1 grow min-w-53 max-w-none cursor-pointer rounded-lg gap-4 p-4',
          'items-center border',
          'border-[#E8E8E8]/60 data-[selected=true]:border-[#E8E8E8] px-2.5',
        ),
        control: 'bg-black w-3.5 h-3.5',
        wrapper: cn(
          'border-[#E8E8E8] group-data-[selected=true]:border-black border-small',
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
  payloadNode?: React.ReactNode
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
      {props.options.map((option) => {
        return (
          <>
            {option.value === 'custom'
              ? (
                <div className="flex flex-1 flex-row gap-2.5">
                  <CustomRadio key={option.value} value={option.value}>
                    {option.label}
                  </CustomRadio>
                  {option.payloadNode}
                </div>
              )
              : (
                <CustomRadio key={option.value} value={option.value}>
                  {option.label}
                </CustomRadio>
              )
            }
          </>
        )
      })}
    </RadioGroup>
  )
}

export default CustomRadioGroup
