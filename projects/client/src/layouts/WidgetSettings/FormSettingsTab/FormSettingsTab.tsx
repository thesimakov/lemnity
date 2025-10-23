import TemplateChooser from '@/components/TemplateChooser'
import TemplateSettings from './TemplateSettings/TemplateSettings'
import ImageUploader from '@/components/ImageUploader'
import FormSettings from './FormSettings/FormSettings'
import { AnimatePresence } from 'framer-motion'
import CountdownField from './CountdownField/CountdownField'
import ContactsField from './ContactsField/ContactsField'
import AgreementPoliciesField from './AgreementPoliciesField/AgreementPoliciesField'
import AdsInfoField from './AdsInfoField/AdsInfoField'
import WidgetSettingsField from './WidgetSettingsField/WidgetSettingsField'
import MessagesSettings from '@/layouts/WidgetSettings/FormSettingsTab/MessagesSettings/MessagesSettings'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { memo, useCallback } from 'react'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import { useShallow } from 'zustand/react/shallow'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'

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
  const {
    settings,
    setCompanyLogoEnabled,
    setCompanyLogoFile,
    setTemplateEnabled,
    setTemplateKey,
    setTemplateImageEnabled,
    setContentPosition,
    setColorScheme,
    setCustomColor
  } = useFormSettings()
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const logoErrors = showValidation ? getErrors('form.companyLogo') : []
  const templateErrors = showValidation ? getErrors('form.template') : []

  const template = useWidgetSettingsStore(
    useShallow(s =>
      withDefaultsPath<typeof STATIC_DEFAULTS.form.template>(
        s.settings?.form,
        'template',
        STATIC_DEFAULTS.form.template
      )
    )
  )

  const handleFile = useCallback(
    (file: File | null) => {
      if (file) setCompanyLogoFile(file.name, URL.createObjectURL(file))
    },
    [setCompanyLogoFile]
  )

  return (
    <>
      <span className="text-xl font-rubik">Настройка формы</span>
      <div className="flex flex-col gap-3">
        <ImageUploader
          checked={settings?.companyLogo?.enabled ?? true}
          setChecked={setCompanyLogoEnabled}
          title="Логотип компании"
          recommendedResolution="100x100"
          fileSize="менее 2 Mb"
          formats={['png']}
          onFileSelect={handleFile}
          isInvalid={
            logoErrors.some(e => e.path.endsWith('fileName')) ||
            logoErrors.some(e => e.path.endsWith('url'))
          }
          errorMessage={
            logoErrors.find(e => e.path.endsWith('fileName'))?.message ||
            logoErrors.find(e => e.path.endsWith('url'))?.message
          }
        />
        <TemplateChooser
          enabled={template?.enabled ?? true}
          onToggle={enabled => {
            setTemplateEnabled(enabled)
            if (!enabled) {
              const d = STATIC_DEFAULTS.form.template?.templateSettings ?? {
                image: { enabled: false, fileName: '', url: '' },
                contentPosition: 'left',
                colorScheme: 'primary',
                customColor: '#FFFFFF'
              }
              setTemplateImageEnabled(d.image.enabled ?? false)
              setContentPosition(d.contentPosition)
              setColorScheme(d.colorScheme)
              if (d.colorScheme === 'custom' && d.customColor) setCustomColor(d.customColor)
            }
          }}
          options={templateOptions}
          selectedKey={template.key}
          onChange={key => setTemplateKey(key ?? '')}
          isInvalid={templateErrors.some(e => e.path.endsWith('key'))}
          errorMessage={templateErrors.find(e => e.path.endsWith('key'))?.message}
        />
        <AnimatePresence>
          {!(template?.enabled ?? true) ? <TemplateSettings /> : null}
        </AnimatePresence>
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

export default memo(FormSettingsTab)
