import ColorAccessory from '@/components/ColorAccessory'
import { Input } from '@heroui/input'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import { Select, SelectItem } from '@heroui/select'
import SvgIcon from '@/components/SvgIcon'
import iconTrophy from '@/assets/icons/trophy.svg'
import iconSparkles from '@/assets/icons/sparkles.svg'
import iconRocket from '@/assets/icons/rocket.svg'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'

const FormSettings = () => {
  const { setFormTitle, setFormDescription, setFormButtonText } = useFormSettings()
  const formTexts = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'formTexts', STATIC_DEFAULTS.form.formTexts)
  )
  const { title, description, button } = formTexts
  const { text: titleText, color: titleColor } = title
  const { text: descriptionText, color: descriptionColor } = description
  const {
    text: buttonText,
    color: buttonColor,
    backgroundColor: buttonBackgroundColor,
    icon: buttonIcon
  } = button

  const icons = [
    { key: 'trophy', label: iconTrophy },
    { key: 'star', label: iconSparkles },
    { key: 'rocket', label: iconRocket }
  ]

  const getIconSelector = () => {
    return (
      <Select
        selectedKeys={buttonIcon ? [buttonIcon] : []}
        defaultSelectedKeys={['rocket']}
        onSelectionChange={keys => {
          const selected = Array.from(keys)[0]
          if (selected)
            setFormButtonText(buttonText, buttonColor, buttonBackgroundColor, selected as string)
        }}
        aria-label="Иконка приза"
        classNames={{
          trigger: 'shadow-none !bg-transparent h-8 w-[72px] min-w-[72px] border-gray-200'
        }}
        renderValue={items => {
          return items.map(item => (
            <SvgIcon src={icons.find(opt => opt.key === item.textValue)!.label} size={'20px'} />
          ))
        }}
      >
        {icons.map(opt => (
          <SelectItem key={opt.key} textValue={opt.key}>
            <span className="text-xl">
              <SvgIcon src={opt.label} size={'20px'} />
            </span>
          </SelectItem>
        ))}
      </Select>
    )
  }

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
      <span className="text-black">Кнопка</span>
      <div className="flex flex-row gap-2">
        <Input
          classNames={{ inputWrapper: 'h-14' }}
          radius="sm"
          variant="bordered"
          placeholder="Крутить колесо"
          type="text"
          onChange={e =>
            setFormButtonText(e.target.value, buttonColor, buttonBackgroundColor, buttonIcon)
          }
          value={buttonText}
        />
        <ColorAccessory
          color={buttonColor}
          onChange={color =>
            setFormButtonText(buttonText, color, buttonBackgroundColor, buttonIcon)
          }
        />
        {
          <BorderedContainer className="border-2 border-[#E4E4E7] !p-0 min-w-max justify-center items-center">
            {getIconSelector()}
          </BorderedContainer>
        }
        <ColorAccessory
          color={buttonBackgroundColor}
          onChange={color => setFormButtonText(buttonText, buttonColor, color, buttonIcon)}
          label="Цвет кнопки"
        />
      </div>
    </div>
  )
}

export default FormSettings
