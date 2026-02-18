import { useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'

import SvgIcon from '@/components/SvgIcon'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'
import CountdownScreen from './CountdownScreen'
import CountdownRewardScreen from './CountdownRewardScreen'
import CountdownFormScreen from './CountdownFormScreen'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import crossIcon from '@/assets/icons/cross.svg'
import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import useUrlImageOrDefault from './utils/useUrlImage'

export type CountdownWidgetVariant = 'countdown' | 'form' | 'reward'

type CountdownWidgetProps = {
  variant?: CountdownWidgetVariant
  containerStyle: CSSProperties
  onCountdownScreenButtonPress?: () => void
  onFormScreenButtonPress?: () => void
}

const CountdownAnnouncementWidget = (props: CountdownWidgetProps) => {
  const {
    companyLogoEnabled,
    companyLogoUrl,

    brandingEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = s.settings?.widget as AnnouncementWidgetType
      const appearence = widget.appearence

      return {
        companyLogoEnabled: appearence.companyLogoEnabled,
        companyLogoUrl: appearence.companyLogoUrl,

        brandingEnabled: widget.brandingEnabled,
      }
    })
  )

  const {
    base64Image: companyBase64Logo,
    // error,
    isLoading,
  } = useUrlImageOrDefault(companyLogoUrl)

  const companyLogo = companyLogoUrl && !isLoading
    ? companyBase64Logo as string
    : undefined
  
  const [hidden, setHidden] = useState(false)

  return (
    <div
      className={cn(
        'w-99.5 min-h-129.5 px-9 rounded-2xl',
        'flex flex-col items-center relative',
        'bg-[#725DFF] transition-colors duration-150',
        hidden && 'hidden',
      )}
      style={props.containerStyle}
    >
      <Button
        className={cn(
          'min-w-11.25 w-11.25 h-7.5 top-4.5 right-4.5 rounded-[5px]',
          'bg-white px-0 absolute flex justify-center items-center',
          'pointer-events-auto',
        )}
        onPress={() => setHidden(true)}
      >
        <div className="w-4 h-4 fill-black">
          <SvgIcon src={crossIcon} alt="Close" />
        </div>
      </Button>

      {props.variant === 'countdown' && (
        <CountdownScreen
          companyLogoEnabled={companyLogoEnabled}
          companyLogo={companyLogo}
          onCountdownScreenButtonPress={props.onCountdownScreenButtonPress}
        />
      )}
      {props.variant === 'form' && (
        <CountdownFormScreen
          companyLogoEnabled={companyLogoEnabled}
          companyLogo={companyLogo}
          onFormScreenButtonPress={props.onFormScreenButtonPress}
        />
      )}
      {props.variant === 'reward' && (
        <CountdownRewardScreen
          companyLogoEnabled={companyLogoEnabled}
          companyLogo={companyLogo}
        />
      )}

      {brandingEnabled
        ? <div className="mt-auto mb-4 pt-4 flex">
            <FreePlanBrandingLink color="#FFFFFF" />
          </div>
        : <div className="h-3 mt-auto mb-4 pt-4 bg-transparent" />
      }
    </div>
  )
}

export default CountdownAnnouncementWidget