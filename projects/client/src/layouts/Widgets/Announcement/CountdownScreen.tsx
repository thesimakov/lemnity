import { useEffect, useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'
import { Button } from '@heroui/button'
import { DateTime } from 'luxon'

import CompanyLogo from './CompanyLogo'
import CountdownTimer from '@/components/CountdownTimer'
import * as Icons from '@/components/Icons'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'

type CountdownScreenProps = {
  companyLogoEnabled: boolean
  companyLogo?: string
}

const CountdownScreen = (props: CountdownScreenProps) => {
  const {
    title,
    titleColor,
    description,
    descriptionColor,

    countdownDate,
    countdownEnabled,
    countdownBackgroundColor,
    countdownFontColor,

    buttonText,
    buttonFontColor,
    buttonBackgroundColor,
    icon,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = s.settings?.widget as AnnouncementWidgetType
      const infoSettings = widget.infoSettings

      return {
        title: infoSettings.title,
        titleColor: infoSettings.titleColor,
        description: infoSettings.description,
        descriptionColor: infoSettings.descriptionColor,
        
        countdownEnabled: infoSettings.countdownEnabled,
        countdownDate: infoSettings.countdownDate,
        countdownBackgroundColor: infoSettings.countdownBackgroundColor,
        countdownFontColor: infoSettings.countdownFontColor,

        buttonText: infoSettings.buttonText,
        buttonFontColor: infoSettings.buttonFontColor,
        buttonBackgroundColor: infoSettings.buttonBackgroundColor,
        icon: infoSettings.icon,
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
            'transition-colors duration-250',
          )}
          style={{ color: titleColor }}
        >
          {/* До Нового года осталось */}
          {title}
        </span>
        <span
          className={cn(
            'text-white text-[16px] leading-4.75 text-center',
            'transition-colors duration-250',
          )}
          style={{ color: descriptionColor }}
        >
          {/* Вы можете разместить здесь описание */}
          {description}
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
