import type { WidgetDefinition } from '@/layouts/Widgets/registry'
import FABMenuField from './FABMenuField'

export const fabMenuWidgetMetadata: Pick<WidgetDefinition, 'settings'> = {
  settings: {
    sections: [{ id: 'fab-menu.sectors', Component: FABMenuField }]
  }
}
