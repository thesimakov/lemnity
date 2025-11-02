import SvgIcon from '@/components/SvgIcon'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import iconReload from '@/assets/icons/reload.svg'
import { Checkbox } from '@heroui/checkbox'
import { useState } from 'react'

type FormFields = {
  phone?: string
  email?: string
  name?: string
}

type DynamicFieldsFormProps = {
  centered?: boolean
  onSubmit: () => void
}

const DynamicFieldsForm = ({ centered = false, onSubmit }: DynamicFieldsFormProps) => {
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [adsInfoChecked, setAdsInfoChecked] = useState(false)
  const formSettings = useWidgetSettingsStore(s => s.settings.form)
  const { contacts, formTexts, agreement, adsInfo, companyLogo } = formSettings
  const { phone: phoneCfg, email: emailCfg, name: nameCfg } = contacts
  const { title, description, button } = formTexts || {}

  const { enabled: logoEnabled, url: logoUrl } = companyLogo

  const {
    enabled: agreementEnabled,
    text: agreementText,
    policyUrl: agreementPolicyUrl
  } = agreement
  const { enabled: adsInfoEnabled, text: adsInfoText, policyUrl: adsInfoPolicyUrl } = adsInfo

  // Build schema based on settings (enabled/required flags)
  const buildSchema = () => {
    const shape: Record<string, z.ZodTypeAny> = {}
    if (phoneCfg.enabled) {
      const base = z.string().min(10, 'Некорректный номер телефона')
      shape.phone = phoneCfg.required ? base : base.optional().or(z.literal(''))
    } else {
      shape.phone = z.string().optional().or(z.literal(''))
    }
    if (emailCfg.enabled) {
      const base = z.email('Некорректный email')
      shape.email = emailCfg.required ? base : base.optional().or(z.literal(''))
    } else {
      shape.email = z.string().optional().or(z.literal(''))
    }
    if (nameCfg.enabled) {
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
      onSubmit={handleSubmit(() => onSubmit())}
      className={`flex flex-col gap-3 px-10 w-full ${centered ? 'items-center justify-center' : ''}`}
    >
      {logoEnabled ? (
        <img src={logoUrl} alt="Logo" className="w-25 h-12.5 object-contain rounded-md" />
      ) : null}
      {title.text && (
        <h2 className="text-2xl font-bold" style={{ color: title.color }}>
          {title.text}
        </h2>
      )}
      {description.text && (
        <p className="text-xs opacity-90" style={{ color: description.color }}>
          {description.text}
        </p>
      )}

      {nameCfg.enabled ? (
        <Input
          placeholder="Ваше имя"
          variant="bordered"
          classNames={{ inputWrapper: 'h-10 rounded-2.5 bg-white', input: 'text-black' }}
          {...register('name')}
          value={getValues('name')}
          onChange={e => {
            const onlyLetters = e.target.value.replace(/[^a-zA-Zа-яА-Я]+/g, '').trim()
            console.log(onlyLetters)
            setValue('name', onlyLetters, { shouldValidate: true, shouldDirty: true })
          }}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
      ) : null}

      {phoneCfg.enabled ? (
        <Input
          placeholder="Номер телефона"
          variant="bordered"
          classNames={{ inputWrapper: 'h-10 rounded-2.5 bg-white', input: 'text-black' }}
          {...register('phone')}
          isInvalid={!!errors.phone}
          errorMessage={errors.phone?.message}
        />
      ) : null}

      {emailCfg.enabled ? (
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
              base: 'max-w-full',
              label: `text-xs opacity-90 ${centered ? 'text-center' : ''}`
            }}
          ></Checkbox>
          <Link to={agreementPolicyUrl} target="_blank">
            {agreementText}
          </Link>
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
              base: 'max-w-full',
              label: `text-xs opacity-90 ${centered ? 'text-center' : ''}`
            }}
          ></Checkbox>
          <Link to={adsInfoPolicyUrl} target="_blank">
            {adsInfoText}
          </Link>
        </div>
      ) : null}
    </form>
  )
}

export default DynamicFieldsForm
