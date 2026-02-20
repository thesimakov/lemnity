import { useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'

import CountdownRewardScreen from './CountdownRewardScreen'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'
import SvgIcon from '@/components/SvgIcon'
import * as Icons from '@/components/Icons'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import useUrlImageOrDefault from './utils/useUrlImage'

import type {
  AnnouncementWidgetType,
  Content,
  ContentAlignment,
} from '@lemnity/widget-config/widgets/announcement'
import type { Icon } from '@lemnity/widget-config/widgets/base'
import { announcementWidgetDefaults } from './defaults'
import crossIcon from '@/assets/icons/cross.svg'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

type AnnouncementWidgetButtonProps = {
  buttonStyle: CSSProperties
  icon: Icon
  buttonText: string
  onButtonPress?: () => void
}

const AnnouncementWidgetButton = (props: AnnouncementWidgetButtonProps) => {
  const IconComponent = Icons[props.icon]

  return (
    <Button
      className={cn(
        'w-full h-13.5 rounded-[13px] bg-[#FFB400]',
        'text-black text-[20px] transition-colors duration-150'
      )}
      style={props.buttonStyle}
      onPress={props.onButtonPress}
    >
      {/* Билеты */}
      {props.icon !== 'HeartDislike' && (
        <div className='w-3.75 h-3.75'>
          <IconComponent />
        </div>
      )}
      {props.buttonText}
    </Button>
  )
}

type AnnouncementWidgetContentProps = {
  contentType: Content
  contentAlignment: ContentAlignment
  contentUrl?: string
  onButtonPress?: () => void
}

const AnnouncementWidgetContent = (
  props: AnnouncementWidgetContentProps
) => {
  const {
    title,
    titleColor,
    description,
    descriptionColor,

    buttonText,
    buttonFontColor,
    buttonBackgroundColor,
    icon,
    link,

    rewardScreenEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = (s.settings?.widget as AnnouncementWidgetType)
      const infoSettings = widget.infoSettings
      const rewardMessageSettings = widget.rewardMessageSettings

      return  {
        title: infoSettings.title,
        titleColor: infoSettings.titleColor,
        description: infoSettings.description,
        descriptionColor: infoSettings.descriptionColor,

        buttonText: infoSettings.buttonText,
        buttonFontColor: infoSettings.buttonFontColor,
        buttonBackgroundColor: infoSettings.buttonBackgroundColor,
        icon: infoSettings.icon,
        link: infoSettings.link,

        rewardScreenEnabled: rewardMessageSettings.rewardScreenEnabled,
      }
    })
  )

  const buttonStyle: CSSProperties = {
    color: buttonFontColor,
    backgroundColor: buttonBackgroundColor,
  }

  const handleButtonPress = () => {
    if (rewardScreenEnabled) {
      props.onButtonPress?.()
    }
    else {
      window.open(link, '_blank')
      props.onButtonPress?.()
    }
  }

  return (
    <>
      {props.contentType === 'imageOnTop'
        ? <img
            src={props.contentUrl}
            alt="Announcement Widget Image"
            className="w-full h-67 object-cover rounded-[10px]"
            style={{
              objectPosition: props.contentAlignment
            }}
          />
        : <div className='w-full h-67 bg-transparent' />}

      <span
        className='text-3xl transition-colors duration-150'
        style={{ color: titleColor }}
      >
        {/* Премьера «Я буду ЖИТЬ» */}
        {title}
      </span>
      <span
        className='text-[16px] transition-colors duration-150'
        style={{ color: descriptionColor }}
      >
        {/* по пьесе Н. Пинчука «На выписку», драматичекий ритуал в 1 дейстии, 16+ */}
        {description}
      </span>

      <div className='w-full mt-auto mb-0'>
        <AnnouncementWidgetButton
          buttonStyle={buttonStyle}
          buttonText={buttonText}
          icon={icon}
          onButtonPress={handleButtonPress}
        />
      </div>
    </>
  )
}

export type AnnouncementWidgetVariant = 'announcement' | 'reward'

type AnnouncementWidgetProps = {
  variant: AnnouncementWidgetVariant
  focused?: boolean
  onButtonPress?: () => void
}

const AnnouncementWidget = (props: AnnouncementWidgetProps) => {
  const {
    colorScheme,
    backgroundColor,
    borderRadius,
    companyLogoEnabled,
    companyLogoUrl,

    contentType,
    contentAlignment,
    contentUrl,

    rewardScreenEnabled,
    
    brandingEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = s.settings?.widget as AnnouncementWidgetType
      const appearence = widget.appearence
      const infoSettings = widget.infoSettings
      const rewardMessageSettings = widget.rewardMessageSettings

      return  {
        colorScheme: appearence.colorScheme,
        backgroundColor: appearence.backgroundColor,
        borderRadius: appearence.borderRadius,

        companyLogoEnabled: appearence.companyLogoEnabled,
        companyLogoUrl: appearence.companyLogoUrl,

        contentType: infoSettings.contentType,
        contentAlignment: infoSettings.contentAlignment,
        contentUrl: infoSettings.contentUrl,

        rewardScreenEnabled: rewardMessageSettings.rewardScreenEnabled,
        
        brandingEnabled: widget.brandingEnabled,
      }
    })
  )

  const {
    base64Image: contentBase64Image,
    // error,
    isLoading,
  } = useUrlImageOrDefault(contentUrl)

  const containerStyle: CSSProperties = {
    backgroundColor: colorScheme === 'primary'
      ? '#FFFFFF'
      : backgroundColor && backgroundColor.length !== 0
          ? backgroundColor
          : announcementWidgetDefaults.appearence.backgroundColor,
    borderRadius: borderRadius
      ?? announcementWidgetDefaults.appearence.borderRadius,
  }

  const backgroundImage = contentUrl && !isLoading
    ? contentBase64Image as string
    : noBackgroundImageUrl

  if (contentType === 'background') {
    containerStyle.backgroundImage = `url('${backgroundImage}')`
    containerStyle.backgroundSize = 'cover'
    containerStyle.backgroundPosition = contentAlignment
  }

  const {
    base64Image: companyBase64Logo,
    // error,
    isLoading: isCompanyLogoLoading,
  } = useUrlImageOrDefault(companyLogoUrl)

  const companyLogo = companyLogoUrl && !isCompanyLogoLoading
    ? companyBase64Logo as string
    : undefined
  
  const [hidden, setHidden] = useState(false)

  return (
    <div
      className={cn(
        'w-99.5 h-129.5 p-3.75 pb-0 gap-3.75 border border-black relative',
        'flex flex-col items-center text-center transition-colors duration-150',
        hidden && 'hidden',
      )}
      style={containerStyle}
    >
      <Button
        className={cn(
          'min-w-12 w-12 h-8.5 top-0 right-0 rounded-none',
          'bg-white px-0 absolute justify-center items-center',
          'pointer-events-auto',
          props.focused ? 'flex' : 'hidden group-hover:flex',
        )}
        style={{
          borderTopRightRadius: borderRadius,
          borderBottomLeftRadius: borderRadius,
        }}
        onPress={() => setHidden(true)}
      >
        <div className="w-4 h-4 fill-black">
          <SvgIcon src={crossIcon} alt="Close" />
        </div>
      </Button>

      {props.variant === 'announcement' && (
        <AnnouncementWidgetContent
          contentType={contentType}
          contentAlignment={
            contentAlignment
              ?? announcementWidgetDefaults.infoSettings.contentAlignment!
          }
          contentUrl={backgroundImage}
          onButtonPress={props.onButtonPress}
        />
      )}

      {props.variant === 'reward' && rewardScreenEnabled && (
        <CountdownRewardScreen
          isAnnouncement
          companyLogoEnabled={companyLogoEnabled}
          companyLogo={companyLogo}
        />
      )}
      
      {brandingEnabled
        ? <div className="flex justify-center py-2 mt-auto mb-0">
            <FreePlanBrandingLink />
          </div>
        : <div className="h-3 py-2 mt-auto mb-0 bg-transparent" />}
    </div>
  )
}

export default AnnouncementWidget
