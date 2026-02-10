import { useState } from 'react'

import SwitchableField from '@/components/SwitchableField'

const ContactAcquisitionSettings = () => {
  const [enabled, setEnabled] = useState(true)
  return (
    <SwitchableField
      title="Контакты"
      enabled={enabled}
      onToggle={setEnabled}
      classNames={{
        title: 'text-[16px] leading-4.75 font-normal',
      }}
    >
      <div className="w-full flex flex-col gap-2.5"></div>
    </SwitchableField>
  )
}

export default ContactAcquisitionSettings
