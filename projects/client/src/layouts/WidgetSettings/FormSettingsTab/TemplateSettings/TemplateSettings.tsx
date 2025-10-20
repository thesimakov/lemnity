import ColorAccessory from '@/components/ColorAccessory'
import OptionsChooser, { type OptionItem } from '@/components/OptionsChooser'
import ImageUploader from '@/components/ImageUploader'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { motion } from 'framer-motion'
import type { ColorScheme, ContentPosition } from '@/stores/widgetSettings/types'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const TemplateSettings = () => {
  const {
    setTemplateImageEnabled,
    setTemplateImageFile,
    setContentPosition,
    setColorScheme,
    setCustomColor
  } = useFormSettings()
  const defaultTemplateSettings = STATIC_DEFAULTS.form.template?.templateSettings ?? {
    image: { enabled: false, fileName: '', url: '' },
    contentPosition: 'left',
    colorScheme: 'primary',
    customColor: '#FFFFFF'
  }
  const settings = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'template.templateSettings', defaultTemplateSettings)
  )
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errors = showValidation ? getErrors('form.template.templateSettings') : []
  const customColorError = errors.find(e => e.path.endsWith('customColor'))
  const imageUrlError =
    errors.find(e => e.path.endsWith('url')) || errors.find(e => e.path.endsWith('fileName'))

  const colorOptions: OptionItem[] = [
    { key: 'primary', label: 'Основная' },
    {
      key: 'custom',
      label: 'Пользовательское',
      accessory: <ColorAccessory color={settings?.customColor} onChange={setCustomColor} />
    }
  ]

  const contentPositionOptions: OptionItem[] = [
    { key: 'left', label: 'С левой стороны' },
    { key: 'right', label: 'С правой стороны' }
  ]

  return (
    <motion.div
      initial={{ opacity: 1, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden flex flex-col gap-3"
    >
      <ImageUploader
        checked={settings.image.enabled}
        setChecked={setTemplateImageEnabled}
        title="Картинка"
        recommendedResolution="470x470"
        fileSize="менее 2 Mb"
        onFileSelect={file => {
          if (!file) return
          const url = URL.createObjectURL(file)
          setTemplateImageFile(file.name, url)
        }}
        isInvalid={Boolean(settings.image.enabled && imageUrlError)}
        errorMessage={imageUrlError?.message}
      />
      <OptionsChooser
        title="Положение контента"
        options={contentPositionOptions}
        value={settings.contentPosition}
        onChange={k => setContentPosition(k as ContentPosition)}
      />
      <OptionsChooser
        title="Цветовая гамма"
        options={colorOptions}
        value={settings.colorScheme}
        onChange={k => {
          setColorScheme(k as ColorScheme)
          setCustomColor(settings.customColor)
        }}
      />
      {showValidation && customColorError ? (
        <span className="text-sm text-red-500">{customColorError.message}</span>
      ) : null}
    </motion.div>
  )
}

export default TemplateSettings
