import SvgIcon from '@/components/SvgIcon'
import chevronDown from '@/assets/icons/chevron-down.svg'

type ColorAccessoryProps = {
  label?: string
  color?: string
  onChange: (color: string) => void
  classNames?: {
    label?: string
    input?: string
    svgIcon?: string
  }
}

const ColorAccessory = ({
  label,
  color = '#FFFFFF',
  onChange,
  classNames
}: ColorAccessoryProps) => {
  return (
    <label
      className={`inline-flex items-center h-14 px-3 rounded-md border-2 border-[#E4E4E7] bg-white cursor-pointer ${classNames?.label}`}
    >
      {label ? <span className="mr-2">{label}</span> : null}
      <span
        className="inline-block w-6 h-6 rounded-full border border-black"
        style={{ backgroundColor: color }}
      />
      <input
        type="color"
        value={color}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none w-min h-8 opacity-0 cursor-pointer ${classNames?.input}`}
        aria-label="Выбор цвета"
      />
      <SvgIcon
        src={chevronDown}
        size={'20px'}
        className={`w-min h-min text-black ${classNames?.svgIcon}`}
      />
    </label>
  )
}

export default ColorAccessory
