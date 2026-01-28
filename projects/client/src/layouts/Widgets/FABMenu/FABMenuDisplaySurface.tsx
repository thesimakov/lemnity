import { useEffect } from 'react'
import ButtonAppearenceSettings from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonAppearenceSettings/ButtonAppearenceSettings'
import ButtonPositionChooser from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonPositionChooser/ButtonPositionChooser'
import useWidgetSettingsStore, { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import type { ButtonPosition } from '@/stores/widgetSettingsStore'

const ALLOWED_POSITIONS: ButtonPosition[] = ['bottom-left', 'bottom-right']

const normalizePosition = (value: ButtonPosition): ButtonPosition =>
  ALLOWED_POSITIONS.includes(value) ? value : ALLOWED_POSITIONS[0]

const FABMenuDisplaySurface = () => {
  const setButtonPosition = useWidgetSettingsStore(s => s.setButtonPosition)
  const staticDefaults = useWidgetStaticDefaults()
  const rawPosition = useWidgetSettingsStore(
    s =>
      (s.settings?.display?.icon?.position as ButtonPosition | undefined) ??
      (staticDefaults?.display?.icon?.position as ButtonPosition | undefined) ??
      ALLOWED_POSITIONS[1]
  )

  const currentPosition = normalizePosition(rawPosition)

  useEffect(() => {
    if (rawPosition !== currentPosition) {
      setButtonPosition(currentPosition)
    }
  }, [rawPosition, currentPosition, setButtonPosition])

  return (
    <section className="flex flex-col gap-2.5 rounded-[14px] border border-[#E6E6E6] p-4.5 bg-white min-w-74">
      <div className="h-[37px]">
        <h2 className="text-lg font-medium text-gray-900 leading-[21px]">Форма</h2>
      </div>
      <h2 className="leading-[19px]">Название кнопки</h2>
      <ButtonAppearenceSettings onChange={() => {}} />
      <ButtonPositionChooser
        noBorder
        noPadding
        value={currentPosition}
        options={ALLOWED_POSITIONS}
        onChange={next => setButtonPosition(normalizePosition(next))}
      />
    </section>
  )
}

export default FABMenuDisplaySurface
