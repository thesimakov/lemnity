import { useShallow } from 'zustand/react/shallow'

import { TriggerSettings } from '@/components'
import DisableBranding from '@/layouts/WidgetSettings/FieldsSettingsTab/DisableBranding/DisableBranding'
import NotificationSettings from './NotificationSettings'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import type {
  NotificationWidgetType,
} from '@lemnity/widget-config/widgets/notification'
import { notificationWidgetDefaults as defaults } from './defaults'

const NotificationWidgetSettings = () => {
  const {
    triggerText,
    triggerFontColor,
    triggerIcon,
    triggerBackgroundColor,
    triggerPosition,

    brandingEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      const settings = (s.settings?.widget as NotificationWidgetType)
      
      return {
        triggerText: settings.triggerText
          ?? defaults.triggerText,
        triggerFontColor: settings.triggerFontColor
          ?? defaults.triggerFontColor,
        triggerIcon: settings.triggerIcon
          ?? defaults.triggerIcon,
        triggerBackgroundColor: settings.triggerBackgroundColor
          ?? defaults.triggerBackgroundColor,
        triggerPosition: settings.triggerPosition
          ?? defaults.triggerPosition,

        brandingEnabled: settings.brandingEnabled
          ?? defaults.brandingEnabled,
      }
    })
  )

  const setTriggerText = useWidgetSettingsStore(
    s => s.setNotificationTriggerText
  )
  const setTriggerFontColor = useWidgetSettingsStore(
    s => s.setNotificationTriggerFontColor
  )
  const setTriggerIcon = useWidgetSettingsStore(
    s => s.setNotificationTriggerIcon
  )
  const setTriggerBackgroundColor = useWidgetSettingsStore(
    s => s.setNotificationTriggerBackgroundColor
  )
  const setTriggerPosition = useWidgetSettingsStore(
    s => s.setNotificationTriggerPosition
  )
  const setBrandingEnabled = useWidgetSettingsStore(
    s => s.setNotificationBrandingEnabled
  )

  return (
    <div className='w-full min-w-122 flex flex-col gap-2.5'>
      <h1 className='text-[25px] leading-7.5 font-normal text-[#060606]'>
        Настройка виджета
      </h1>

      <TriggerSettings
        triggerText={triggerText}
        triggerFontColor={triggerFontColor}
        triggerBackgroundColor={triggerBackgroundColor}
        triggerIcon={triggerIcon}
        triggerPosition={triggerPosition}
        onTriggerTextChange={setTriggerText}
        onTriggerFontColorChange={setTriggerFontColor}
        onTriggerBackgroundColorChange={setTriggerBackgroundColor}
        onTriggerIconChange={setTriggerIcon}
        onTriggerPositionChange={setTriggerPosition}
      />
      <NotificationSettings />
      <DisableBranding
        enabled={brandingEnabled}
        onBrandingEnabledToggle={setBrandingEnabled}
      />
    </div>
  )
}

export default NotificationWidgetSettings
