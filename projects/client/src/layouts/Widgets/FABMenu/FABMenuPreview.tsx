import type { PreviewMode } from '@/stores/widgetPreviewStore'
import './FABMenuPreview.css'
import { useFABMenuSettings } from './hooks'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import type { ButtonPosition } from '@/stores/widgetSettingsStore'
import type { FABMenuSectorItem } from './types'
import { FAB_MENU_ICON_OPTIONS, FAB_MENU_BUTTON_PRESETS } from './buttonLibrary'

const FALLBACK_SECTORS: FABMenuSectorItem[] = FAB_MENU_BUTTON_PRESETS.slice(0, 6).map(
  (preset, index) => ({
    id: `fallback-${preset.icon}-${index}`,
    label: preset.label,
    icon: preset.icon,
    payload: preset.payload,
    color: preset.color,
    description: preset.description
  })
)

const MENU_POSITION_CLASS: Record<ButtonPosition, string> = {
  'bottom-left': 'fabMenuPreview__menu--bottom-left',
  'bottom-right': 'fabMenuPreview__menu--bottom-right',
  'top-right': 'fabMenuPreview__menu--bottom-right'
}

type FABMenuPreviewProps = {
  mode: PreviewMode
}

const getIcon = (iconKey: FABMenuSectorItem['icon']) => FAB_MENU_ICON_OPTIONS[iconKey]

const formatItems = (items: FABMenuSectorItem[]): FABMenuSectorItem[] =>
  items.length > 0 ? items : FALLBACK_SECTORS

const normalizePosition = (position: ButtonPosition): ButtonPosition =>
  position === 'bottom-left' ? 'bottom-left' : 'bottom-right'

const FABMenuPreview = ({ mode }: FABMenuPreviewProps) => {
  const { settings } = useFABMenuSettings()
  const buttonPosition = useWidgetSettingsStore(
    s => (s.settings?.display?.icon?.position as ButtonPosition | undefined) ?? 'bottom-right'
  )
  const items = formatItems(settings?.sectors.items ?? [])
  const safePosition = normalizePosition(buttonPosition)
  const menuPositionClass = MENU_POSITION_CLASS[safePosition]

  return (
    <div className="fabMenuPreview">
      <div
        className={`fabMenuPreview__canvas ${
          mode === 'mobile' ? 'fabMenuPreview__canvas--mobile' : ''
        }`}
      >
        <div className="fabMenuPreview__viewport">
          <div className="fabMenuPreview__content">
            <span className="fabMenuPreview__title" />
            <span className="fabMenuPreview__text" />
            <span className="fabMenuPreview__text" style={{ width: '80%' }} />
            <span className="fabMenuPreview__text" style={{ width: '60%' }} />
          </div>

          <div className={`fabMenuPreview__menu ${menuPositionClass}`}>
            <div className="fabMenuPreview__menuList">
              {items.map(item => {
                const iconAsset = getIcon(item.icon)
                return (
                  <div
                    key={item.id}
                    className="fabMenuPreview__menuItem"
                    style={{ background: item.color }}
                  >
                    <span className="fabMenuPreview__icon">
                      {iconAsset?.showIcon ? (
                        <img src={iconAsset.icon} alt={iconAsset.label} />
                      ) : (
                        <>{item.label.slice(0, 1)}</>
                      )}
                    </span>
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>
            <button className="fabMenuPreview__trigger" aria-label="FAB menu trigger">
              ✦
            </button>
          </div>
        </div>
      </div>
      <span className="fabMenuPreview__signature">Сделано на lemnity</span>
    </div>
  )
}

export default FABMenuPreview
