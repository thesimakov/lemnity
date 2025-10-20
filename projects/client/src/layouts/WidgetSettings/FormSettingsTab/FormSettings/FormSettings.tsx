import ColorAccessory from '@/components/ColorAccessory'
import { Input } from '@heroui/input'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const FormSettings = () => {
  const { setFormTitle, setFormDescription, setFormButtonText } = useFormSettings()
  const formTexts = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'formTexts', STATIC_DEFAULTS.form.formTexts)
  )
  const { title, description, button } = formTexts
  const { text: titleText, color: titleColor } = title
  const { text: descriptionText, color: descriptionColor } = description
  const { text: buttonText, color: buttonColor } = button

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200">
      <span className="text-black font-semibold pb-2">Форма</span>
      <span className="text-black">Заголовок</span>
      <div className="flex flex-row gap-2">
        <Input
          classNames={{ inputWrapper: 'h-14' }}
          radius="sm"
          variant="bordered"
          placeholder="Укажите заголовок"
          type="text"
          onChange={e => setFormTitle(e.target.value, titleColor)}
          value={titleText}
        />
        <ColorAccessory color={titleColor} onChange={color => setFormTitle(titleText, color)} />
      </div>
      <span className="text-black">Описание</span>
      <div className="flex flex-row gap-2">
        <Input
          classNames={{ inputWrapper: 'h-14' }}
          radius="sm"
          variant="bordered"
          placeholder="Можно оставить пустым"
          type="text"
          onChange={e => setFormDescription(e.target.value, descriptionColor)}
          value={descriptionText}
        />
        <ColorAccessory
          color={descriptionColor}
          onChange={color => setFormDescription(descriptionText, color)}
        />
      </div>
      <span className="text-black">Текст в кнопке</span>
      <div className="flex flex-row gap-2">
        <Input
          classNames={{ inputWrapper: 'h-14' }}
          radius="sm"
          variant="bordered"
          placeholder="Крутить колесо"
          type="text"
          onChange={e => setFormButtonText(e.target.value, buttonColor)}
          value={buttonText}
        />
        <ColorAccessory
          color={buttonColor}
          onChange={color => setFormButtonText(buttonText, color)}
        />
      </div>
    </div>
  )
}

export default FormSettings
