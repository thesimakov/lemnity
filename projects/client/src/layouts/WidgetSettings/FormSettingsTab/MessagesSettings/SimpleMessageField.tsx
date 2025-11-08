import SwitchableField from '@/components/SwitchableField'
import { Input } from '@heroui/input'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import type { MessageKey } from '@/stores/widgetSettings/types'

type SimpleMessageFieldProps = {
  messageKey: Extract<MessageKey, 'limitShows' | 'limitWins' | 'allPrizesGiven'>
  title: string
  placeholder: string
}

const SimpleMessageField = ({ messageKey, title, placeholder }: SimpleMessageFieldProps) => {
  const { setMessage } = useFormSettings()
  const messages = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'messages', STATIC_DEFAULTS.form.messages)
  )
  const { enabled, text } = messages[messageKey]

  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errs = showValidation ? getErrors(`form.messages.${messageKey}`) : []
  const errorText = errs.find(e => e.path.endsWith('text'))?.message

  return (
    <SwitchableField
      classNames={{ title: 'font-normal' }}
      enabled={enabled}
      onToggle={e => setMessage(messageKey, e, text)}
      title={title}
    >
      <Input
        radius="sm"
        placeholder={placeholder}
        classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
        value={text}
        isInvalid={enabled && Boolean(errorText)}
        errorMessage={errorText}
        onValueChange={t => setMessage(messageKey, enabled, t)}
      />
    </SwitchableField>
  )
}

export default SimpleMessageField
