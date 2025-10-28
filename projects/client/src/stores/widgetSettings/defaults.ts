import type { DayKey, WidgetSettings } from './types'

const defaultDays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const buildDefaults = (id: string): WidgetSettings => ({
  id,
  form: {
    companyLogo: { enabled: true, fileName: '', url: '' },
    template: {
      enabled: true,
      key: ''
      //     templateSettings: {
      //     image: { enabled: false, fileName: '', url: '' },
      //     contentPosition: 'left',
      //     colorScheme: 'primary',
      //     customColor: '#FFFFFF'
      //   },
    },
    formTexts: {
      title: { text: '', color: '#FFFFFF' },
      description: { text: '', color: '#FFFFFF' },
      button: { text: 'Крутить колесо', color: '#FFFFFF' }
    },
    countdown: { enabled: false },
    contacts: {
      phone: { enabled: true, required: false },
      email: { enabled: true, required: true },
      initials: { enabled: false, required: false }
    },
    agreement: { enabled: true, text: '', policyUrl: '' },
    adsInfo: { enabled: true, text: '', policyUrl: '' },
    sectors: { randomize: false, items: [] },
    messages: {
      onWin: { enabled: true, text: '' },
      limitShows: { enabled: true, text: '' },
      limitWins: { enabled: true, text: '' },
      allPrizesGiven: { enabled: true, text: '' }
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
