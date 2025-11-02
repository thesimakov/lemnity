import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

const Headline = ({ text }: { text: string }) => (
  <h2 className="text-4xl whitespace-pre-wrap font-bold leading-tight mb-2 text-center">{text}</h2>
)

const RewardContent = () => {
  const messages = useWidgetSettingsStore(s => s.settings.form.messages)
  const { onWin } = messages
  const { enabled: companyLogoEnabled, url: companyLogoUrl } = useWidgetSettingsStore(
    s => s.settings.form.companyLogo
  )

  return (
    <div className="flex flex-col gap-4 max-w-[300px] items-center justify-self-center">
      {companyLogoEnabled && (
        <img src={companyLogoUrl} alt="Company Logo" className="w-25 h-12.5 object-contain" />
      )}
      {onWin?.enabled && <Headline text={onWin?.text} />}
      <div className="h-10 w-full rounded-full bg-[#FFF57F] text-black font-medium flex items-center justify-center">
        Скидка 10%
      </div>
      <div className="text-sm opacity-90 text-center">
        Не забудьте использовать промокод во время оформления заказа!
      </div>
      <div
        className="flex flex-col gap-1 p-1 border border-dashed border-white w-full rounded-[10px] bg-[#0069FF] text-white/95 font-bold tracking-wider items-center justify-center"
        style={{ strokeDasharray: '5 !important' }}
      >
        <span className="text-xs font-normal">промокод</span>
        <span>PROMO-10P</span>
      </div>
    </div>
  )
}

export default RewardContent
