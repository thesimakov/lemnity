import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'

const Headline = ({ text, size }: { text: string; size?: number }) => (
  <h2
    className="whitespace-pre-wrap font-bold leading-tight mb-2 text-center"
    style={{ fontSize: size ? `${size}px` : undefined }}
  >
    {text}
  </h2>
)

const RewardContent = () => {
  const messages = useWidgetSettingsStore(s => s.settings.form.messages)
  const { onWin } = messages
  const { enabled: companyLogoEnabled, url: companyLogoUrl } = useWidgetSettingsStore(
    s => s.settings.form.companyLogo
  )

  const useCustomScheme = Boolean(
    onWin?.colorScheme?.enabled && onWin?.colorScheme?.scheme === 'custom'
  )

  const defaultDiscount = STATIC_DEFAULTS.form.messages.onWin.colorScheme.discount
  const defaultPromo = STATIC_DEFAULTS.form.messages.onWin.colorScheme.promo

  const discountTextColor = useCustomScheme
    ? (onWin?.colorScheme?.discount?.color ?? defaultDiscount.color)
    : defaultDiscount.color
  const discountBgColor = useCustomScheme
    ? (onWin?.colorScheme?.discount?.bgColor ?? defaultDiscount.bgColor)
    : defaultDiscount.bgColor

  const promoTextColor = useCustomScheme
    ? (onWin?.colorScheme?.promo?.color ?? defaultPromo.color)
    : defaultPromo.color
  const promoBgColor = useCustomScheme
    ? (onWin?.colorScheme?.promo?.bgColor ?? defaultPromo.bgColor)
    : defaultPromo.bgColor

  return (
    <div className="flex flex-col gap-4 max-w-[300px] items-center justify-self-center">
      {companyLogoEnabled && (
        <img src={companyLogoUrl} alt="Company Logo" className="w-25 h-12.5 object-contain" />
      )}
      {onWin?.enabled && <Headline text={onWin?.text} size={onWin?.textSize} />}
      <div
        className="h-10 w-full rounded-full font-medium flex items-center justify-center"
        style={{ backgroundColor: discountBgColor, color: discountTextColor }}
      >
        Скидка 10%
      </div>
      <div
        className="text-center opacity-90"
        style={{ fontSize: onWin?.descriptionSize ? `${onWin.descriptionSize}px` : undefined }}
      >
        {onWin?.description}
      </div>
      <div
        className="flex flex-col gap-1 p-2 border border-dashed w-full rounded-[10px] tracking-wider items-center justify-center"
        style={{ color: promoTextColor, backgroundColor: promoBgColor }}
      >
        <span className="text-xs font-normal">промокод</span>
        <span className="font-bold">PROMO-10P</span>
      </div>
    </div>
  )
}

export default RewardContent
