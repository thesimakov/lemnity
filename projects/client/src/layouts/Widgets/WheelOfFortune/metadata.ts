import type { WidgetDefinition } from '@/layouts/Widgets/registry'
import WheelOfFortunePreview from './WheelOfFortunePreview'
import WheelDesktopScreen from './WheelDesktopScreen'
import WheelMobileScreen from './WheelMobileScreen'
import WheelSectorsField from '@/layouts/WidgetSettings/FieldsSettingsTab/WheelSectorsField/WheelSectorsField'

export const wheelWidgetMetadata: Pick<WidgetDefinition, 'preview' | 'settings'> = {
  preview: {
    panel: WheelOfFortunePreview,
    desktopScreens: {
      main: WheelDesktopScreen,
      prize: WheelDesktopScreen,
      panel: WheelDesktopScreen
    },
    mobile: WheelMobileScreen
  },
  settings: {
    sections: [{ id: 'wheel.sectors', Component: WheelSectorsField }]
  }
}
