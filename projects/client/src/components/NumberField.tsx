import { Input } from '@heroui/input'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'

export type NumberFieldProps = {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  noBorder?: boolean
  classNames?: {
    container?: string
    base?: string
    input?: string
    inputWrapper?: string
    label?: string
    inputLabel?: string
  }
}

const NumberField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  noBorder = false,
  classNames = {
    container: '',
    label: '',
    base: '',
    input: '',
    inputWrapper: '',
    inputLabel: ''
  }
}: NumberFieldProps) => {
  const handleChange = (val: string) => {
    const trimmed = val.trim()
    if (trimmed === '') {
      onChange(0)
      return
    }
    const num = Number(trimmed)
    if (Number.isFinite(num)) {
      let finalValue = num
      if (min !== undefined && num < min) {
        finalValue = min
      }
      if (max !== undefined && num > max) {
        finalValue = max
      }
      onChange(finalValue)
    }
  }

  const getInputBorder = (children: React.ReactNode) => (
    <BorderedContainer
      className={`flex items-center py-1 pr-2 border border-[#E4E4E7] ${classNames?.container}`}
    >
      {children}
    </BorderedContainer>
  )

  const getInput = () => (
    <>
      {label && (
        <span className={`text-gray-700 text-base whitespace-nowrap mr-3 ${classNames?.label}`}>
          {label}
        </span>
      )}
      <Input
        type="number"
        value={String(value)}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        isDisabled={disabled}
        radius="sm"
        variant="bordered"
        classNames={{
          label: classNames?.inputLabel,
          base: `flex-1 ${classNames?.base ?? ''}`.trim(),
          input: `min-w-[40px] text-center ${classNames?.input ?? ''}`.trim(),
          inputWrapper:
            `px-0 flex justify-center items-center bg-white border-gray-200 ${classNames?.inputWrapper ?? ''}`.trim()
        }}
      />
    </>
  )

  return noBorder ? getInput() : getInputBorder(getInput())
}

export default NumberField
