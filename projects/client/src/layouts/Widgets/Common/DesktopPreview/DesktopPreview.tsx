import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { forwardRef, type ReactElement, type Ref } from 'react'
import DynamicFieldsForm from '../DynamicFieldsForm/DynamicFieldsForm'
import WheelOfFortune from '../../WheelOfFortune/WheelOfFortune'
import RewardContent from '../RewardContent/RewardContent'
import CloseButton from '../CloseButton/CloseButton'

type DesktopScreen = 'main' | 'prize' | 'panel'

// const Container = ({ children }: { children: ReactElement | ReactElement[] }) => (
//   <div className="w-full h-full p-4">{children}</div>
// )

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
        style={{ backgroundColor: colorScheme === 'primary' ? '' : customColor }}
        className="mx-auto rounded-lg text-white relative p-4 w-[928px] h-[500px]"
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

const DesktopPreview = (
  { screen, hideCloseButton = false }: DesktopPreviewProps,
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
      className={`flex items-center justify-center w-full h-full gap-4 ${screen === 'panel' ? 'py-10' : 'p-10'}`}
    >
      {contentPosition === 'left' ? (
        <>
          {screen === 'main' || screen === 'panel' ? <DynamicFieldsForm /> : <RewardContent />}
          {screen !== 'prize' ? (
            <WheelOfFortune
              className={screen === 'panel' ? 'scale-200 translate-x-25' : ''}
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
              className={screen === 'panel' ? 'scale-200 -translate-x-25' : ''}
              sectors={
                sectors.randomize
                  ? [...sectors.items].sort(() => Math.random() - 0.5)
                  : sectors.items
              }
            />
          ) : null}
          {screen === 'main' || screen === 'panel' ? <DynamicFieldsForm /> : <RewardContent />}
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
