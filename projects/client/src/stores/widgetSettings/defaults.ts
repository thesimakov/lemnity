import type { DayKey, WidgetSettings } from './types'
import { createDefaultSector } from '@/layouts/Widgets/WheelOfFortune/createDefaultSector'

const MIN_SECTORS = 4
const defaultDays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const buildDefaults = (id: string): WidgetSettings => ({
  id,
  form: {
    companyLogo: { enabled: true, fileName: '', url: '' },
    template: {
      enabled: false,
      key: '',
      templateSettings: {
        image: { enabled: false, fileName: '', url: '' },
        windowFormat: 'modalWindow',
        contentPosition: 'left',
        colorScheme: 'primary',
        customColor: '#46b530'
      }
    },
    formTexts: {
      title: { text: 'Получите скидку в честь дня рождения компании', color: '#FFFFFF' },
      description: {
        text: 'Введите номер вашего телефона, крутите ленту и получите бонус',
        color: '#FFFFFF'
      },
      button: {
        text: 'Получить скидку',
        color: '#FFFFFF',
        backgroundColor: '#0F52E6',
        icon: 'rocket'
      }
    },
    countdown: { enabled: false },
    contacts: {
      phone: { enabled: true, required: true },
      email: { enabled: true, required: true },
      name: { enabled: true, required: false }
    },
    agreement: {
      enabled: true,
      // text: 'Я даю согласие на обработку моих персональных данных ООО Компания (ИНН 0000000000) в целях обработки заявки и обратной связи. Политика конфиденциальности по ссылке.',
      text: 'Я даю Согласие на обработку персональных данных в соотвествии с Политикой конфиденциальности',
      agreementUrl: 'lemnity.ru/agreement',
      policyUrl: 'lemnity.ru/political',
      color: '#000000'
    },
    adsInfo: {
      enabled: true,
      text: 'Нажимая на кнопку, вы даёте своё согласие на получение рекламно-информационной рассылки.',
      policyUrl: 'lemnity.ru/ads',
      color: '#000000'
    },
    sectors: {
      randomize: false,
      items: Array.from({ length: MIN_SECTORS }).map(createDefaultSector)
    },
    messages: {
      onWin: {
        enabled: true,
        text: 'Ура!\nВы выиграли',
        textSize: 36,
        description: 'Не забудьте использовать промокод во время\nоформления заказа!',
        descriptionSize: 16,
        colorScheme: {
          enabled: true,
          scheme: 'primary',
          discount: { color: '#000000', bgColor: '#FFF57F' },
          promo: { color: '#FFFFFF', bgColor: '#0069FF' }
        }
      },
      limitShows: { enabled: true, text: 'Вы уже видели эту игру' },
      limitWins: { enabled: true, text: 'Вы уже выиграли' },
      allPrizesGiven: { enabled: true, text: 'Вы уже получили все призы' }
    }
  },
  display: {
    startShowing: 'onClick',
    timer: { delayMs: 20000 },
    icon: {
      type: 'image',
      image: { fileName: '', url: '' },
      button: { text: '', buttonColor: '#5951E5', textColor: '#FFFFFF' },
      position: 'bottom-left',
      hide: 'always'
    },
    weekdays: { enabled: true, days: defaultDays, weekdaysOnly: false },
    showRules: {
      onExit: false,
      scrollBelow: { enabled: false, percent: null },
      afterOpen: { enabled: false, seconds: null }
    },
    frequency: { mode: 'everyPage' },
    dontShow: { afterWin: false, afterShows: null },
    limits: { afterWin: false, afterShows: null },
    schedule: {
      date: { enabled: true, value: 'fromDate' },
      time: { enabled: true, value: 'fromTime' }
    }
  },
  integration: { scriptSnippet: '' }
})

// Static defaults for effective reading without widget id
export const STATIC_DEFAULTS: WidgetSettings = buildDefaults('')
