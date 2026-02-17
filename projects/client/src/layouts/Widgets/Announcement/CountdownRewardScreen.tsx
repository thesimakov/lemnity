import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'

import CompanyLogo from './CompanyLogo'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import type { CSSProperties } from 'react'
import { announcementWidgetDefaults } from './defaults'

type CountdownRewardScreenProps = {
  isAnnouncement?: boolean
}

const CountdownRewardScreen = (props: CountdownRewardScreenProps) => {
  const {
    title,
    titleFontSize,
    titleFontColor,

    description,
    descriptionFontSize,
    descriptionFontColor,

    discount,
    discountFontSize,
    discountFontColor,

    promo,
    promoFontSize,
    promoFontColor,

    customColorSchemeEnabled,
    customDiscountBackgroundColor,
    customPromoBackgroundColor,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const settings = (s.settings?.widget as AnnouncementWidgetType)
        .rewardMessageSettings

      return  {
        title: settings.title,
        titleFontSize: settings.titleFontSize,
        titleFontColor: settings.titleFontColor,
        
        description: settings.description,
        descriptionFontSize: settings.descriptionFontSize,
        descriptionFontColor: settings.descriptionFontColor,

        discount: settings.discount,
        discountFontSize: settings.discountFontSize,
        discountFontColor: settings.discountFontColor,

        promo: settings.promo,
        promoFontSize: settings.promoFontSize,
        promoFontColor: settings.promoFontColor,

        customColorSchemeEnabled:settings.customColorSchemeEnabled,
        customDiscountBackgroundColor: settings.customDiscountBackgroundColor,
        customPromoBackgroundColor: settings.customPromoBackgroundColor,
      }
    })
  )

  const titleStyle: CSSProperties = {
    fontSize: titleFontSize
      ?? announcementWidgetDefaults.rewardMessageSettings.titleFontSize,
    color: titleFontColor && titleFontColor.length > 0
      ? titleFontColor
      : announcementWidgetDefaults.rewardMessageSettings.titleFontColor,
  }

  const descriptionStyle: CSSProperties = {
    fontSize: descriptionFontSize
      ?? announcementWidgetDefaults.rewardMessageSettings.descriptionFontSize,
    color: descriptionFontColor && descriptionFontColor.length > 0
      ? descriptionFontColor
      : announcementWidgetDefaults.rewardMessageSettings.descriptionFontColor,
  }

  const discountStyle: CSSProperties = {
    fontSize: discountFontSize
      ?? announcementWidgetDefaults.rewardMessageSettings.discountFontSize,
    color: discountFontColor && discountFontColor.length > 0
      ? discountFontColor
      : announcementWidgetDefaults.rewardMessageSettings.discountFontColor,
  }

  const promoStyle: CSSProperties = {
    fontSize: promoFontSize
      ?? announcementWidgetDefaults.rewardMessageSettings.promoFontSize,
    color: promoFontColor && promoFontColor.length > 0
      ? promoFontColor
      : announcementWidgetDefaults.rewardMessageSettings.promoFontColor,
  }

  return (
    <>
      <div className='mt-20.75'>
        <CompanyLogo black={props.isAnnouncement} />
      </div>

      <div
        className={cn(
          'w-full flex flex-col items-center justify-center mt-3.75 gap-3.75',
        )}
      >
        <span
          className={cn(
            'font-semibold text-[40px] leading-11.75 ',
            'transition-colors duration-250',
            props.isAnnouncement ? 'text-black' : 'text-white'
          )}
          style={titleStyle}
        >
          {/* Ваша скидка: */}
          {title}
        </span>

        <div
          className={cn(
            'h-11 bg-[#FFF57F] rounded-full py-0.75 min-w-62.25 max-w-full',
            'flex items-center justify-center transition-colors duration-250'
          )}
          style={{
            backgroundColor: customColorSchemeEnabled
              ? customDiscountBackgroundColor
              : undefined
          }}
        >
          <span
            className={cn(
              'text-[20px] leading-6 text-black ',
              'transition-colors duration-250',
            )}
            style={discountStyle}
          >
            {/* Скидка 10% */}
            {discount}
          </span>
        </div>

        <span
          className={cn(
            'text-[16px] leading-4.75 text-center',
            'transition-colors duration-250',
            props.isAnnouncement ? 'text-black' : 'text-white'
          )}
          style={descriptionStyle}
        >
          {/* Не забудьте использовать промокод во время оформления заказа! */}
          {description}
        </span>

        <div
          className={cn(
            'w-full p-4 flex flex-col items-center justify-center gap-1',
            'rounded-[3px] border border-dashed bg-[#0069FF]/59',
            'transition-colors duration-250',
            props.isAnnouncement ? 'border-black' : 'border-white'
          )}
          style={{
            backgroundColor: customColorSchemeEnabled
              ? customPromoBackgroundColor
              : undefined
          }}
        >
          <span
            className={cn(
              'text-[12px] leading-3.5',
              'transition-colors duration-250',
              props.isAnnouncement ? 'text-black' : 'text-white'
            )}
          >
            Промокод
          </span>
          <span
            className={cn(
              'font-semibold text-[25px] leading-7.5',
              'transition-colors duration-250',
              props.isAnnouncement ? 'text-black' : 'text-white'
            )}
            style={promoStyle}
          >
            {/* PROMO-10P */}
            {promo}
          </span>
        </div>
      </div>
    </>
  )
}

export default CountdownRewardScreen
