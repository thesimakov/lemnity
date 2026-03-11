import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'
import { AnimatePresence, motion, type Transition } from 'framer-motion'

import * as Icons from '@/components/Icons'
import SvgIcon from '@/components/SvgIcon'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import iconAdd from '@/assets/icons/add.svg'
import iconBell from '@/assets/icons/bell-filled.svg'

import type {
  Notification,
  NotificationWidgetType,
} from '@lemnity/widget-config/widgets/notification'
import { notificationWidgetDefaults as defaults } from './defaults'
// import { useIsMobileViewport } from '@/hooks/useIsMobileViewport'
// import { useViewportWidth } from '@/hooks/useViewportWidth'

const EmptyNotificationList = () => {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-[#979797]',
      )}
    >
      <div className='w-6 h-6 mt-9.5'>
        <SvgIcon src={iconBell} />
      </div>

      <span className='mt-5 mb-12.5 text-base leading-3.75'>
        Нет новых уведомлений
      </span>
    </div>
  )
}

type NotificationListItemProps = {
  notification: Notification
  showSeparator?: boolean
}

const NotificationListItem = (props: NotificationListItemProps) => {
  const urlStyle: CSSProperties = {
    fontSize: props.notification.urlFontSize,
  }

  return (
    <div className='flex flex-col'>
      <span className='text-base font-[350] leading-5.5'>
        {props.notification.text}
      </span>
      <span className='text-base leading-5 mt-1'>
        <a
          href={props.notification.url}
          target='_blank'
          className='text-[#5951E5]'
          style={urlStyle}
        >
          {props.notification.urlText}
        </a>
      </span>

      {props.showSeparator && <hr className='border-[#E8E8E8] my-2.5' />}
    </div>
  )
}

type NotificationEmbedRuntimeProps = {
  preview?: boolean
}

const NotificationEmbedRuntime = (props: NotificationEmbedRuntimeProps) => {
  const {
    triggerText,
    triggerFontColor,
    triggerIcon,
    triggerBackgroundColor,
    triggerPosition,
    delay,
    notifications,
    brandingEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      const settings = (s.settings?.widget as NotificationWidgetType)

      return {
        triggerText: settings.triggerText
          ?? defaults.triggerText,
        triggerFontColor: settings.triggerFontColor
          ?? defaults.triggerFontColor,
        triggerIcon: settings.triggerIcon
          ?? defaults.triggerIcon,
        triggerBackgroundColor: settings.triggerBackgroundColor
          ?? defaults.triggerBackgroundColor,
        triggerPosition: settings.triggerPosition
          ?? defaults.triggerPosition,

        delay: settings.delay
          ?? defaults.delay,

        notifications: settings.notifications,

        brandingEnabled: settings.brandingEnabled
          ?? defaults.brandingEnabled,
      }
    })
  )

  const [open, setOpen] = useState(false)
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([])

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timers = notifications.map((notification, index) => {
      return setTimeout(() => {
        setLiveNotifications(prev => [...prev, notification])
      }, (index + 1) * delay * 1000)
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [notifications, delay])

  const TriggerIcon = triggerIcon ? Icons[triggerIcon] : null

  const toggleOpen = () => {
    setOpen(!open)
  }

  const sendBoundingRectToIframe = (clipOnlyTrigger?: boolean) => {
    if (!containerRef.current) {
      return
    }

    const isBottomRight = triggerPosition === 'bottom-right'
    const offset = 24  // left-6 / right-6 / bottom-6
    const boundingRect = containerRef.current.getBoundingClientRect()

    let left: number
    let top: number

    if (open) {
      left = isBottomRight
        ? window.innerWidth - boundingRect.width - offset
        : 0
      top = window.innerHeight - boundingRect.height - offset
    }
    else {
      const width = clipOnlyTrigger
        ? 70 + offset   // show just the trigger
        : 233 + offset  // allow enough space for both trigger and hover label

      left = isBottomRight
        ? window.innerWidth - width
        : offset
      // 70 instead of 62 to accomodate for hover:scale-105
      top = window.innerHeight - 70
    }

    window.parent.postMessage({
      scope: 'lemnity-embed',
      type: 'interactive-region',
      lock: false,
      rect: {
        left: left,
        top: top,
        width: open
          ? boundingRect.width + offset
          : clipOnlyTrigger
            ? 70    // show just the trigger
            : 233,  // allow enough space for both trigger and hover label,
        height: open ? boundingRect.height + offset : 70,
      },
    })
  }

  const hadleTriggerMouseEnter = () => {
    sendBoundingRectToIframe()
  }

  const handleTriggerMouseLeave = () => {
    setTimeout(() => {
      sendBoundingRectToIframe(true)
    }, 300)
  }

  useEffect(sendBoundingRectToIframe, [open])
  useEffect(() => sendBoundingRectToIframe(!open), [open, liveNotifications])
  useEffect(() => sendBoundingRectToIframe(true), [])

  // const isMobileViewport = useIsMobileViewport()
  // const viewportWidth = useViewportWidth()

  // const mobileScale = width >= 357
  //   ? undefined
  //   // 2 20 px margins on x axis = 40 px
  //   // the width of the widget is w-89.25 = 357
  //   // 1% of 357 = 3.57
  //   : Math.floor((width - 40) / 3.57)

  // const mobileStyle: CSSProperties = {
  //   transform: mobile && mobileScale
  //     ? `scale(${mobileScale}%)`
  //     : undefined,
  // }

  const triggerStyle: CSSProperties = {
    color: triggerFontColor,
    backgroundColor: triggerBackgroundColor,
    willChange: 'transform',
  }
  const closeIconStyle: CSSProperties = {
    color: triggerFontColor,
  }
  const triggerHoverTextStyle: CSSProperties = {
    backgroundColor:
      `color-mix(in oklab, ${triggerBackgroundColor} 14%, transparent)`,
    color: triggerBackgroundColor,
  }
  const triggerHoverDivStyle = {
    clipPath: triggerPosition === 'bottom-right'
      // group-hover:-translate-x-[73%]
      ? 'polygon(-73% 0%, 30% 0%, 30% 100%, -73% 100%)'
      // group-hover:translate-x-[73%]
      : 'polygon(73% 0%, 173% 0%, 173% 100%, 73% 100%)',
  }

  const motionInitial = { opacity: 0, translateY: '12px' }
  const motionAnimate = { opacity: 1, translateY: '0' }
  const motionExit = { opacity: 0, translateY: '12px' }
  const motionTransition: Transition = { duration: 0.3, ease: 'easeInOut' }

  return (
    <div
      ref={containerRef}
      data-lemnity-interactive
      data-lemnity-notification
      className={cn(
        'flex flex-col gap-3',
        props.preview ? 'relative' : 'fixed bottom-6',
        triggerPosition === 'bottom-right' ? 'right-6' : 'left-6',
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={motionInitial}
            animate={motionAnimate}
            exit={motionExit}
            transition={motionTransition}
            className={cn(
              'w-89.25 shrink-0 p-4 flex flex-col',
              'bg-white rounded-[10px]',
              'shadow-[0px_8px_15px_6px_rgba(0,0,0,0.15)]',
            )}
          >
            {liveNotifications && liveNotifications.length > 0
              ? liveNotifications.map((notification, index) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    showSeparator={index !== (liveNotifications.length - 1)}
                  />
                ))
              : <EmptyNotificationList />
            }

            {brandingEnabled && (
              <div className='w-full mt-2.5 flex justify-center'>
                <FreePlanBrandingLink />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type='button'
        onClick={toggleOpen}
        className={cn(
          'group flex items-center justify-center rounded-full',
          'text-white ring-1 ring-white/20 relative',
          'transition-transform motion-reduce:transition-none duration-250',
          'h-15.5 min-w-15.5 w-fit gap-2.5 px-4 hover:scale-105',
          triggerPosition === 'bottom-right' && 'self-end',
        )}
        style={triggerStyle}
        aria-label={open ? 'Скрыть уведомления' : 'Показать уведомления'}
        onMouseEnter={hadleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
      >
        {triggerPosition === 'bottom-right' && triggerText && (
          <span>{triggerText}</span>
        )}

        {open
          ? (
            <div
              className='w-7.5 h-7.5 rotate-45'
              style={closeIconStyle}
            >
              <SvgIcon src={iconAdd} />
            </div>
          )
          : (triggerIcon !== 'HeartDislike' && TriggerIcon && (
              <div className='w-7.5 h-7.5'>
                <TriggerIcon />
              </div>
            ))
        }

        {triggerPosition === 'bottom-left' && triggerText && (
          <span>{triggerText}</span>
        )}

        {liveNotifications.length > 0 && (
          <div className='absolute top-0 right-0'>
            <span className='relative flex size-4.5'>
              <span
                className={cn(
                  'absolute inline-flex h-full w-full rounded-full',
                  'animate-ping bg-[#FF4646] opacity-75',
                )}
              />
              <span
                className={cn(
                  'relative inline-flex size-4.5 rounded-full bg-[#FF4646]',
                  'text-white text-xs items-center justify-center',
                )}
              >
                {liveNotifications.length}
              </span>
            </span>
          </div>
        )}

        {(!triggerText || triggerText.length === 0) && !open && (
          <div className='absolute' style={triggerHoverDivStyle}>
            <div
              className={cn(
                'bg-white',
                'rounded-full opacity-0 transition-all duration-300',
                'group-hover:opacity-100',
                triggerPosition === 'bottom-right'
                  ? 'group-hover:-translate-x-[73%]'
                  : 'group-hover:translate-x-[73%]',
              )}
            >
              <div
                className='w-full h-full rounded-full text-[20px] leading-5 p-4'
                style={triggerHoverTextStyle}
              >
                Уведомления
              </div>
            </div>
          </div>
        )}
      </button>
    </div>
  )
}

export default NotificationEmbedRuntime
