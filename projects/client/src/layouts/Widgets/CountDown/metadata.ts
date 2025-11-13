import type { WidgetDefinition } from '@/layouts/Widgets/registry'
import CountDownPreview from './CountDownPreview'
import ActionTimerDesktopScreen from './ActionTimerDesktopScreen'
import ActionTimerMobileScreen from './ActionTimerMobileScreen'
import CountdownField from '@/layouts/WidgetSettings/FormSettingsTab/CountdownField/CountdownField'

export const actionTimerWidgetMetadata: Pick<WidgetDefinition, 'preview' | 'settings'> = {
  preview: {
    panel: CountDownPreview,
    desktopScreens: {
      main: ActionTimerDesktopScreen,
      prize: ActionTimerDesktopScreen,
      panel: ActionTimerDesktopScreen
    },
    mobile: ActionTimerMobileScreen
  },
  settings: {
    sections: [{ id: 'actionTimer.countdown', Component: CountdownField }]
  }
}
