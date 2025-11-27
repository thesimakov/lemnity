import DynamicFieldsForm from '../Common/DynamicFieldsForm/DynamicFieldsForm'
import CountDown from './CountDown'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { DesktopScreenProps } from '../registry'
import Badge from './Badge'
import RewardContent from '../Common/RewardContent/RewardContent'
import { useFieldsSettings } from '@/stores/widgetSettings/fieldsHooks'

const ActionTimerDesktopScreen = ({ screen, onSubmit }: DesktopScreenProps) => {
  const companyLogo = useWidgetSettingsStore(s => s?.settings?.fields?.companyLogo)
  const imageMode = useWidgetSettingsStore(
    s => s?.settings?.fields?.template?.templateSettings?.imageMode
  )
  const { settings } = useFieldsSettings()
  const contentPosition =
    useWidgetSettingsStore(s => s.settings?.fields?.template?.templateSettings?.contentPosition) ??
    'left'

  const layoutClasses = `grid grid-cols-2 items-stretch w-full ${contentPosition === 'left' ? 'pl-6' : 'pr-6'}`
  const isPrize = screen === 'prize'

  const form = (
    <div className="flex flex-col items-center justify-between h-full">
      <Badge className="mx-auto mb-3" />
      <DynamicFieldsForm onSubmit={onSubmit} noPadding centered />
      <div></div>
    </div>
  )
  const rewardContent = (
    <RewardContent companyLogo={companyLogo} onWin={settings?.messages?.onWin} />
  )

  const content = imageMode == 'background' ? null : <CountDown />
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
          <div className="h-full py-6">{content}</div>
          <div className="p-6">{form}</div>
        </>
      ) : (
        <>
          <div className="p-6">{form}</div>
          <div className="h-full py-6">{content}</div>
        </>
      )}
    </div>
  )
}

export default ActionTimerDesktopScreen
