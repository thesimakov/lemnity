import SwitchableField from '@/components/SwitchableField'
import { Input, Textarea } from '@heroui/input'
import useWidgetSettingsStore, { useFormSettings } from '@/stores/widgetSettingsStore'
import { STATIC_DEFAULTS } from '@/stores/widgetSettings/defaults'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'

const MessagesSettings = () => {
  const { setMessage } = useFormSettings()
  const messages = useWidgetSettingsStore(s =>
    withDefaultsPath(s.settings?.form, 'messages', STATIC_DEFAULTS.form.messages)
  )
  const { onWin, limitShows, limitWins, allPrizesGiven } = messages
  const getErrors = useWidgetSettingsStore(s => s.getErrors)
  const showValidation = useWidgetSettingsStore(s => s.validationVisible)
  const errOnWin = showValidation ? getErrors('form.messages.onWin') : []
  const errLimitShows = showValidation ? getErrors('form.messages.limitShows') : []
  const errLimitWins = showValidation ? getErrors('form.messages.limitWins') : []
  const errAllPrizes = showValidation ? getErrors('form.messages.allPrizesGiven') : []
  const { enabled: onWinEnabled, text: onWinText } = onWin
  const { enabled: limitShowsEnabled, text: limitShowsText } = limitShows
  const { enabled: limitWinsEnabled, text: limitWinsText } = limitWins
  const { enabled: allPrizesGivenEnabled, text: allPrizesGivenText } = allPrizesGiven

  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-rubik">Настройка сообщений</span>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={onWinEnabled}
        onToggle={enabled => setMessage('onWin', enabled, onWinText)}
        title="Текст при выигрыше"
      >
        <Textarea
          radius="sm"
          minRows={2}
          placeholder="Поздравляем! Вы выиграли, заберите Ваш приз! [ промокод ]"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
          value={onWinText}
          isInvalid={onWinEnabled && errOnWin.some(e => e.path.endsWith('text'))}
          errorMessage={errOnWin.find(e => e.path.endsWith('text'))?.message}
          onValueChange={text => setMessage('onWin', onWinEnabled, text)}
        />
      </SwitchableField>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={limitShowsEnabled}
        onToggle={enabled => setMessage('limitShows', enabled, limitShowsText)}
        title="Сообщение при превышении лимита показов"
      >
        <Input
          radius="sm"
          placeholder="Вы уже видели эту игру"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
          value={limitShowsText}
          isInvalid={limitShowsEnabled && errLimitShows.some(e => e.path.endsWith('text'))}
          errorMessage={errLimitShows.find(e => e.path.endsWith('text'))?.message}
          onValueChange={text => setMessage('limitShows', limitShowsEnabled, text)}
        />
      </SwitchableField>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={limitWinsEnabled}
        onToggle={enabled => setMessage('limitWins', enabled, limitWinsText)}
        title="Сообщение при превышении лимита побед"
      >
        <Input
          radius="sm"
          placeholder="Вы уже получили наш приз, испытайте удачу в другой игре"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
          value={limitWinsText}
          isInvalid={limitWinsEnabled && errLimitWins.some(e => e.path.endsWith('text'))}
          errorMessage={errLimitWins.find(e => e.path.endsWith('text'))?.message}
          onValueChange={text => setMessage('limitWins', limitWinsEnabled, text)}
        />
      </SwitchableField>

      <SwitchableField
        classNames={{ title: 'font-normal' }}
        enabled={allPrizesGivenEnabled}
        onToggle={enabled => setMessage('allPrizesGiven', enabled, allPrizesGivenText)}
        title="Сообщение при превышении лимита выигрышей"
      >
        <Input
          radius="sm"
          placeholder="Все призы выданы! Следите за новостями"
          classNames={{ input: 'placeholder:text-[#AFAFAF]' }}
          value={allPrizesGivenText}
          isInvalid={allPrizesGivenEnabled && errAllPrizes.some(e => e.path.endsWith('text'))}
          errorMessage={errAllPrizes.find(e => e.path.endsWith('text'))?.message}
          onValueChange={text => setMessage('allPrizesGiven', allPrizesGivenEnabled, text)}
        />
      </SwitchableField>
    </div>
  )
}

export default MessagesSettings
