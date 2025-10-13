import { useState } from 'react'
import CheckboxField from '@/components/CheckboxField'

const ContactsField = () => {
  const [phone, setPhone] = useState(true)
  const [email, setEmail] = useState(true)
  const [initials, setInitials] = useState(false)

  const [phoneRequired, setPhoneRequired] = useState(false)
  const [emailRequired, setEmailRequired] = useState(true)
  const [initialsRequired, setInitialsRequired] = useState(false)

  return (
    <div className="flex flex-col p-3 rounded-lg border border-gray-200 gap-3">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-black text-base font-medium">Контакты</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <CheckboxField
          label="Телефон"
          checked={phone}
          onChange={setPhone}
          required={phoneRequired}
          onRequiredChange={setPhoneRequired}
        />
        <CheckboxField
          label="Email"
          checked={email}
          onChange={setEmail}
          required={emailRequired}
          onRequiredChange={setEmailRequired}
        />
        <CheckboxField
          label="Инициалы"
          checked={initials}
          onChange={setInitials}
          required={initialsRequired}
          onRequiredChange={setInitialsRequired}
        />
      </div>
    </div>
  )
}

export default ContactsField
