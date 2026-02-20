import { Checkbox } from '@heroui/checkbox'
import { cn } from '@heroui/theme'

export type CheckboxFieldProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  required?: boolean
  onRequiredChange?: (required: boolean) => void
  disabled?: boolean
  showRequired?: boolean
}

const CheckboxField = (props: CheckboxFieldProps) => {
  return (
    <div
      className={cn(
        'flex flex-col flex-wrap items-center justify-between gap-2.5',
        'min-[438px]:flex-row px-4 py-3',
        'bg-white border border-[#E8E8E8] rounded-[5px] @container',
      )}
    >
      <Checkbox
        isSelected={props.checked}
        onValueChange={props.onChange}
        isDisabled={props.disabled}
        classNames={{
          wrapper: cn(
            'before:border-[#373737] rounded-[4px] before:rounded-[4px]',
            'after:rounded-[4px] after:bg-[#373737]',
          ),
          base: 'max-w-full min-w-40',
          label: 'text-[#797979] text-base',
        }}
      >
        {props.label}
      </Checkbox>
      {props.showRequired && (
        <>
          <div
            className={cn(
              'h-5 w-px bg-gray-900 mx-2 ml-auto',
              'hidden @min-[440px]:block',
            )}
          />
          <Checkbox
            isSelected={props.required}
            onValueChange={props.onRequiredChange}
            isDisabled={props.disabled || !props.checked}
            classNames={{
              wrapper: cn(
                'before:border-[#373737] rounded-[4px] before:rounded-[4px]',
                'after:rounded-[4px] after:bg-[#373737]',
              ),
              base: 'max-w-full',
              label: 'text-[#797979] text-base',
            }}
          >
            Обязательно для заполнения
          </Checkbox>
        </>
      )}
    </div>
  )
}

export default CheckboxField
