import type { ReactNode } from 'react'
import type { ButtonPosition } from '@/stores/widgetSettingsStore'

type ButtonPositionChooserProps = {
  title?: string
  value: ButtonPosition
  onChange: (value: ButtonPosition) => void
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

const ButtonPositionChooser = ({
  title = 'Положение кнопки открытия',
  value,
  onChange
}: ButtonPositionChooserProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-[#E8E8E8] p-3">
      <span className="text-black">{title}</span>
      <div className="rounded-md border border-[#E8E8E8] p-2">
        <div className="flex gap-2">
          <OptionCard selected={value === 'bottom-left'} onClick={() => onChange('bottom-left')}>
            <Dot className="left-2 bottom-2" />
          </OptionCard>
          <OptionCard selected={value === 'top-right'} onClick={() => onChange('top-right')}>
            <Dot className="top-2 right-3" />
          </OptionCard>
          <OptionCard selected={value === 'bottom-right'} onClick={() => onChange('bottom-right')}>
            <Dot className="bottom-2 right-3" />
          </OptionCard>
        </div>
      </div>
    </div>
  )
}

export default ButtonPositionChooser
