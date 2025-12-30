import SvgIcon from '@/components/SvgIcon'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import iconReload from '@/assets/icons/reload.svg'
import { Checkbox } from '@heroui/checkbox'
import { useState } from 'react'
import Timer from '../../CountDown/Timer'
import { useActionTimerSettings } from '@/layouts/Widgets/CountDown/hooks'
import { useFieldsSettings } from '@/stores/widgetSettings/fieldsHooks'

type FormFields = {
  phone?: string
  email?: string
  name?: string
}

export type DynamicFieldsFormValues = FormFields

type DynamicFieldsFormProps = {
  centered?: boolean
  onSubmit: (values: FormFields) => void
  isMobile?: boolean
  noPadding?: boolean
}

const DynamicFieldsForm = ({
  centered = false,
  onSubmit,
  isMobile = false,
  noPadding = false
}: DynamicFieldsFormProps) => {
  const { settings } = useFieldsSettings()
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [adsInfoChecked, setAdsInfoChecked] = useState(false)
  const fieldsSettings = useWidgetSettingsStore(s => s.settings?.fields)
  const { contacts, formTexts, agreement, adsInfo, companyLogo, border } = fieldsSettings ?? {}
  const { phone: phoneCfg, email: emailCfg, name: nameCfg } = contacts ?? {}
  const { title, description, button } = formTexts || {}
  const { settings: timerSettings } = useActionTimerSettings()

  const { enabled: logoEnabled, url: logoUrl } = companyLogo ?? {}

  const {
    enabled: agreementEnabled,
    policyUrl,
    agreementUrl,
    color: agreementColor
  } = agreement ?? {}
  const {
    enabled: adsInfoEnabled,
    text: adsInfoText,
    policyUrl: adsInfoPolicyUrl,
    color: adsInfoColor
  } = adsInfo ?? {}

  const borderSettings = border ?? { enabled: true, color: '#E8E8E8' }
  const borderEnabled = borderSettings.enabled
  const borderColor = borderSettings.color ?? '#E8E8E8'

  // Normalize URL to ensure it has a protocol
  const normalizeUrl = (url: string): string => {
    if (!url) return url
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `https://${url}`
  }

  // Build schema based on settings (enabled/required flags)
  const buildSchema = () => {
    const shape: Record<string, z.ZodTypeAny> = {}
    if (phoneCfg?.enabled) {
      const base = z.string().min(10, 'Некорректный номер телефона')
      shape.phone = phoneCfg.required ? base : base.optional().or(z.literal(''))
    } else {
      shape.phone = z.string().optional().or(z.literal(''))
    }
    if (emailCfg?.enabled) {
      const base = z.email('Некорректный email')
      shape.email = emailCfg.required ? base : base.optional().or(z.literal(''))
    } else {
      shape.email = z.string().optional().or(z.literal(''))
    }
    if (nameCfg?.enabled) {
      const base = z
        .string()
        .min(1, 'Имя обязательно')
        .regex(/^[a-zA-Zа-яА-Я]+$/, 'Имя должно содержать только буквы')
      shape.name = nameCfg.required ? base : base.optional().or(z.literal(''))
    } else {
      shape.name = z.string().optional().or(z.literal(''))
    }
    return z.object(shape)
  }

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    resolver: zodResolver(buildSchema()),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { phone: '', email: '', name: '' }
  })

  return (
    <form
      onSubmit={handleSubmit(values => onSubmit(values))}
      className={`flex flex-col gap-3 ${isMobile ? '' : noPadding ? '' : 'px-10'} w-full ${centered ? 'items-center justify-center' : ''}`}
    >
      {logoEnabled && logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo"
          className={`w-25 h-12.5 object-contain ${centered ? '' : 'object-left'}`}
        />
      ) : null}
      {title?.text && (
        <h2
          className={`text-2xl font-bold whitespace-pre-wrap ${centered ? 'text-center' : ''}`}
          style={{ color: title.color }}
        >
          {title.text}
        </h2>
      )}
      {settings?.countdown.enabled ? (
        <>
          {timerSettings?.countdown.textBeforeCountdown && (
            <span
              className="text-md text-center"
              style={{ color: timerSettings?.countdown.textBeforeCountdownColor }}
            >
              {timerSettings?.countdown.textBeforeCountdown}
            </span>
          )}
          <Timer eventDate={timerSettings?.countdown.eventDate ?? new Date()} variant="mobile" />
        </>
      ) : null}
      <div
        className={`flex flex-col gap-3  rounded-xl ${borderEnabled ? 'border p-3' : 'p-0'}`}
        style={borderEnabled ? { borderColor } : undefined}
      >
        {description?.text && (
          <p
            className="text-md opacity-90 whitespace-pre-wrap"
            style={{ color: description.color }}
          >
            {description.text}
          </p>
        )}
        {nameCfg?.enabled ? (
          <Input
            placeholder="Ваше имя"
            variant="bordered"
            classNames={{ inputWrapper: 'h-10 rounded-2.5 bg-white', input: 'text-black' }}
            {...register('name')}
            value={getValues('name')}
            onChange={e => {
              const onlyLetters = e.target.value.replace(/[^a-zA-Zа-яА-Я]+/g, '').trim()
              setValue('name', onlyLetters, { shouldValidate: true, shouldDirty: true })
            }}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        ) : null}

        {phoneCfg?.enabled ? (
          <Input
            placeholder="Номер телефона"
            variant="bordered"
            classNames={{ inputWrapper: 'h-10 rounded-2.5 bg-white', input: 'text-black' }}
            {...register('phone')}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />
        ) : null}

        {emailCfg?.enabled ? (
          <Input
            placeholder="Ваш email"
            variant="bordered"
            classNames={{ inputWrapper: 'h-10 rounded-2.5 bg-white', input: 'text-black' }}
            {...register('email')}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        ) : null}

        <Button
          color="primary"
          variant="solid"
          className="w-full h-10 rounded-2.5 font-normal"
          style={{
            color: button?.color,
            backgroundColor: button?.backgroundColor
          }}
          type="submit"
          isLoading={isSubmitting}
          startContent={
            <SvgIcon
              src={iconReload}
              size={'16px'}
              className={`w-min text-[${button?.color || '#FFBF1A'}]`}
            />
          }
        >
          {button?.text || ''}
        </Button>

        {agreementEnabled ? (
          <div className="flex flex-row">
            <Checkbox
              isSelected={agreementChecked}
              onValueChange={setAgreementChecked}
              classNames={{
                wrapper:
                  'bg-white before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
                base: 'items-start max-w-full',
                label: `text-xs opacity-90 items-start ${centered ? 'text-center' : ''}`
              }}
            ></Checkbox>
            <span className="text-xs" style={{ color: agreementColor }}>
              Я даю{' '}
              <a
                href={normalizeUrl(agreementUrl ?? '')}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
                style={{ color: agreementColor }}
              >
                Согласие
              </a>{' '}
              на обработку персональных данных в соответсвии с{' '}
              <a
                href={normalizeUrl(policyUrl ?? '')}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
                style={{ color: agreementColor }}
              >
                Политикой конфиденциальности.
              </a>
            </span>
          </div>
        ) : null}

        {adsInfoEnabled ? (
          <div className="flex flex-row">
            <Checkbox
              isSelected={adsInfoChecked}
              onValueChange={setAdsInfoChecked}
              classNames={{
                wrapper:
                  'bg-white before:border-[#373737] rounded-[4px] before:rounded-[4px] after:rounded-[4px] after:bg-[#373737]',
                base: 'items-start max-w-full',
                label: `text-xs opacity-90 ${centered ? 'text-center' : ''}`
              }}
            ></Checkbox>
            <a
              href={normalizeUrl(adsInfoPolicyUrl ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: adsInfoColor }}
            >
              {adsInfoText}
            </a>
          </div>
        ) : null}
      </div>
    </form>
  )
}

export default DynamicFieldsForm
