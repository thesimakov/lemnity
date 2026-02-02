import { type FC } from 'react'
import SvgIcon from '../../components/SvgIcon'

interface StatsCardProps {
  title: string
  amount: number
  currency?: string
  iconColor?: string
  tip?: string
  isNegative?: boolean
  className?: string
  maxAmount?: number
  icon: string
  delta?: {
    value: number
    isPositive: boolean
    showArrow?: boolean
  }
}

const StatsCard: FC<StatsCardProps> = ({
  title,
  amount,
  currency,
  icon,
  iconColor,
  tip,
  isNegative = false,
  className = '',
  maxAmount,
  delta
}) => {
  const formatAmount = (value: number) => {
    const sign = isNegative ? '-' : ''
    return `${sign}${Math.abs(value)}`
  }

  const getBackgroundClass = (color: string | undefined) => {
    if (!color) return ''

    const colorMap: { [key: string]: string } = {
      'orange-500': 'bg-orange-500/25',
      'blue-500': 'bg-blue-500/25',
      'yellow-500': 'bg-yellow-500/25',
      'purple-500': 'bg-purple-500/25'
    }

    return colorMap[color] || ''
  }

  const getTextColorClass = (color: string | undefined) => {
    if (!color) return ''

    const colorMap: { [key: string]: string } = {
      'orange-500': 'text-orange-500',
      'blue-500': 'text-blue-500',
      'yellow-500': 'text-yellow-500',
      'purple-500': 'text-purple-500'
    }

    return colorMap[color] || ''
  }

  return (
    <div
      className={`relative flex flex-col gap-[9px] justify-between font-roboto
    min-h-42 h-auto w-full max-w-[195px]
    aspect-6/5
    bg-[#F7FBFF] rounded-[5px] border border-gray-200
    p-1 lg:p-2 pr-0.5 md:pr-0.5 lg:pr-0.5 xl:pr-1.5 ${className || ''}`}
    >
      <div className="relative gap-2">
        <div className="flex items-start justify-between">
          <span className="font-normal text-xs 2xl:text-base">{title}</span>
          {delta && (
            <div className="flex items-center gap-1 text-xs 2xl:text-base">
              <span
                className={`font-medium ${delta.isPositive ? 'text-green-500' : 'text-red-500'}`}
              >
                {delta.isPositive ? '+' : '-'}
                {delta.value}
                {currency ? ' ₽' : ''}
              </span>
              {delta.showArrow && (
                <span className={`${delta.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {delta.isPositive ? '↑' : '↓'}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`text-sm 2xl:text-xl`}>
          <span
            className={`${isNegative || amount == maxAmount ? 'text-[#FF5183]' : 'text-black'}`}
          >
            {formatAmount(amount)} {currency}
          </span>
          {maxAmount && <span> | {maxAmount}</span>}
        </div>
      </div>
      <hr className="mt-auto border-[#C0C0C0]" />
      <div className="relative z-10 min-h-[36px] 2xl:min-h-[50px] flex flex-row justify-between w-full">
        {tip && <p className="text-[8px] 2xl:text-xs">{tip}</p>}
        <div
          className={`${getBackgroundClass(iconColor)} ${getTextColorClass(iconColor)} ml-auto pointer-events-none h-[34px] w-[34px] min-w-[34px] min-h-[34px] flex-shrink-0 border-1 rounded-sm border-gray-200`}
        >
          <SvgIcon src={icon} className={`select-none ${iconColor || ''}`} size="80%" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
