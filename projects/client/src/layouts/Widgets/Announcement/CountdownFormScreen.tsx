import type { CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { Input } from '@heroui/input'
import { cn } from '@heroui/theme'

import CompanyLogo from './CompanyLogo'
import * as Icons from '@/components/Icons'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import type { Icon } from '@lemnity/widget-config/widgets/base'

type FormScreenButtonProps = {
  buttonStyle: CSSProperties
  icon: Icon
  buttonText: string
}

const FormScreenButton = (props: FormScreenButtonProps) => {
  const IconComponent = Icons[props.icon]

  return (
    <Button
      className={cn(
        'w-full h-10 rounded-[5px] bg-[#FFB400] text-[16px] leading-4.75',
        'gap-2.25 transition-colors duration-250',
      )}
      style={props.buttonStyle}
    >
      {/* Получить скидку */}
      {props.icon !== 'HeartDislike' && (
        <div className='w-3.75 h-3.75'>
          <IconComponent />
        </div>
      )}
      {props.buttonText}
    </Button>
  )
}

type CountdownformScreenProps = {
  companyLogoEnabled: boolean
  companyLogo?: string
}

const CountdownFormScreen = (props: CountdownformScreenProps) => {
  const {
    buttonText,
    buttonFontColor,
    buttonBackgroundColor,
    icon,
    link,

    title,
    titleFontColor,
    description,
    descriptionFontColor,

    contactAcquisitionEnabled,
    nameFieldEnabled,
    nameFieldRequired,
    emailFieldEnabled,
    emailFieldRequired,
    phoneFieldEnabled,
    phoneFieldRequired,

    agreement,
    adsInfo,

    rewardScreenEnabled
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const widget = s.settings?.widget as AnnouncementWidgetType
      const infoSettings = widget.infoSettings
      const formSettings = widget.formSettings
      const rewardSettings = widget.rewardMessageSettings

      return {
        buttonText: infoSettings.buttonText,
        buttonFontColor: infoSettings.buttonFontColor,
        buttonBackgroundColor: infoSettings.buttonBackgroundColor,
        icon: infoSettings.icon,
        link: infoSettings.link,

        title: formSettings?.title,
        titleFontColor: formSettings.titleFontColor,
        description: formSettings.description,
        descriptionFontColor: formSettings.descriptionFontColor,

        contactAcquisitionEnabled: formSettings.contactAcquisitionEnabled,
        nameFieldEnabled: formSettings.nameFieldEnabled,
        nameFieldRequired: formSettings.nameFieldRequired,
        emailFieldEnabled: formSettings.emailFieldEnabled,
        emailFieldRequired: formSettings.emailFieldRequired,
        phoneFieldEnabled: formSettings.phoneFieldEnabled,
        phoneFieldRequired: formSettings.phoneFieldRequired,

        agreement: formSettings.agreement,
        adsInfo: formSettings.adsInfo,

        rewardScreenEnabled: rewardSettings.rewardScreenEnabled,
      }
    })
  )

  const buttonStyle: CSSProperties = {
    color: buttonFontColor,
    backgroundColor: buttonBackgroundColor,
  }

  const inputStyles = {
    inputWrapper: 'rounded-[5px] px-2.25 border border-[#9A9A9A] bg-white',
    input: 'placeholder:text-black text-[16px] leading-4.75',
  }

  const checkboxStyles = {
    wrapper: cn(
      'w-4 h-4 before:border-1 before:border-white rounded-[4px]',
      'before:rounded-[4px] after:rounded-[4px] after:bg-transparent',
    ),
    icon: 'w-3 h-3 group-hover:text-black',
    base: 'self-start',
  }

  return (
    <>
      <div className="w-42 h-9.5 mt-12.5">
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
            'font-medium text-[35px] leading-10.25 text-white text-center',
            'transition-colors duration-250',
          )}
          style={{ color: titleFontColor }}
        >
          {/* Получите скидку */}
          {title}
        </span>
        <span
          className={cn(
            'text-[16px] leading-4.75 text-white text-center',
            'transition-colors duration-250',
          )}
          style={{ color: descriptionFontColor }}
        >
          {/* Укажите свой email и получите купон,
          который можно использовать при покупке */}
          {description}
        </span>

        {contactAcquisitionEnabled
          ? <>
              {nameFieldEnabled &&
                <Input
                  placeholder="Имя и Фамилия"
                  classNames={inputStyles}
                  isRequired={nameFieldRequired}
                />}
              {phoneFieldEnabled &&
                <Input
                  placeholder="Ваш телефон"
                  classNames={inputStyles}
                  isRequired={phoneFieldRequired}
                />}
              {emailFieldEnabled &&
                <Input
                  placeholder="Ваш email"
                  classNames={inputStyles}
                  isRequired={emailFieldRequired}
                />}
            </>
          : <div className="w-full h-23.75 bg-transparent" />}

        {rewardScreenEnabled
          ? <FormScreenButton
              buttonStyle={buttonStyle}
              buttonText={buttonText}
              icon={icon}
            />
          : <a
              href={link ?? 'about:blank'}
              target="_blank"
              className='w-full'
            >
              <FormScreenButton
                buttonStyle={buttonStyle}
                buttonText={buttonText}
                icon={icon}
              />
            </a>
        }

        {agreement.enabled && (
          <div className='w-full flex flex-row'>
            <Checkbox
              classNames={checkboxStyles}
              isRequired
            >
            </Checkbox>
            <span
              className={cn(
                'text-[9px] leading-2.75 text-white ml-1',
                'transition-colors duration-250',
              )}
              style={{ color: agreement.color }}
            >
              Я даю&nbsp;
              <a
                href={
                  agreement.agreementUrl && agreement.agreementUrl.length > 0
                    ? agreement.agreementUrl
                    : 'https://lemnity.ru/agreement'
                }
                target="_blank"
                className='underline'
              >
                Согласие
              </a>
              &nbsp;на обработку персональных данных в соответствии с&nbsp;
              <a
                href={
                  agreement.policyUrl && agreement.policyUrl.length > 0
                    ? agreement.policyUrl
                    : 'https://lemnity.ru/political'
                }
                target="_blank"
                className='underline'
              >
                Политикой конфиденциальности.
              </a>
            </span>
          </div>
        )}

        {adsInfo.enabled && (
          <div className='w-full flex flex-row'>
            <Checkbox
              classNames={checkboxStyles}
            >
            </Checkbox>
            <span
              className={cn(
                'text-[9px] leading-2.75 text-white ml-1',
                'transition-colors duration-250',
              )}
              style={{ color: adsInfo.color }}
            >
              <a
                href={
                  adsInfo.policyUrl && adsInfo.policyUrl.length > 0
                    ? adsInfo.policyUrl
                    : 'https://lemnity.ru/ads'
                }
                target="_blank"
                className='underline'
              >
                Нажимая на кнопку, вы даёте своё согласие на получение
                рекламно-информационной рассылки.
              </a>
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default CountdownFormScreen
