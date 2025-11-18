import { WidgetTypeEnum } from '@lemnity/api-sdk'
import type { ActionTimerWidgetSettings } from '@/stores/widgetSettings/types'
import { buildFormSettings } from '@/layouts/Widgets/Common/formDefaults'

export const buildActionTimerWidgetSettings = (): ActionTimerWidgetSettings => ({
  type: WidgetTypeEnum.ACTION_TIMER,
  countdown: {
    textBeforeCountdownColor: '#FFFFFF',
    textBeforeCountdown: 'До мероприятия осталось:',
    badgeText: 'Концерт 08.10.2025',
    badgeBackground: '#E9EEFF',
    badgeColor: '#336EC2',
    eventDate: new Date(new Date().getMilliseconds() + 1000 * 60 * 60 * 24),
    enabled: true,
    imageUrl: 'https://tdt.kto72.ru/upload/resize_cache/kto/dfc/600_600_1/Tribyut_1.jpg'
  }
})

export const buildActionTimerFormSettings = () =>
  (() => {
    const base = buildFormSettings({
      formTexts: {
        title: { text: 'Успейте попасть на мероприятие мечты', color: '#FFFFFF' },
        description: {
          text: 'Оставьте контакты, чтобы получить напоминание и бонусные предложения',
          color: '#FFFFFF'
        },
        button: {
          text: 'Получить скидку',
          color: '#FFFFFF',
          backgroundColor: '#B88339',
          icon: 'rocket'
        }
      }
    })
    return {
      ...base,
      countdown: { enabled: true }
    }
  })()
