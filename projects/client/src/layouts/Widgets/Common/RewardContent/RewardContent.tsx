import { useFormSettings } from '@/stores/widgetSettings/formHooks'

const Headline = ({ text, size }: { text: string; size?: number }) => (
  <h2
    className="whitespace-pre-wrap font-bold leading-tight mb-2 text-center"
    style={{ fontSize: size ? `${size}px` : undefined }}
  >
    {text}
  </h2>
)

type ColorScheme = {
  enabled?: boolean
  scheme?: 'primary' | 'custom'
  discount?: { color?: string; bgColor?: string }
  promo?: { color?: string; bgColor?: string }
}

export type RewardContentProps = {
  companyLogo?: { enabled?: boolean; url?: string }
  onWin?: {
    enabled?: boolean
    text?: string
    textSize?: number
    description?: string
    descriptionSize?: number
    colorScheme?: ColorScheme
  }
  className?: string
}

const RewardContent = ({ companyLogo, onWin, className }: RewardContentProps) => {
  const { settings } = useFormSettings()
  const defaultOnWin = settings.messages?.onWin ?? onWin
  if (!defaultOnWin?.enabled) return null
  const discountText = 'Скидка 10%'
  const promoLabel = 'промокод'
  const promoCode = 'PROMO-10P'
  const scheme = defaultOnWin.colorScheme ?? {}
  const hasCustomScheme = Boolean(scheme.enabled && scheme.scheme === 'custom')
  const discountTextColor = hasCustomScheme ? (scheme.discount?.color ?? '#000000') : '#000000'
  const discountBgColor = hasCustomScheme ? (scheme.discount?.bgColor ?? '#FFF57F') : '#FFF57F'
  const promoTextColor = hasCustomScheme ? (scheme.promo?.color ?? '#FFFFFF') : '#FFFFFF'
  const promoBgColor = hasCustomScheme ? (scheme.promo?.bgColor ?? '#0069FF') : '#0069FF'

  return (
    <div
      className={`flex flex-col gap-4 max-w-[300px] items-center justify-self-center ${className ?? ''}`}
    >
      {companyLogo?.enabled && companyLogo.url && (
        <img src={companyLogo.url} alt="Company Logo" className="w-25 h-12.5 object-contain" />
      )}
      <Headline text={defaultOnWin.text ?? ''} size={defaultOnWin.textSize} />
      <div
        className="h-10 w-full rounded-full font-medium flex items-center justify-center"
        style={{ backgroundColor: discountBgColor, color: discountTextColor }}
      >
        {discountText}
      </div>
      <div
        className="text-center opacity-90"
        style={{
          fontSize: defaultOnWin.descriptionSize ? `${defaultOnWin.descriptionSize}px` : undefined
        }}
      >
        {defaultOnWin.description}
      </div>
      <div
        className="flex flex-col gap-1 p-2 border border-dashed w-full rounded-[10px] tracking-wider items-center justify-center"
        style={{ color: promoTextColor, backgroundColor: promoBgColor }}
      >
        <span className="text-xs font-normal">{promoLabel}</span>
        <span className="font-bold">{promoCode}</span>
      </div>
    </div>
  )
}

export default RewardContent
