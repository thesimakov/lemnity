import type { DayKey, DisplaySettings } from './types'

export const DEFAULT_WEEKDAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const buildStandardDisplaySettings = (): DisplaySettings => ({
  startShowing: 'onClick',
  timer: { delayMs: 20000 },
  icon: {
    type: 'image',
    image: { fileName: '', url: '' },
    button: { text: '', buttonColor: '#5951E5', textColor: '#FFFFFF' },
    position: 'bottom-left',
    hide: 'always'
  },
  weekdays: { enabled: true, days: DEFAULT_WEEKDAYS, weekdaysOnly: false },
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
})
