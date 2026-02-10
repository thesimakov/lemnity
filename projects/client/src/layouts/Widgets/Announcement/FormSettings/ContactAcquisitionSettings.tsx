import { useState } from 'react'

import SwitchableField from '@/components/SwitchableField'
import CheckboxField from '@/components/CheckboxField'

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
      <div className="w-full flex flex-col gap-2.5">
        <CheckboxField
          label="Имя"
          showRequired
          checked={true}
          onChange={() => {}}
          // required={nameRequired}
          // onRequiredChange={required => setContactField('name', nameEnabled, required)}
        />
        <CheckboxField
          label="Телефон"
          showRequired
          checked={false}
          onChange={() => {}}
          // required={phoneRequired}
          // onRequiredChange={required => setContactField('phone', phoneEnabled, required)}
        />
        <CheckboxField
          label="Email"
          showRequired
          checked={true}
          onChange={() => {}}
          // onChange={enabled => setContactField('email', enabled, emailRequired)}
          // required={emailRequired}
          // onRequiredChange={required => setContactField('email', emailEnabled, required)}
        />
      </div>
    </SwitchableField>
  )
}

export default ContactAcquisitionSettings
