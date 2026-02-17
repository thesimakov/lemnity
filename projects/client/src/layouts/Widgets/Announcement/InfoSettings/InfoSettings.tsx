import { cn } from '@heroui/theme'
import { Input } from '@heroui/input'
import { useShallow } from 'zustand/react/shallow'

import ContentSettings from '../WidgetAppearanceSettings/ContentSettings'
import TextSettings from '@/components/TextSettings'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import ButtonAppearenceSettings from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonAppearenceSettings/ButtonAppearenceSettings'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from '../defaults'

import CountdownSettings from './CountdownSettings'
import {
  parseAbsoluteToLocal,
  ZonedDateTime,
} from '@internationalized/date'

const InfoSettings = () => {
  const {
    format,

    contentType,
    contentAlignment,
    contentUrl,

    title,
    titleColor,
    description,
    descriptionColor,

    countdownEnabled,
    countdownDate,
    countdownFontColor,
    countdownBackgroundColor,
    
    buttonText,
    buttonFontColor,
    buttonBackgroundColor,
    icon,
    link,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = (s.settings?.widget as AnnouncementWidgetType)
      const settings = widget.infoSettings

      return {
        format: widget.appearence.format,

        contentType: settings.contentType,
        contentAlignment: settings.contentAlignment,
        contentUrl: settings.contentUrl,

        title: settings?.title,
        titleColor: settings?.titleColor,
        description: settings?.description,
        descriptionColor: settings?.descriptionColor,

        countdownEnabled: settings?.countdownEnabled,
        countdownDate: settings?.countdownDate,
        countdownFontColor: settings?.countdownFontColor,
        countdownBackgroundColor: settings?.countdownBackgroundColor,
        
        buttonText: settings?.buttonText,
        buttonFontColor: settings?.buttonFontColor,
        buttonBackgroundColor: settings?.buttonBackgroundColor,
        icon: settings?.icon,
        link: settings?.link,
      }
    })
  )

  const setContentType = useWidgetSettingsStore(
    s => s.setAnnouncementContentType
  )
  const setContentAlignment = useWidgetSettingsStore(
    s => s.setAnnouncementContentAlignment
  )
  const setContentUrl = useWidgetSettingsStore(
    s => s.setAnnouncementContentUrl
  )

  const setInfoScreenTitle = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenTitle
  )
  const setInfoScreenTitleColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenTitleColor
  )
  const setInfoScreenDescription = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenDescription
  )
  const setInfoScreenDescriptionColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenDescriptionColor
  )

  const setInfoScreenCountdownEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownEnabled
  )
  const setInfoScreenCountdownDate = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownDate
  )
  const setInfoScreenCountdownFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownFontColor
  )
  const setInfoScreenCountdownBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenCountdownBackgroundColor
  )

  const setInfoScreenButtonText = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenButtonText
  )
  const setInfoScreenButtonFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenButtonFontColor
  )
  const setInfoScreenButtonBackgroundColor = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenButtonBackgroundColor
  )
  const setInfoScreenButtonIcon = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenIcon
  )
  const setInfoScreenButtonLink = useWidgetSettingsStore(
    s => s.setAnnouncementInfoScreenLink
  )

  const handleCountdownDateChange = (value: ZonedDateTime | null) => {
    if (!value) {
      return
    }
    setInfoScreenCountdownDate(value.toAbsoluteString())
  }

  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Окно информации
      </h1>
      
      <ContentSettings
        format={format}
        contentType={contentType}
        contentAlignment={contentAlignment}
        contentUrl={contentUrl}
        onContentTypeChange={setContentType}
        onContentAlignmentChange={setContentAlignment}
        onContentUrlChange={setContentUrl}
      />

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            text={
              title
              ?? announcementWidgetDefaults.infoSettings!.title
            }
            textColor={
              titleColor
              ?? announcementWidgetDefaults.infoSettings!.titleColor
            }
            title="Заголовок"
            placeholder="Укажите заголовок"
            onTextChange={setInfoScreenTitle}
            onColorChange={setInfoScreenTitleColor}
          />
        </div>
      </BorderedContainer>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            text={
              description
              ?? announcementWidgetDefaults.infoSettings!.description
            }
            textColor={
              descriptionColor
              ?? announcementWidgetDefaults.infoSettings!.descriptionColor
            }
            title="Описание"
            placeholder={
              "Получите супер скидку до 30 % на покупку билета в АРТ КАФЕ."
            }
            onTextChange={setInfoScreenDescription}
            onColorChange={setInfoScreenDescriptionColor}
          />
        </div>
      </BorderedContainer>

      {format === 'countdown' &&  <CountdownSettings
        enabled={
          countdownEnabled
          ?? announcementWidgetDefaults.infoSettings!.countdownEnabled
        }
        onToggle={setInfoScreenCountdownEnabled}
        date={
          countdownDate
            ? parseAbsoluteToLocal(countdownDate)
            : parseAbsoluteToLocal(new Date().toISOString())
        }
        onDateChange={handleCountdownDateChange}
        backgroundColor={
          countdownBackgroundColor
          ?? announcementWidgetDefaults.infoSettings!.countdownBackgroundColor
        }
        onBackgroundColorChange={setInfoScreenCountdownBackgroundColor}
        fontColor={
          countdownFontColor
          ?? announcementWidgetDefaults.infoSettings!.countdownFontColor
        }
        onFontColorChange={setInfoScreenCountdownFontColor}
      />}

      <BorderedContainer>
        <div className="w-full flex flex-col gap-2.5">
          <h2 className="text-[16px] leading-4.75">Кнопка</h2>
          <ButtonAppearenceSettings
            onTriggerTextChange={setInfoScreenButtonText}
            onTriggerIconChange={setInfoScreenButtonIcon}
            onFontColorChange={setInfoScreenButtonFontColor}
            onBackgroundColorChange={setInfoScreenButtonBackgroundColor}
            buttonText={buttonText}
            buttonTextColor={
              buttonFontColor
              ?? announcementWidgetDefaults.infoSettings!.buttonFontColor
            }
            buttonBackgroundColor={
              buttonBackgroundColor
              ?? announcementWidgetDefaults.infoSettings!.buttonBackgroundColor
            }
            buttonIcon={
              icon
              ?? announcementWidgetDefaults.infoSettings!.icon
            }
          />

          <h2 className="text-[16px] leading-4.75">Ссылка</h2>
            <Input
              value={
                link
                ?? announcementWidgetDefaults.infoSettings!.link
              }
              onValueChange={setInfoScreenButtonLink}
              placeholder={"lemnity.ru/ads"}
              classNames={{
                base: 'min-w-76 flex-1',
                inputWrapper: cn(
                  'rounded-md border bg-white border-[#E8E8E8] rounded-[5px]',
                  'shadow-none h-12.5 px-2.5',
                ),
                input: 'placeholder:text-[#AAAAAA] text-base'
              }}
            />
        </div>
      </BorderedContainer>
    </div>
  )
}

export default InfoSettings
