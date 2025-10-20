import OptionsChooser, { type OptionItem } from '@/components/OptionsChooser'
import ImageUploader from '@/components/ImageUploader'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import ButtonSettingsField from './ButtonSettingsField/ButtonSettingsField'
import ButtonPositionChooser from './ButtonPositionChooser/ButtonPositionChooser'
import TimerSettingsField from './TimerSettingsField/TimerSettingsField'
import { AnimatePresence } from 'framer-motion'
import type { StartShowing, IconType, HideIcon } from '@/stores/widgetSettingsStore'
import { memo, useCallback, useMemo } from 'react'

const startShowingOptions: OptionItem[] = [
  { key: 'onClick', label: 'При нажатии на кнопку' },
  { key: 'timer', label: 'Автоматически', tip: 'Запуск происходит спустя заданное время' }
]

const iconHideOptions: OptionItem[] = [
  { key: 'always', label: 'Всегда' },
  { key: 'afterFormSending', label: 'После отправки формы' }
]

const StartShowingControl = memo(() => {
  const setStartShowing = useWidgetSettingsStore(s => s.setStartShowing)
  const startShowing = useWidgetSettingsStore(
    s => s.settings?.display?.startShowing ?? STATIC_DEFAULTS.display.startShowing
  )
  console.log('STATIC_DEFAULTS:', STATIC_DEFAULTS.display.startShowing)
  console.log('store:', startShowing)
  const handleChange = useCallback(
    (v: string) => setStartShowing(v as StartShowing),
    [setStartShowing]
  )
  return (
    <OptionsChooser
      title="Выберите условие начала показа"
      options={startShowingOptions}
      value={startShowing}
      onChange={handleChange}
    />
  )
})

const TimerSettingsConditional = memo(() => {
  const startShowing = useWidgetSettingsStore(
    s => s.settings?.display?.startShowing ?? STATIC_DEFAULTS.display.startShowing
  )
  return (
    <AnimatePresence>{startShowing === 'timer' ? <TimerSettingsField /> : null}</AnimatePresence>
  )
})

const IconTypeControl = memo(() => {
  const setIconType = useWidgetSettingsStore(s => s.setIconType)
  const setIconImage = useWidgetSettingsStore(s => s.setIconImage)
  const iconType = useWidgetSettingsStore(
    s => s.settings?.display?.icon?.type ?? STATIC_DEFAULTS.display.icon.type
  )
  const handleChange = useCallback((v: string) => setIconType(v as IconType), [setIconType])
  const handleFile = useCallback(
    (file: File | null) =>
      setIconImage(file ? { fileName: file.name, url: URL.createObjectURL(file) } : null),
    [setIconImage]
  )
  const iconTypeOptionsMemo = useMemo<OptionItem[]>(
    () => [
      {
        key: 'image',
        label: 'Изображение',
        below: (
          <ImageUploader
            hideSwitch
            classNames="border-none !p-0"
            title="Использовать свою картинку"
            recommendedResolution="100x100"
            fileSize="300 Kb"
            formats={['png, jpg, jpeg, webp']}
            onFileSelect={handleFile}
          />
        )
      },
      { key: 'button', label: 'Кнопка', below: <ButtonSettingsField /> }
    ],
    [handleFile]
  )
  return (
    <OptionsChooser
      title="Вид иконки"
      options={iconTypeOptionsMemo}
      value={iconType}
      onChange={handleChange}
    />
  )
})

const PositionControl = memo(() => {
  const setButtonPosition = useWidgetSettingsStore(s => s.setButtonPosition)
  const buttonPosition = useWidgetSettingsStore(
    s => s.settings?.display?.icon?.position ?? STATIC_DEFAULTS.display.icon.position
  )
  return <ButtonPositionChooser value={buttonPosition} onChange={setButtonPosition} />
})

const HideIconControl = memo(() => {
  const setHideIcon = useWidgetSettingsStore(s => s.setHideIcon)
  const hide = useWidgetSettingsStore(
    s => s.settings?.display?.icon?.hide ?? STATIC_DEFAULTS.display.icon.hide
  )
  const handleChange = useCallback((v: string) => setHideIcon(v as HideIcon), [setHideIcon])
  return (
    <OptionsChooser
      title="Сокрытие иконки"
      options={iconHideOptions}
      value={hide}
      onChange={handleChange}
    />
  )
})

const DisplaySettingsTab = () => {
  return (
    <div className="flex flex-col gap-3">
      <StartShowingControl />
      <TimerSettingsConditional />
      <IconTypeControl />
      <PositionControl />
      <HideIconControl />
    </div>
  )
}

export default memo(DisplaySettingsTab)
