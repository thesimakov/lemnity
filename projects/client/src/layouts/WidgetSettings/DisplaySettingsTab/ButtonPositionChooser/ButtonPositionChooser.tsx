import type { ReactNode } from 'react'
import type { ButtonPosition } from '@/stores/widgetSettingsStore'

type ButtonPositionChooserProps = {
  title?: string
  value: ButtonPosition
  onChange: (value: ButtonPosition) => void
  options?: ButtonPosition[]
}

const Dot = ({ className = '' }: { className?: string }) => (
  <span className={`absolute w-3 h-3 rounded-full bg-[#D4D4D8] ${className}`} />
)

type CardProps = {
  selected: boolean
  onClick: () => void
  children?: ReactNode
}

const OptionCard = ({ selected, onClick, children }: CardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-20 h-20 rounded-md border border-[2px] transition-colors ${
        selected ? 'border-[#7C3AED]' : 'border-[#D4D4D8]'
      } bg-white`}
      aria-pressed={selected}
    >
      {children}
    </button>
  )
}

const POSITION_DOT_CLASS: Record<ButtonPosition, string> = {
  'bottom-left': 'left-2 bottom-2',
  'top-right': 'top-2 right-3',
  'bottom-right': 'bottom-2 right-3'
}

const DEFAULT_POSITIONS: ButtonPosition[] = ['bottom-left', 'top-right', 'bottom-right']

const ButtonPositionChooser = ({
  title = 'Положение кнопки открытия',
  value,
  onChange,
  options
}: ButtonPositionChooserProps) => {
  const availableOptions = options?.length ? options : DEFAULT_POSITIONS
  const normalizedValue = availableOptions.includes(value) ? value : availableOptions[0]

  return (
    <div className="flex flex-col gap-3 rounded-md border border-[#E8E8E8] p-3">
      <span className="text-black">{title}</span>
      <div className="rounded-md border border-[#E8E8E8] p-2">
        <div className="flex gap-2">
          {availableOptions.map(position => (
            <OptionCard
              key={position}
              selected={normalizedValue === position}
              onClick={() => onChange(position)}
            >
              <Dot className={POSITION_DOT_CLASS[position] ?? ''} />
            </OptionCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ButtonPositionChooser
