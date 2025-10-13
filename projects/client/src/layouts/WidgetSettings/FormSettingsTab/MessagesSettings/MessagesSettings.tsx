import SwitchableField from '@/components/SwitchableField'
import { useState } from 'react'
import { Input } from '@heroui/input'

const MessagesSettings = () => {
  const [enabled, setEnabled] = useState(true)
  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-rubik">Настройка сообщений</span>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={enabled}
        onToggle={setEnabled}
        title="Текст при выигрыше"
      >
        <Input
          radius="sm"
          placeholder="Поздравляем! Вы выиграли, заберите Ваш приз! [ промокод ]"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
        />
      </SwitchableField>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={enabled}
        onToggle={setEnabled}
        title="Сообщение при превышении лимита показов"
      >
        <Input
          radius="sm"
          placeholder="Вы уже видели эту игру"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
        />
      </SwitchableField>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={enabled}
        onToggle={setEnabled}
        title="Сообщение при превышении лимита побед"
      >
        <Input
          radius="sm"
          placeholder="Вы уже получили наш приз, испытайте удачу в другой игре"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
        />
      </SwitchableField>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={enabled}
        onToggle={setEnabled}
        title="Сообщение при превышении лимита выигрышей"
      >
        <Input
          radius="sm"
          placeholder="Все призы выданы! Следите за новостями"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
        />
      </SwitchableField>
    </div>
  )
}

export default MessagesSettings
