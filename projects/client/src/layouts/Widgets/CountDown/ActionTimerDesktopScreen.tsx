import DynamicFieldsForm from '../Common/DynamicFieldsForm/DynamicFieldsForm'
import CountDown from './CountDown'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { DesktopScreenProps } from '../registry'
import Badge from './Badge'
import RewardContent from '../Common/RewardContent/RewardContent'
import { useFormSettings } from '@/stores/widgetSettings/formHooks'

const ActionTimerDesktopScreen = ({ screen, onSubmit }: DesktopScreenProps) => {
  const companyLogo = useWidgetSettingsStore(s => s?.settings?.form.companyLogo)
  const { settings } = useFormSettings()
  const contentPosition =
    useWidgetSettingsStore(s => s.settings?.form.template?.templateSettings?.contentPosition) ??
    'left'

  const layoutClasses = `grid grid-cols-2 items-stretch w-full h-full min-h-full`
  const isPrize = screen === 'prize'

  const form = (
    <div className="flex flex-col h-full min-h-[500px] items-center justify-between gap-6">
      <Badge className="mx-auto" />
      <DynamicFieldsForm onSubmit={onSubmit} noPadding />
      <div></div>
    </div>
  )
  const rewardContent = (
    <RewardContent companyLogo={companyLogo} onWin={settings?.messages?.onWin} />
  )

  const content = <CountDown />

  if (screen === 'panel') {
    return (
      <div className="grid grid-cols-1 gap-4 w-full h-full p-5">
        {contentPosition === 'left' ? (
          <>
            {content}
            <div className="bg-white p-5 shadow-sm">
              <DynamicFieldsForm onSubmit={onSubmit} centered />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 shadow-sm">
              <DynamicFieldsForm onSubmit={onSubmit} centered />
            </div>
            {content}
          </>
        )}
      </div>
    )
  }

  if (isPrize) {
    return <div className="flex w-full h-full items-center justify-center p-6">{rewardContent}</div>
  }

  return (
    <div className={layoutClasses}>
      {contentPosition === 'left' ? (
        <>
          {content}
          <div className="p-6">{form}</div>
        </>
      ) : (
        <>
          <div className="p-6">{form}</div>
          {content}
        </>
      )}
    </div>
  )
}

export default ActionTimerDesktopScreen
