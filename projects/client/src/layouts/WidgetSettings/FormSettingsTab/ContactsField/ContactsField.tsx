import CheckboxField from '@/components/CheckboxField'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const ContactsField = () => {
  const { setContactField } = useFormSettings()
  const contacts = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'contacts', STATIC_DEFAULTS.form.contacts)
  )
  const { phone, email, initials } = contacts
  const { enabled: phoneEnabled, required: phoneRequired } = phone
  const { enabled: emailEnabled, required: emailRequired } = email
  const { enabled: initialsEnabled, required: initialsRequired } = initials

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
          checked={phoneEnabled}
          onChange={enabled => setContactField('phone', enabled, phoneRequired)}
          required={phoneRequired}
          onRequiredChange={required => setContactField('phone', phoneEnabled, required)}
        />
        <CheckboxField
          label="Email"
          checked={emailEnabled}
          onChange={enabled => setContactField('email', enabled, emailRequired)}
          required={emailRequired}
          onRequiredChange={required => setContactField('email', emailEnabled, required)}
        />
        <CheckboxField
          label="Инициалы"
          checked={initialsEnabled}
          onChange={enabled => setContactField('initials', enabled, initialsRequired)}
          required={initialsRequired}
          onRequiredChange={required => setContactField('initials', initialsEnabled, required)}
        />
      </div>
    </div>
  )
}

export default ContactsField
