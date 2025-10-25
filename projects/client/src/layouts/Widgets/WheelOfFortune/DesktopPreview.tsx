import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { ReactElement } from 'react'
import DynamicFieldsForm from '../DynamicFieldsForm/DynamicFieldsForm'
import { Button } from '@heroui/button'
import WheelOfFortune from './WheelOfFortune'

type DesktopScreen = 'main' | 'prize' | 'panel'

const Container = ({ children }: { children: ReactElement | ReactElement[] }) => (
  <div className="w-full h-full">{children}</div>
)

const ModalChrome = ({ children }: { children: ReactElement | ReactElement[] }) => (
  <div className="mx-auto w-full rounded-xl bg-[#7B57F2] text-white relative">
    <Button
      variant="light"
      size="sm"
      className="absolute rounded-[4px] right-4 top-4 w-7 h-5 bg-white/30 text-white"
    >
      Свернуть
    </Button>
    {children}
  </div>
)

const SidePanelChrome = ({ children }: { children: ReactElement | ReactElement[] }) => (
  <div className="mx-auto w-full h-full">
    <div className="flex h-full">
      <div className="flex-1 justify-center" />
      <div className="flex w-[550px] h-full items-center rounded-xl bg-[#7B57F2] text-white relative">
        <Button
          variant="light"
          size="sm"
          className="absolute rounded-[4px] right-4 top-4 w-7 h-5 bg-white/30 text-white"
        >
          Свернуть
        </Button>
        {children}
      </div>
    </div>
  </div>
)

const Headline = ({ text }: { text: string }) => (
  <h2 className="text-4xl font-bold leading-tight mb-2 text-center">{text}</h2>
)

const PrizeStub = () => {
  const messages = useWidgetSettingsStore(s => s.settings.form.messages)
  const { onWin } = messages

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {onWin?.enabled && <Headline text={onWin?.text} />}
      <div className="h-10 w-full rounded-full bg-[#FFF57F] text-black font-medium flex items-center justify-center">
        Скидка 10%
      </div>
      <div className="text-sm opacity-90 text-center">
        Не забудьте использовать промокод во время оформления заказа!
      </div>
      <div className="flex flex-col gap-1 p-1  w-full rounded bg-[#0069FF] text-white/95 font-bold tracking-wider items-center justify-center">
        <span className="text-xs font-normal">промокод</span>
        <span>PROMO-10P</span>
      </div>
    </div>
  )
}

const DesktopPreview = ({ screen }: { screen: DesktopScreen }) => {
  // pull settings to ensure re-render on changes; future use: colors/texts
  useWidgetSettingsStore(s => s.settings)

  const sectors = useWidgetSettingsStore(s => s.settings.form.sectors)
  const contentPosition = useWidgetSettingsStore(
    s => s.settings.form.template?.templateSettings?.contentPosition
  )

  const body = (
    <div className="flex items-center justify-center w-full gap-4 p-6">
      {contentPosition === 'left' ? (
        <>
          {screen === 'main' || screen === 'panel' ? <DynamicFieldsForm centered /> : <PrizeStub />}
          <WheelOfFortune
            sectors={
              sectors.randomize ? [...sectors.items].sort(() => Math.random() - 0.5) : sectors.items
            }
          />
        </>
      ) : (
        <>
          <WheelOfFortune
            sectors={
              sectors.randomize ? [...sectors.items].sort(() => Math.random() - 0.5) : sectors.items
            }
          />
          {screen === 'main' || screen === 'panel' ? <DynamicFieldsForm centered /> : <PrizeStub />}
        </>
      )}
    </div>
  )

  if (screen === 'panel') {
    return (
      <Container>
        <SidePanelChrome>
          {/* <Headline text="Получите скидку" /> */}
          {body}
        </SidePanelChrome>
      </Container>
    )
  }

  return (
    <Container>
      <ModalChrome>
        {/* <Headline text={screen === 'main' ? 'Получите скидку' : 'Призовой экран'} /> */}
        {body}
      </ModalChrome>
    </Container>
  )
}

export default DesktopPreview
