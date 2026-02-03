import { lazy } from 'react'
import type { WidgetDefinition } from '@/layouts/Widgets/registry'

export const announcementWidgetMetadata: Pick<WidgetDefinition, 'preview' | 'settings'> = {
  preview: {
    panel: lazy(() => import('./AnnouncementPreview')),
    desktopScreens: {},
    mobile: null,
    inline: lazy(() => import('./AnnouncementFloatingPreview')),
    launcher: 'inline'
  },
  settings: {
    sections: [

    ]
  }
}
