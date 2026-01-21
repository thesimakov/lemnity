import { AnimatePresence, motion } from 'framer-motion'
import { FAB_MENU_ICON_OPTIONS } from './buttonLibrary'
import { FabMenuAddIcon, FabMenuBalloonIcon } from './fabMenuPreviewVisuals'
import { useFabMenuPreviewModel } from './useFabMenuPreviewModel'
import { cn } from '@heroui/theme'
import SvgIcon from '@/components/SvgIcon'

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
  // triggerClassName = '',
  signatureClassName = ''
}: FabMenuWidgetProps) => {
  const {
    triggerText,
    triggerTextColor,
    triggerBackgroundColor,
    menuItems,
    alignClassName,
    safePosition,
    expanded,
    toggleExpanded,
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
            className={`flex flex-col gap-2.5 ${alignClassName} ${listClassName}`}
          >
            {menuItems.map(item => {
              const iconEntry = FAB_MENU_ICON_OPTIONS[item.icon]
              const style = renderBackground(item)
              const showIcon = iconEntry?.showIcon ?? true
              const isNotMessenger =
                item.icon === 'custom'
                || item.icon === 'email'
                || item.icon === 'phone'
                || item.icon === 'website'
                || item.icon === 'calendar'

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemAction(item)}
                  className={cn(
                    'h-11.5 flex items-center gap-2 rounded-full px-4 py-2',
                    'text-sm transition motion-reduce:transition-none',
                    'duration-250 hover:scale-[1.05] focus:outline-none',
                    'focus-visible:ring-2 focus-visible:ring-white/70'
                  )}
                  style={style}
                  title={item.description || item.label}
                >
                  {showIcon && iconEntry && (
                    <div
                      className="h-5 w-5 object-contain"
                      style={
                        isNotMessenger
                        ? { color: triggerTextColor, fill: triggerTextColor }
                        : undefined
                      }
                    >
                      <SvgIcon
                        src={iconEntry.icon}
                        alt={iconEntry.label}
                      />
                    </div>
                  )}
                  <span className="flex-1">{item.label}</span>
                </button>
              )
            })}

            <a
              href="https://lemnity.ru"
              target="_blank"
              className={cn(
                'text-xs rounded-full px-4 h-5 flex items-center',
                'text-white bg-[#949494]',
                signatureClassName
              )}
            >
              Создано на Lemnity
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggleExpanded}
        className={cn(
          'flex items-center justify-center rounded-full',
          'text-white ring-1 ring-white/20',
          'transition-transform motion-reduce:transition-none duration-250 hover:scale-105',
          'h-14.75 min-w-14.75 gap-2.5 px-4'
          // triggerClassName
        )}
        style={{
          backgroundColor: triggerBackgroundColor,
          color: triggerTextColor
        }}
        aria-label={expanded ? 'Скрыть кнопки' : 'Показать кнопки'}
      >
        {triggerText && (<span className=''>{triggerText}</span>)}
        {expanded
          ? <FabMenuAddIcon color={triggerTextColor} />
          : <FabMenuBalloonIcon
              color={triggerTextColor}
              alignClassName={alignClassName}
            />
        }
      </button>
    </div>
  )
}

export default FabMenuWidget
