import { cn } from '@heroui/theme'
import { Input } from '@heroui/input'
import { useShallow } from 'zustand/react/shallow'

import TextSettings from '@/components/TextSettings'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import ButtonAppearenceSettings from '@/layouts/WidgetSettings/DisplaySettingsTab/ButtonAppearenceSettings/ButtonAppearenceSettings'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type {
  AnnouncementWidget,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from '../defaults'

import CountdownSettings from './CountdownSettings'

const InfoSettings = () => {
  const {
    title,
    titleColor,
    description,
    descriptionColor,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const settings = s.settings?.widget as AnnouncementWidget
      return  {
        title: settings.infoSettings?.title,
        titleColor: settings.infoSettings?.titleColor,
        description: settings.infoSettings?.description,
        descriptionColor: settings.infoSettings?.descriptionColor,
      }
    })
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

  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Окно информации
      </h1>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title={title || announcementWidgetDefaults.infoSettings!.title}
            placeholder="Укажите заголовок"
            noFontSize
            onTitleChange={setInfoScreenTitle}
            onColorChange={setInfoScreenTitleColor}
          />
        </div>
      </BorderedContainer>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title={
              description
              || announcementWidgetDefaults.infoSettings!.description
            }
            placeholder="Получите супер скидку до 30 % на покупку билета в АРТ КАФЕ."
            noFontSize
            onTitleChange={setInfoScreenDescription}
            onColorChange={setInfoScreenDescriptionColor}
          />
        </div>
      </BorderedContainer>

      <CountdownSettings />

      <BorderedContainer>
        <div className="w-full flex flex-col gap-2.5">
          <h2 className="text-[16px] leading-4.75">Кнопка</h2>
          <ButtonAppearenceSettings
            onTriggerTextChange={() => {}}
            onTriggerIconChange={() => {}}
            onFontColorChange={() => {}}
            onBackgroundColorChange={() => {}}
            buttonText={'Получить скидку'}
            buttonTextColor={'#FFB34F'}
            buttonBackgroundColor={'#0F3095'}
            buttonIcon={'Sparkles'}
          />

          <h2 className="text-[16px] leading-4.75">Ссылка</h2>
            <Input
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
