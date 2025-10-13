import TemplateChooser from '@/components/TemplateChooser'
import TemplateSettings from './TemplateSettings/TemplateSettings'
import ImageUploader from '@/components/ImageUploader'
import { useState } from 'react'
import FormSettings from './FormSettings/FormSettings'
import { AnimatePresence } from 'framer-motion'
import CountdownField from './CountdownField/CountdownField'
import ContactsField from './ContactsField/ContactsField'
import AgreementPoliciesField from './AgreementPoliciesField/AgreementPoliciesField'
import AdsInfoField from './AdsInfoField/AdsInfoField'
import WidgetSettingsField from './WidgetSettingsField/WidgetSettingsField'
import MessagesSettings from '@/layouts/WidgetSettings/FormSettingsTab/MessagesSettings/MessagesSettings'

// import useWidgetSettingsStore from "@/stores/widgetSettingsStore";

const templateOptions = [
  { key: 'template1', label: 'Новый Год' },
  { key: 'template2', label: 'Рождество' },
  { key: 'template3', label: '14 Февраля' },
  { key: 'template4', label: '23 Февраля' },
  { key: 'template5', label: '8 Марта' },
  { key: 'template6', label: 'Пасха' },
  { key: 'template7', label: '1 апреля' }
]

const FormSettingsTab = () => {
  // const {
  //     logoEnabled, setLogoEnabled,
  //     templateEnabled, setTemplateEnabled,
  //     templateKey, setTemplateKey
  // } = useWidgetSettingsStore()

  const [logoEnabled, setLogoEnabled] = useState<boolean>(true)
  const [templateEnabled, setTemplateEnabled] = useState<boolean>(true)
  const [templateKey, setTemplateKey] = useState<string>('default')

  return (
    <>
      <span className="text-xl font-rubik">Настройка формы</span>
      <div className="flex flex-col gap-3">
        <ImageUploader
          checked={logoEnabled}
          setChecked={setLogoEnabled}
          title="Логотип компании"
          recommendedResolution="100x100"
          fileSize="менее 2 Mb"
          formats={['png']}
        />
        <TemplateChooser
          enabled={templateEnabled}
          onToggle={setTemplateEnabled}
          options={templateOptions}
          selectedKey={templateKey}
          onChange={key => setTemplateKey(key ?? 'default')}
        />
        <AnimatePresence>{!templateEnabled ? <TemplateSettings /> : null}</AnimatePresence>
        <FormSettings />
        <CountdownField />
        <ContactsField />
        <AgreementPoliciesField />
        <AdsInfoField />
        <WidgetSettingsField />
        <MessagesSettings />
      </div>
    </>
  )
}

export default FormSettingsTab
