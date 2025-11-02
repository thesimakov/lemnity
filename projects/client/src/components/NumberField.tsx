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
    base?: string
    input?: string
    inputWrapper?: string
    label?: string
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
    base: '',
    input: '',
    inputWrapper: '',
    label: ''
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
    <BorderedContainer className="flex-row items-center gap-2 px-3 h-10 border border-[#E4E4E7]">
      {children}
    </BorderedContainer>
  )

  const getInput = () => (
    <>
      {label && <span className="text-gray-700 text-base">{label}</span>}
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
          label: classNames?.label,
          base: classNames?.base,
          input: 'text-center ' + classNames?.input,
          inputWrapper: 'px-0 w-full bg-white border-gray-200 ' + classNames?.inputWrapper
        }}
      />
    </>
  )

  return noBorder ? getInput() : getInputBorder(getInput())
}

export default NumberField
