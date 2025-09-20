import SvgIcon from '@/components/SvgIcon'
import iconDesktop from '@/assets/icons/desktop.svg'
import iconPhonePortrait from '@/assets/icons/phone-portrait.svg'

const MetricCard = ({
  value,
  desktop = 0,
  mobile = 0,
  pillColor = 'bg-gray-100 text-gray-700',
  isPercent = false
}: {
  value: string | number
  desktop?: number
  mobile?: number
  pillColor?: string
  isPercent?: boolean
}) => {
  return (
    <div className="flex flex-col gap-2 border-l border-gray-300 pl-4 items-start">
      <div className={`inline-flex h-7 items-center rounded-full px-2 text-sm ${pillColor}`}>
        {typeof value === 'number'
          ? isPercent
            ? `${value.toLocaleString('ru-RU')}%`
            : value.toLocaleString('ru-RU')
          : value}
      </div>
      <div className="flex items-center gap-1">
        <SvgIcon src={iconDesktop} size={'16px'} className="text-[#373737]" />
        <span className="text-[#373737]">{desktop.toLocaleString('ru-RU')}</span>
      </div>
      <div className="flex items-center gap-1">
        <SvgIcon src={iconPhonePortrait} size={'16px'} className="text-[#373737]" />
        <span className="text-[#373737]">{mobile.toLocaleString('ru-RU')}</span>
      </div>
    </div>
  )
}

export default MetricCard
