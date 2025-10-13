import { Checkbox } from '@heroui/checkbox'

export type CheckboxFieldProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  required?: boolean
  onRequiredChange?: (required: boolean) => void
  disabled?: boolean
  showRequired?: boolean
}

const CheckboxField = ({
  label,
  checked,
  onChange,
  required = false,
  onRequiredChange,
  disabled = false,
  showRequired = true
}: CheckboxFieldProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
      <Checkbox
        isSelected={checked}
        onValueChange={onChange}
        isDisabled={disabled}
        classNames={{
          wrapper:
            'before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
          base: 'max-w-full',
          label: 'text-gray-700 text-base'
        }}
      >
        {label}
      </Checkbox>
      {showRequired && (
        <>
          <div className="h-5 w-px bg-gray-900 mx-2 ml-auto" />
          <Checkbox
            isSelected={required}
            onValueChange={onRequiredChange}
            isDisabled={disabled || !checked}
            classNames={{
              wrapper:
                'before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
              base: 'max-w-full',
              label: 'text-gray-500 text-sm'
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
