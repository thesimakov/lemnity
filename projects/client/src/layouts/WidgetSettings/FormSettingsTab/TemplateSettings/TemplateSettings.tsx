import ColorAccessory from '@/components/ColorAccessory'
import OptionsChooser, { type OptionItem } from '@/components/OptionsChooser'
import ImageUploader from '@/components/ImageUploader'
// import useWidgetSettingsStore from "@/stores/widgetSettingsStore"
import { useState } from 'react'
import { motion } from 'framer-motion'

type ContentPosition = 'left' | 'right'
type ColorScheme = 'primary' | 'custom'

const TemplateSettings = () => {
  // const {
  //     logoEnabled, setLogoEnabled,
  //     contentPositionScheme, setContentPositionScheme,
  //     colorScheme, setColorScheme,
  //     customColor, setCustomColor
  // } = useWidgetSettingsStore()

  const [imageEnabled, setImageEnabled] = useState(true)
  const [contentPositionScheme, setContentPositionScheme] = useState<ContentPosition>('left')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('primary')
  const [customColor, setCustomColor] = useState('#FFB74D')

  const colorOptions: OptionItem[] = [
    { key: 'primary', label: 'Основная' },
    {
      key: 'custom',
      label: 'Пользовательское',
      accessory: <ColorAccessory color={customColor} onChange={setCustomColor} />
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
        checked={imageEnabled}
        setChecked={setImageEnabled}
        title="Картинка"
        recommendedResolution="470x470"
        fileSize="менее 2 Mb"
      />
      <OptionsChooser
        title="Положение контента"
        options={contentPositionOptions}
        value={contentPositionScheme}
        onChange={k => setContentPositionScheme(k as 'left' | 'right')}
      />
      <OptionsChooser
        title="Цветовая гамма"
        options={colorOptions}
        value={colorScheme}
        onChange={k => setColorScheme(k as 'primary' | 'custom')}
      />
    </motion.div>
  )
}

export default TemplateSettings
