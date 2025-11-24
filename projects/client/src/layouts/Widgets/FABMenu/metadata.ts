import type { WidgetDefinition } from '@/layouts/Widgets/registry'
import FABMenuField from './FABMenuField'
import FABMenuPreview from './FABMenuPreview'
import FABMenuDisplaySurface from './FABMenuDisplaySurface'

export const fabMenuWidgetMetadata: Pick<WidgetDefinition, 'preview' | 'settings'> = {
  preview: {
    panel: FABMenuPreview,
    desktopScreens: {},
    mobile: null
  },
  settings: {
    sections: [{ id: 'fab-menu.sectors', Component: FABMenuField }],
    surfaces: {
      display: FABMenuDisplaySurface
    }
  }
}
