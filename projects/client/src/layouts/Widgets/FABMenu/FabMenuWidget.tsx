import { AnimatePresence, motion } from 'framer-motion'
import { FAB_MENU_ICON_OPTIONS } from './buttonLibrary'
import { FabMenuAddIcon, FabMenuBalloonIcon } from './fabMenuPreviewVisuals'
import { useFabMenuPreviewModel } from './useFabMenuPreviewModel'
import { cn } from '@heroui/theme'

type FabMenuWidgetProps = {
  anchorBaseClassName?: string
  anchorOffsetClassName?: {
    left?: string
    right?: string
  }
  listClassName?: string
  triggerClassName?: string
  signatureClassName?: string
}

const FabMenuWidget = ({
  anchorBaseClassName = '',
  anchorOffsetClassName,
  listClassName = '',
  triggerClassName = '',
  signatureClassName = ''
}: FabMenuWidgetProps) => {
  const {
    menuItems,
    alignClassName,
    safePosition,
    expanded,
    setExpanded,
    renderBackground,
    handleItemAction
  } = useFabMenuPreviewModel()

  const horizontalOffset =
    safePosition === 'bottom-left'
      ? (anchorOffsetClassName?.left ?? 'left-6')
      : (anchorOffsetClassName?.right ?? 'right-6')

  return (
    <div
      className={`flex flex-col gap-3 ${alignClassName} ${horizontalOffset} ${anchorBaseClassName}`}
    >
      <AnimatePresence>
        {expanded ? (
          <motion.div
            layout
            initial={{ opacity: 0, translateY: '12px' }}
            animate={{ opacity: 1, translateY: '0' }}
            exit={{ opacity: 0, translateY: '12px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`flex flex-col gap-2 ${alignClassName} ${listClassName}`}
          >
            {menuItems.map(item => {
              const iconEntry = FAB_MENU_ICON_OPTIONS[item.icon]
              const style = renderBackground(item)
              const showIcon = iconEntry?.showIcon ?? true
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemAction(item)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm transition hover:scale-[1.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  style={style}
                  title={item.description || item.label}
                >
                  {showIcon && iconEntry ? (
                    <img
                      src={iconEntry.icon}
                      alt={iconEntry.label}
                      className="h-5 w-5 object-contain"
                    />
                  ) : null}
                  <span className="flex-1">{item.label}</span>
                </button>
              )
            })}
            <span
              className={`mt-1 rounded-full bg-gray-200 px-4 py-1 text-xs font-medium text-gray-600 ${signatureClassName}`}
            >
              Сделано на lemnity
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-[#6C5CFF] to-[#8F5CFF]',
          'text-white shadow-lg ring-1 ring-white/20',
          'transition-transform hover:scale-105',
          triggerClassName
        )}
        aria-label={expanded ? 'Скрыть кнопки' : 'Показать кнопки'}
      >
        {expanded ? <FabMenuAddIcon /> : <FabMenuBalloonIcon alignClassName={alignClassName} />}
      </button>
    </div>
  )
}

export default FabMenuWidget
