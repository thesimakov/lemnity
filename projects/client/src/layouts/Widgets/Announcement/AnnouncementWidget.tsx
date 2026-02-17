import { type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'

import CountdownRewardScreen from './CountdownRewardScreen'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'
import * as Icons from '@/components/Icons'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type {
  AnnouncementWidgetType,
  Content,
  ContentAlignment,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from './defaults'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

type AnnouncementWidgetContentProps = {
  contentType: Content
  contentAlignment: ContentAlignment
  contentUrl?: string
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
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = (s.settings?.widget as AnnouncementWidgetType)
      const infoSettings = widget.infoSettings

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
      }
    })
  )

  const buttonStyle: CSSProperties = {
    color: buttonFontColor,
    backgroundColor: buttonBackgroundColor,
  }

  const IconComponent = Icons[icon]

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
        <a
          href={link ?? 'about:blank'}
          target="_blank"
        >
          <Button
            className={cn(
              'w-full h-13.5 rounded-[13px] bg-[#FFB400]',
              'text-black text-[20px] transition-colors duration-150'
            )}
            style={buttonStyle}
          >
            {/* Билеты */}
            {icon !== 'HeartDislike' && (
              <div className='w-3.75 h-3.75'>
                <IconComponent />
              </div>
            )}
            {buttonText}
          </Button>
        </a>
      </div>
    </>
  )
}

type AnnouncementWidgetProps = {
  variant: 'announcement' | 'reward'
}

const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader
  reader.onerror = reject
  reader.onload = () => {
      resolve(reader.result)
  }
  reader.readAsDataURL(blob)
})

const AnnouncementWidget = (props: AnnouncementWidgetProps) => {
  const {
    colorScheme,
    backgroundColor,
    borderRadius,

    contentType,
    contentAlignment,
    contentUrl,

    // title,
    // titleColor,
    // description,
    // descriptionColor,

    rewardScreenEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = (s.settings?.widget as AnnouncementWidgetType)
      const appearence = widget.appearence
      const infoSettings = widget.infoSettings
      const rewardMessageSettings = widget.rewardMessageSettings

      return  {
        // format: appearence.format,
        // companyLogoEnabled: appearence.companyLogoEnabled,
        // companyLogoUrl: appearence.companyLogoUrl,

        colorScheme: appearence.colorScheme,
        backgroundColor: appearence.backgroundColor,
        borderRadius: appearence.borderRadius,

        contentType: infoSettings.contentType,
        contentAlignment: infoSettings.contentAlignment,
        contentUrl: infoSettings.contentUrl,

        title: infoSettings.title,
        titleColor: infoSettings.titleColor,
        description: infoSettings.description,
        descriptionColor: infoSettings.descriptionColor,

        rewardScreenEnabled: rewardMessageSettings.rewardScreenEnabled,
      }
    })
  )

  const {
    data: contentBase64Image,
    // error,
    isLoading,
  } = useQuery({
    queryKey: [contentUrl],
    queryFn: () =>
      fetch(
        contentUrl ?? announcementWidgetDefaults.infoSettings.contentUrl!
      )
      .then((result) => result.blob())
      .then(convertBlobToBase64)
  })

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

  return (
    <div
      className={cn(
        'w-99.5 h-129.5 p-3.75 pb-0 border border-black',
        'flex flex-col items-center text-center transition-colors duration-150',
      )}
      style={containerStyle}
    >
      {props.variant === 'announcement'
        ? <AnnouncementWidgetContent
            contentType={contentType}
            contentAlignment={
              contentAlignment
                ?? announcementWidgetDefaults.infoSettings.contentAlignment!
            }
            contentUrl={backgroundImage}
          />
        : (rewardScreenEnabled && <CountdownRewardScreen isAnnouncement />)
      }
      
      <div className="flex justify-center py-2 mt-auto mb-0">
        <FreePlanBrandingLink />
      </div>
    </div>
  )
}

export default AnnouncementWidget
