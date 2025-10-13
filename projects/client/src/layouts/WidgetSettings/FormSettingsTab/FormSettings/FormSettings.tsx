import ColorAccessory from '@/components/ColorAccessory'
import { Input } from '@heroui/input'
import { useState } from 'react'

const FormSettings = () => {
  const [title, setTitle] = useState<string>('')
  const [titleColor, setTitleColor] = useState<string>('#777777')
  const [description, setDescription] = useState<string>('')
  const [descriptionColor, setDescriptionColor] = useState<string>('#777777')
  const [buttonText, setButtonText] = useState<string>('')
  const [buttonColor, setButtonColor] = useState<string>('#FFB34F')

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
          onChange={e => setTitle(e.target.value)}
          value={title}
        />
        <ColorAccessory color={titleColor} onChange={setTitleColor} />
      </div>
      <span className="text-black">Описание</span>
      <div className="flex flex-row gap-2">
        <Input
          classNames={{ inputWrapper: 'h-14' }}
          radius="sm"
          variant="bordered"
          placeholder="Можно оставить пустым"
          type="text"
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
        <ColorAccessory color={descriptionColor} onChange={setDescriptionColor} />
      </div>
      <span className="text-black">Текст в кнопке</span>
      <div className="flex flex-row gap-2">
        <Input
          classNames={{ inputWrapper: 'h-14' }}
          radius="sm"
          variant="bordered"
          placeholder="Крутить колесо"
          type="text"
          onChange={e => setButtonText(e.target.value)}
          value={buttonText}
        />
        <ColorAccessory color={buttonColor} onChange={setButtonColor} />
      </div>
    </div>
  )
}

export default FormSettings
