import { useShallow } from 'zustand/react/shallow'
import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'

import Widget, { type WidgetProps } from './Widget'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import useUrlImageOrDefault from '../utils/useUrlImage'
import { useMobileContext } from './MobileContext'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from '../defaults'

const MobileWidgetTrigger = ({ ref, ...props}: WidgetProps) => {
  const {
    imageUrl,
    triggerType,
    triggerText,
    triggerFontColor,
    triggerBackgroundColor,
  } = useWidgetSettingsStore(
    useShallow(s => {
      const widget = s.settings?.widget as AnnouncementWidgetType
      const defaults = announcementWidgetDefaults.mobileSettings

      return {
        imageUrl: widget.mobileSettings?.imageUrl
          ?? defaults.imageUrl,
        triggerType: widget.mobileSettings?.triggerType
          ?? defaults.triggerType,
        triggerText: widget.mobileSettings?.triggerText
          ?? defaults.triggerText,
        triggerFontColor: widget.mobileSettings?.triggerFontColor
          ?? defaults.triggerFontColor,
        triggerBackgroundColor: widget.mobileSettings?.triggerBackgroundColor
          ?? defaults.triggerBackgroundColor,
      }
    })
  )

  const {
    base64Image,
    // error,
    isLoading,
  } = useUrlImageOrDefault(imageUrl)

  const mobileContext = useMobileContext()

  if (!mobileContext) {
    return
  }

  const { state: context, dispatch } = mobileContext

  const handleTriggerPress = () => {
    dispatch({ type: context.open ? 'close' : 'open' })
  }

  return (
    <div
      data-lemnity-interactive
      className='fixed bottom-6 right-6'
    >
      {triggerType === 'image'
        ? (
          !isLoading && imageUrl && (
            <img
              src={base64Image as string}
              alt='image'
              className={cn(
                'w-21.25 h-21.25 object-cover rounded-[5px]',
              )}
              onClick={handleTriggerPress}
            />
          )
        )
        : (
          <Button
            className='rounded-full'
            style={{
              color: triggerFontColor,
              backgroundColor: triggerBackgroundColor,
            }}
            onPress={handleTriggerPress}
          >
            {triggerText}
          </Button>
        )}
      
      {context.open && (
        <div
          data-lemnity-modal
          role='dialog'
          aria-modal='true'
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y'
          }}
          className={cn(
            'fixed left-0 top-0 w-full h-full z-2147483646 overflow-hidden',
            'flex flex-col items-center justify-center',
            'bg-black/20 backdrop-blur-sm',
          )}
        >
          <Widget
            ref={ref}
            announementVariant={props.announementVariant}
            countdownVariant={props.countdownVariant}
            focused={props.focused}
            onAnnouncementButtonPress={props.onAnnouncementButtonPress}
            onCountdownScreenButtonPress={props.onCountdownScreenButtonPress}
            onFormScreenButtonPress={props.onFormScreenButtonPress}
          />
        </div>
      )}
    </div>
  )
}

export default MobileWidgetTrigger
