import OptionsChooser, { type OptionItem } from '@/components/OptionsChooser'
import ImageUploader from '@/components/ImageUploader'
import { useState } from 'react'
import ButtonSettingsField from './ButtonSettingsField/ButtonSettingsField'
import ButtonPositionChooser, {
  type ButtonPosition
} from './ButtonPositionChooser/ButtonPositionChooser'
import TimerSettingsField from './TimerSettingsField/TimerSettingsField'
import { AnimatePresence } from 'framer-motion'

const startShowingOptions: OptionItem[] = [
  { key: 'immediately', label: 'При нажатии на кнопку' },
  { key: 'timer', label: 'Автоматически', tip: 'Запуск происходит спустя заданное время' }
]

const iconHideOptions: OptionItem[] = [
  { key: 'always', label: 'Всегда' },
  { key: 'afterFormSending', label: 'После отправки формы' }
]

const DisplaySettingsTab = () => {
  const [startShowingCondition, setStartShowingCondition] = useState<'immediately' | 'timer'>(
    'immediately'
  )
  const [iconType, setIconType] = useState<'image' | 'button'>('image')
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition>('bottom-left')
  const [iconHide, setIconHide] = useState<'always' | 'afterFormSending'>('always')

  const iconTypeOptions: OptionItem[] = [
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
        />
      )
    },
    { key: 'button', label: 'Кнопка', below: <ButtonSettingsField /> }
  ]

  return (
    <div className="flex flex-col gap-3">
      <OptionsChooser
        title="Выберите условие начала показа"
        options={startShowingOptions}
        value={startShowingCondition}
        onChange={v => setStartShowingCondition(v as 'immediately' | 'timer')}
      />
      <AnimatePresence>
        {startShowingCondition === 'timer' ? <TimerSettingsField /> : null}
      </AnimatePresence>
      <OptionsChooser
        title="Вид иконки"
        options={iconTypeOptions}
        value={iconType}
        onChange={v => setIconType(v as 'image' | 'button')}
      />
      <ButtonPositionChooser value={buttonPosition} onChange={setButtonPosition} />
      <OptionsChooser
        title="Сокрытие иконки"
        options={iconHideOptions}
        value={iconHide}
        onChange={v => setIconHide(v as 'always' | 'afterFormSending')}
      />
    </div>
  )
}

export default DisplaySettingsTab
