import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { forwardRef, type ReactElement, type Ref } from 'react'
import DynamicFieldsForm from '../DynamicFieldsForm/DynamicFieldsForm'
import WheelOfFortune from '../../WheelOfFortune/WheelOfFortune'
import RewardContent from '../RewardContent/RewardContent'
import CloseButton from '../CloseButton/CloseButton'

type DesktopScreen = 'main' | 'prize' | 'panel'

const ModalChrome = forwardRef(
  (
    {
      children,
      hideCloseButton
    }: {
      children: ReactElement | ReactElement[]
      hideCloseButton?: boolean
    },
    ref: Ref<HTMLDivElement> | undefined
  ) => {
    const template = useWidgetSettingsStore(s => s.settings.form.template)
    const { colorScheme, customColor } = template?.templateSettings || {}

    return (
      <div
        style={{ backgroundColor: colorScheme === 'primary' ? '#725DFF' : customColor }}
        className="mx-auto rounded-lg text-white relative p-4 w-[928px] min-h-[500px] flex items-center"
        ref={ref}
      >
        {!hideCloseButton && <CloseButton position="right" />}
        {children}
      </div>
    )
  }
)

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
          style={{ backgroundColor: colorScheme === 'primary' ? '#725DFF' : customColor }}
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
  onSubmit: () => void
  spinTrigger?: number
}

const DesktopPreview = (
  { screen, hideCloseButton = false, onSubmit, spinTrigger }: DesktopPreviewProps,
  ref: Ref<HTMLDivElement> | undefined
) => {
  // pull settings to ensure re-render on changes; future use: colors/texts
  useWidgetSettingsStore(s => s.settings)

  const sectors = useWidgetSettingsStore(s => s.settings.form.sectors)
  const contentPosition = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.contentPosition
  )

  const body = (
    <div
      className={`grid grid-cols-${screen !== 'prize' ? '2' : '1'} items-center justify-center w-full h-full ${screen === 'panel' ? 'py-10' : ''}`}
    >
      {contentPosition === 'left' ? (
        <>
          {screen === 'main' || screen === 'panel' ? (
            <DynamicFieldsForm onSubmit={onSubmit} />
          ) : (
            <RewardContent />
          )}
          {screen !== 'prize' ? (
            <WheelOfFortune
              className={screen === 'panel' ? 'scale-200 translate-x-25' : 'pr-5'}
              pointerPositionDeg={0}
              sectors={
                sectors.randomize
                  ? [...sectors.items].sort(() => Math.random() - 0.5)
                  : sectors.items
              }
              spinTrigger={spinTrigger}
            />
          ) : null}
        </>
      ) : (
        <>
          {screen !== 'prize' ? (
            <WheelOfFortune
              className={screen === 'panel' ? 'scale-200 -translate-x-25' : 'pr-5'}
              pointerPositionDeg={180}
              sectors={
                sectors.randomize
                  ? [...sectors.items].sort(() => Math.random() - 0.5)
                  : sectors.items
              }
              spinTrigger={spinTrigger}
            />
          ) : null}
          {screen === 'main' || screen === 'panel' ? (
            <DynamicFieldsForm onSubmit={onSubmit} />
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

  return (
    <ModalChrome ref={ref} hideCloseButton={hideCloseButton}>
      {body}
    </ModalChrome>
  )
}

export default forwardRef(DesktopPreview)
