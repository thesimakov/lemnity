import CheckboxField from '@/components/CheckboxField'
import useWidgetSettingsStore, { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import { useFormSettings } from '@/stores/widgetSettings/formHooks'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const ContactsField = () => {
  const { setContactField } = useFormSettings()
  const staticDefaults = useWidgetStaticDefaults()
  const contacts = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'contacts', staticDefaults.form.contacts)
  )
  const { phone, email, name } = contacts
  const { enabled: phoneEnabled, required: phoneRequired } = phone
  const { enabled: emailEnabled, required: emailRequired } = email
  const { enabled: nameEnabled, required: nameRequired } = name

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
          label="Имя"
          checked={nameEnabled}
          onChange={enabled => setContactField('name', enabled, nameRequired)}
          required={nameRequired}
          onRequiredChange={required => setContactField('name', nameEnabled, required)}
        />
      </div>
    </div>
  )
}

export default ContactsField
