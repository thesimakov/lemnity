import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { ReactElement } from 'react'
import DynamicFieldsForm from '../DynamicFieldsForm/DynamicFieldsForm'
import WheelOfFortune from '../../WheelOfFortune/WheelOfFortune'
import RewardContent from '../RewardContent/RewardContent'
import CloseButton from '../CloseButton/CloseButton'

type DesktopScreen = 'main' | 'prize' | 'panel'

// const Container = ({ children }: { children: ReactElement | ReactElement[] }) => (
//   <div className="w-full h-full p-4">{children}</div>
// )

const ModalChrome = ({
  children,
  hideCloseButton
}: {
  children: ReactElement | ReactElement[]
  hideCloseButton?: boolean
}) => {
  const template = useWidgetSettingsStore(s => s.settings.form.template)
  const { colorScheme, customColor } = template?.templateSettings || {}

  return (
    <div
      style={{ backgroundColor: colorScheme === 'primary' ? '' : customColor }}
      className="mx-auto w-full rounded-lg text-white relative p-4"
    >
      {!hideCloseButton && <CloseButton position="right" />}
      {children}
    </div>
  )
}

const SidePanelChrome = ({
  children,
  hideCloseButton
}: {
  children: ReactElement | ReactElement[]
  hideCloseButton?: boolean
}) => {
  const template = useWidgetSettingsStore(s => s.settings.form.template)
  const { colorScheme, customColor } = template?.templateSettings || {}

  return (
    <div className="mx-auto w-full h-full">
      <div className="flex h-full">
        <div className="flex-1 justify-center" />
        <div
          style={{ backgroundColor: colorScheme === 'primary' ? '' : customColor }}
          className="flex w-[550px] h-full items-center rounded-l-xl text-white relative overflow-hidden"
        >
          {!hideCloseButton && <CloseButton position="left" />}
          {children}
        </div>
      </div>
    </div>
  )
}

interface DesktopPreviewProps {
  screen: DesktopScreen
  hideCloseButton?: boolean
}

const DesktopPreview = ({ screen, hideCloseButton = false }: DesktopPreviewProps) => {
  // pull settings to ensure re-render on changes; future use: colors/texts
  useWidgetSettingsStore(s => s.settings)

  const sectors = useWidgetSettingsStore(s => s.settings.form.sectors)
  const contentPosition = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.contentPosition
  )

  const body = (
    <div className="flex items-center justify-center w-full h-full gap-4 p-6">
      {contentPosition === 'left' ? (
        <>
          {screen === 'main' || screen === 'panel' ? <DynamicFieldsForm /> : <RewardContent />}
          {screen !== 'prize' ? (
            <WheelOfFortune
              sectors={
                sectors.randomize
                  ? [...sectors.items].sort(() => Math.random() - 0.5)
                  : sectors.items
              }
            />
          ) : null}
        </>
      ) : (
        <>
          {screen !== 'prize' ? (
            <WheelOfFortune
              sectors={
                sectors.randomize
                  ? [...sectors.items].sort(() => Math.random() - 0.5)
                  : sectors.items
              }
            />
          ) : null}
          {screen === 'main' || screen === 'panel' ? (
            <DynamicFieldsForm centered />
          ) : (
            <RewardContent />
          )}
        </>
      )}
    </div>
  )

  if (screen === 'panel') {
    return <SidePanelChrome hideCloseButton={hideCloseButton}>{body}</SidePanelChrome>
  }

  return <ModalChrome hideCloseButton={hideCloseButton}>{body}</ModalChrome>
}

export default DesktopPreview
