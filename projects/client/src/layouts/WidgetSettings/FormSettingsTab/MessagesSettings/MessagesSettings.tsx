import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import SimpleMessageField from './SimpleMessageField'
import OnWinMessageSection from './OnWinMessageSection'

const MessagesSettings = () => {
  // Subscribe to messages branch to keep defaults consistent (no direct usage needed here)
  useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'messages', STATIC_DEFAULTS.form.messages)
  )

  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errLimitShows = showValidation ? getErrors('form.messages.limitShows') : []
  const errLimitWins = showValidation ? getErrors('form.messages.limitWins') : []
  const errAllPrizes = showValidation ? getErrors('form.messages.allPrizesGiven') : []

  // Keep subscriptions so updates trigger rerender
  void errLimitShows
  void errLimitWins
  void errAllPrizes

  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-rubik">Настройка сообщений</span>

      <OnWinMessageSection />

      <SimpleMessageField
        messageKey="limitShows"
        title="Сообщение при превышении лимита показов"
        placeholder="Вы уже видели эту игру"
      />

      <SimpleMessageField
        messageKey="limitWins"
        title="Сообщение при превышении лимита побед"
        placeholder="Вы уже получили наш приз, испытайте удачу в другой игре"
      />

      <SimpleMessageField
        messageKey="allPrizesGiven"
        title="Сообщение при превышении лимита выигрышей"
        placeholder="Все призы выданы! Следите за новостями"
      />
    </div>
  )
}

export default MessagesSettings
