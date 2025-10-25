import ColorAccessory from '@/components/ColorAccessory'
import OptionsChooser, { type OptionItem } from '@/components/OptionsChooser'
import ImageUploader from '@/components/ImageUploader'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { AnimatePresence, motion } from 'framer-motion'
import type { ColorScheme, ContentPosition, WindowFormat } from '@/stores/widgetSettings/types'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const TemplateSettings = () => {
  const {
    setTemplateImageEnabled,
    setTemplateImageFile,
    setWindowFormat,
    setContentPosition,
    setColorScheme,
    setCustomColor
  } = useFormSettings()
  const defaultTemplateSettings = STATIC_DEFAULTS.form.template?.templateSettings ?? {
    image: { enabled: false, fileName: '', url: '' },
    windowFormat: 'sidePanel',
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

  const windowFormatOptions: OptionItem[] = [
    { key: 'sidePanel', label: 'Боковая панель' },
    { key: 'modalWindow', label: 'Модальное окно' }
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
        title="Формат окна"
        options={windowFormatOptions}
        value={settings?.windowFormat}
        onChange={k => setWindowFormat(k as WindowFormat)}
      />
      <AnimatePresence>
        {settings?.windowFormat === 'modalWindow' ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OptionsChooser
              title="Положение контента"
              options={contentPositionOptions}
              value={settings.contentPosition}
              onChange={k => setContentPosition(k as ContentPosition)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
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
