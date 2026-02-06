import { useState } from 'react'

import SwitchableField from '@/components/SwitchableField'
import MessageSettings from './MessageSettings'
import RewardScreenColors from './RewardScreenColors'

const RewardMessageSettings = () => {
    const [enabled, setEnabled] = useState(true)
  
  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Настройки сообщений
      </h1>

      <SwitchableField
        title="Текст при выигрыше"
        enabled={enabled}
        onToggle={setEnabled}
        classNames={{
          title: 'text-[16px] leading-4.75 font-normal',
        }}
      >
        <div className="w-full flex flex-col gap-2.5">
          <MessageSettings
            title="Заголовок"
            placeholder="Ура! Вы выиграли"
          />
          <MessageSettings
            title="Описание"
            placeholder="Поздравляем! Вы выиграли, заберите Ваш приз!"
          />
          <MessageSettings
            title="Скидка"
            placeholder="Ваша скидка 10%"
          />
          <MessageSettings
            title="Промокод"
            placeholder="TNF2026"
          />
          
          <RewardScreenColors />
        </div>
      </SwitchableField>
    </div>
  )
}

export default RewardMessageSettings
