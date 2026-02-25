import { useEffect, useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'
import { Button } from '@heroui/button'
import { DateTime } from 'luxon'

import CompanyLogo from './CompanyLogo'
import CountdownTimer from '@/components/CountdownTimer'
import { BrTagsOnNewlines } from './utils/BrTagsOnNewlines'
import * as Icons from '@/components/Icons'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { getFontWeightClass } from './utils/getFontWeightClass'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'

type CountdownScreenProps = {
  companyLogoEnabled: boolean
  companyLogo?: string
  onCountdownScreenButtonPress?: () => void
}

const CountdownScreen = (props: CountdownScreenProps) => {
  const {
    title,
    titleFontWeight,
    titleColor,
    description,
    descriptionFontWeight,
    descriptionColor,

    countdownDate,
    countdownEnabled,
    countdownBackgroundColor,
    countdownFontColor,

    buttonText,
    buttonFontColor,
    buttonBackgroundColor,
    icon,
    link,

    rewardScreenEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = s.settings?.widget as AnnouncementWidgetType
      const infoSettings = widget.infoSettings
      const rewardSettings = widget.rewardMessageSettings

      return {
        title: infoSettings.title,
        titleFontWeight: infoSettings.titleFontWeight,
        titleColor: infoSettings.titleColor,
        description: infoSettings.description,
        descriptionFontWeight: infoSettings.descriptionFontWeight,
        descriptionColor: infoSettings.descriptionColor,
        
        countdownEnabled: infoSettings.countdownEnabled,
        countdownDate: infoSettings.countdownDate,
        countdownBackgroundColor: infoSettings.countdownBackgroundColor,
        countdownFontColor: infoSettings.countdownFontColor,

        buttonText: infoSettings.buttonText,
        buttonFontColor: infoSettings.buttonFontColor,
        buttonBackgroundColor: infoSettings.buttonBackgroundColor,
        icon: infoSettings.icon,
        link: infoSettings.link,

        rewardScreenEnabled: rewardSettings.rewardScreenEnabled,
      }
    })
  )

  const [initialTime, setInitialTime] = useState<number>(0)

  useEffect(() => {
    if (!countdownEnabled) {
      return
    }

    const eventDate = DateTime.fromISO(countdownDate)
    const now = DateTime.now()
    const diff = Math.floor(
      eventDate
        .diff(now, 'seconds')
        .as('seconds')
    )
    
    setInitialTime(diff > 0 ? diff : 0)
  }, [countdownEnabled, countdownDate])

  const buttonStyle: CSSProperties = {
    color: buttonFontColor,
    backgroundColor: buttonBackgroundColor,
  }

  const IconComponent = Icons[icon]

  const handleButtonPress = () => {
    if (!rewardScreenEnabled) {
      window.open(link, '_blank')
    }
    props.onCountdownScreenButtonPress?.()
  }

  return (
    <>
      <div className='w-42 h-9.5 mt-14'>
        {props.companyLogoEnabled && (
          <CompanyLogo
            companyLogo={props.companyLogo}
          />
        )}
      </div>
    
      <div
        className={cn(
          'w-full flex flex-col items-center justify-center mt-3.75 gap-3.75',
        )}
      >
        <span
          className={cn(
            'text-white font-bold text-[40px] leading-12 text-center',
            'transition-all duration-250',
            getFontWeightClass(titleFontWeight),
          )}
          style={{ color: titleColor }}
        >
          {/* До Нового года осталось */}
          <BrTagsOnNewlines input={title} />
        </span>
        <span
          className={cn(
            'text-white text-[16px] leading-4.75 text-center',
            'transition-all duration-250',
            getFontWeightClass(descriptionFontWeight),
          )}
          style={{ color: descriptionColor }}
        >
          {/* Вы можете разместить здесь описание */}
          <BrTagsOnNewlines input={description} />
        </span>

        {countdownEnabled
          ? <CountdownTimer
              initialTime={initialTime}
              backgroundColor={countdownBackgroundColor}
              fontColor={countdownFontColor}
            />
          : <div className='w-full h-24.5 bg-transparent' />
        }

        <Button
          className={cn(
            'w-full h-10.75 bg-[#FFB400] rounded-md text-[20px]',
            'transition-colors duration-250',
          )}
          style={buttonStyle}
          onPress={handleButtonPress}
        >
          {/* Хочу скидку! */}
          {icon !== 'HeartDislike' && (
            <div className='w-3.75 h-3.75'>
              <IconComponent />
            </div>
          )}
          {buttonText}
        </Button>
      </div>
    </>
  )
}

export default CountdownScreen
