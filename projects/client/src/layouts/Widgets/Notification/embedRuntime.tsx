import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLProps,
} from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@heroui/theme'
import { AnimatePresence, motion, type Transition } from 'framer-motion'

import * as Icons from '@/components/Icons'
import SvgIcon from '@/components/SvgIcon'
import FreePlanBrandingLink from '@/components/FreePlanBrandingLink'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport'
import { useViewportWidth } from '@/hooks/useViewportWidth'

import iconAdd from '@/assets/icons/add.svg'
import iconBell from '@/assets/icons/bell-filled.svg'

import type {
  Notification,
  NotificationWidgetType,
  Position,
} from '@lemnity/widget-config/widgets/notification'
import { notificationWidgetDefaults as defaults } from './defaults'
import type { Icon } from '@lemnity/widget-config/widgets/base'


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

type WidgetProps = {
  mobile?: boolean
  open: boolean
  liveNotifications: Notification[]
  brandingEnabled: boolean
}

const Widget = (props: WidgetProps) => {
  const viewportWidth = useViewportWidth()
  // console.log('[Widget] viewportWidth', viewportWidth)
  const mobileScale =
    // 2 20 px margins on x axis = 40 px
    // the width of the widget is w-89.25 = 357
    // 1% of 357 = 3.57
    viewportWidth >= 357
      ? undefined
      : Math.floor((viewportWidth - 20) / 3.57)
  // console.log('[Widget] mobileScale', mobileScale)

  const mobileHeight = window.innerHeight
    - 24
    - 62
    - 12
    - 12

  const mobileStyle: CSSProperties | undefined = props.mobile
    ? {
        transform: mobileScale
          ? `scale(${mobileScale}%)`
          : undefined,
        maxHeight: mobileHeight,
        overflowY: 'auto',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        overflow: 'hidden',
      }
    : undefined

  const motionInitial = { opacity: 0, translateY: '12px' }
  const motionAnimate = { opacity: 1, translateY: '0' }
  const motionExit = { opacity: 0, translateY: '12px' }
  const motionTransition: Transition = { duration: 0.3, ease: 'easeInOut' }

  return (
    <AnimatePresence>
      {props.open && (
        <div style={mobileStyle}>
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
            <div
              className={cn(
                'w-full mt-4 mb-0',
                props.mobile && 'overflow-y-auto',
              )}
              style={
                props.mobile
                  ? { height: mobileHeight - 32 - 12 - 10 - 10 - 4 }
                  : undefined
              }
            >
              {props.liveNotifications && props.liveNotifications.length > 0
                ? props.liveNotifications.map((notification, index) => (
                    <NotificationListItem
                      key={notification.id}
                      notification={notification}
                      showSeparator={index !== (props.liveNotifications.length - 1)}
                    />
                  ))
                : <EmptyNotificationList />
              }
            </div>

            {props.brandingEnabled && (
              <div className='w-full mt-2.5 flex justify-center'>
                <FreePlanBrandingLink />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

type DesktopWidgetTriggerProps =
  Pick<HTMLProps<HTMLElement>, 'children'>
  & Pick<HTMLProps<HTMLButtonElement>, 'ref'>
  & {
      open: boolean
      triggerStyle: CSSProperties
      triggerHoverDivStyle: CSSProperties
      triggerHoverTextStyle: CSSProperties
      closeIconStyle: CSSProperties
      triggerIcon: Icon
      triggerText: string
      triggerPosition: Position
      numberOfNotifications: number
      onMouseEnter: () => void
      onMouseLeave: () => void
      toggleOpen: () => void
    }

const DesktopWidgetTrigger = ({ ref, ...props }: DesktopWidgetTriggerProps) => {
  const TriggerIcon = props.triggerIcon ? Icons[props.triggerIcon] : null
  const shouldShowHoverLabel =
    (!props.triggerText || props.triggerText.length === 0) && !props.open

  return (
    <>
      {props.children}

      <button
        ref={ref}
        type='button'
        onClick={props.toggleOpen}
        className={cn(
          'group flex items-center justify-center rounded-full',
          'text-white ring-1 ring-white/20 relative',
          'transition-transform motion-reduce:transition-none duration-250',
          'h-15.5 min-w-15.5 w-fit gap-2.5 px-4 hover:scale-105',
          props.triggerPosition === 'bottom-right' && 'self-end',
        )}
        style={props.triggerStyle}
        aria-label={props.open ? 'Скрыть уведомления' : 'Показать уведомления'}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {props.triggerPosition === 'bottom-right' && props.triggerText && (
          <span>{props.triggerText}</span>
        )}

        {props.open
          ? (
            <div
              className='w-7.5 h-7.5 rotate-45'
              style={props.closeIconStyle}
            >
              <SvgIcon src={iconAdd} />
            </div>
          )
          : (props.triggerIcon !== 'HeartDislike' && TriggerIcon && (
              <div className='w-7.5 h-7.5'>
                <TriggerIcon />
              </div>
            ))
        }

        {props.triggerPosition === 'bottom-left' && props.triggerText && (
          <span>{props.triggerText}</span>
        )}

        {props.numberOfNotifications > 0 && (
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
                {props.numberOfNotifications}
              </span>
            </span>
          </div>
        )}

        {shouldShowHoverLabel && (
          <div className='absolute' style={props.triggerHoverDivStyle}>
            <div
              className={cn(
                'bg-white',
                'rounded-full opacity-0 transition-all duration-300',
                'group-hover:opacity-100',
                props.triggerPosition === 'bottom-right'
                  ? 'group-hover:-translate-x-[73%]'
                  : 'group-hover:translate-x-[73%]',
              )}
            >
              <div
                className='w-full h-full rounded-full text-[20px] leading-5 p-4'
                style={props.triggerHoverTextStyle}
              >
                Уведомления
              </div>
            </div>
          </div>
        )}
      </button>
    </>
  )
}

type MobileWidgetTriggerProps =
  Pick<HTMLProps<HTMLElement>, 'children'>
  & Pick<HTMLProps<HTMLButtonElement>, 'ref'>
  & {
      open: boolean
      triggerStyle: CSSProperties
      triggerText: string
      toggleOpen: () => void
    }

const MobileWidgetTrigger = ({ ref, ...props }: MobileWidgetTriggerProps) => {
  const modalStyles: CSSProperties = {
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    touchAction: 'pan-y',
  }

  const triggerText = props.triggerText && props.triggerText.length > 0
    ? props.triggerText
    : 'Уведомления'

  const handleButtonPress = () => {
    const rect = props.open
      ? { left: 0, top: 0, width: 0, height: 0 }
      : {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }

    window.parent.postMessage({
      scope: 'lemnity-embed',
      type: 'interactive-region',
      lock: !props.open,
      rect: rect,
    })

    props.toggleOpen()
  }

  return (
    <>
      <button
        ref={ref}
        className='rounded-full h-13.5 min-w-13.5 w-fit px-4 self-end'
        style={props.triggerStyle}
        onClick={handleButtonPress}
      >
        {triggerText}
      </button>

      {props.open && (
        <div
          // data-lemnity-modal
          role='dialog'
          aria-modal='true'
          style={modalStyles}
          className={cn(
            'fixed left-0 top-0 w-full h-full z-2147483646 overflow-hidden',
            'flex flex-col items-center justify-center',
            'bg-black/20 backdrop-blur-sm py-5',
          )}
        >
          {/* <div className='w-full h-full relative'> */}
            {props.children}

            {/* <button
              className={cn(
                'absolute rounded-full min-h-13.5 min-w-15.5 w-fit px-4',
                'bottom-3 right-3',
              )}
              style={props.triggerStyle}
              onClick={handleButtonPress}
            >
              {triggerText}
            </button>
          </div> */}
        </div>
      )}
    </>
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

        notifications: settings.notifications
          ?? [],

        brandingEnabled: settings.brandingEnabled
          ?? defaults.brandingEnabled,
      }
    })
  )

  const [open, setOpen] = useState(false)
  const [isHoveringOnTrigger, setIsHoveringOnTrigger] = useState(false)
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const mouseLeaveTimeoutRef = useRef<number | null>(null)
  const widgetOpenTimeoutRef = useRef<number | null>(null)
  // i am going insane
  // embedManagerr needs to go, man, what the hell is this
  const firstMountCrutchRef = useRef(false)

  const isMobileViewport = useIsMobileViewport()

  useEffect(() => {
    const timers = notifications.map((notification, index) => {
      return setTimeout(() => {
        setLiveNotifications(prev => [...prev, notification])
      }, (index + 1) * delay * 1000)
    })

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [notifications, delay])

  const sendBoundingRectToIframe = useCallback((
    clipOnlyTrigger?: boolean,
    hoveringOnTrigger?: boolean
  ) => {
    if (!containerRef.current || !triggerRef.current) {
      return
    }

    const isBottomRight = triggerPosition === 'bottom-right'
    const offset = 24  // left-6 / right-6 / bottom-6
    const boundingRect = containerRef.current.getBoundingClientRect()
    const triggerWidth = triggerRef.current.clientWidth
    const triggerHeight = triggerRef.current.clientHeight

    let left: number
    let top: number

    if (open) {
      left = isBottomRight
        ? window.innerWidth - boundingRect.width - offset
        : 0
      top = window.innerHeight - boundingRect.height - offset
    }
    else {
      const width = clipOnlyTrigger && !hoveringOnTrigger
        // ? 70 + offset   // show just the trigger
        ? triggerWidth + 8 + offset   // show just the trigger
        : 233 + offset  // allow enough space for both trigger and hover label

      left = isBottomRight
        ? window.innerWidth - width
        : 0
      // 72 instead of 62 to accomodate for hover:scale-105
      // top = window.innerHeight - 72
      top = window.innerHeight - triggerHeight - 10
    }

    const message = {
      scope: 'lemnity-embed',
      type: 'interactive-region',
      lock: false,
      rect: {
        left: left,
        top: top,
        width: open
          ? boundingRect.width + offset
          : clipOnlyTrigger && !hoveringOnTrigger
            // ? 70    // show just the trigger
            ? triggerWidth + 8    // show just the trigger
            : 233,  // allow enough space for both trigger and hover label
        // height: open ? boundingRect.height + offset : 72,
        height: open ? boundingRect.height + offset : triggerHeight + 10,
      },
    }

    window.parent.postMessage(message)
    // console.log(message.rect)
    // console.log(`open ${open} clipOnlyTrigger ${clipOnlyTrigger} hoveringOnTrigger ${hoveringOnTrigger} clipOnlyTrigger && !hoveringOnTrigger ${clipOnlyTrigger && !hoveringOnTrigger}`)
  }, [open, triggerPosition])

  const toggleOpen = () => {
    setOpen(!open)
  }

  const handleTriggerMouseEnter = () => {
    if (mouseLeaveTimeoutRef.current) {
      clearTimeout(mouseLeaveTimeoutRef.current)
    }

    sendBoundingRectToIframe(undefined, false)
    setIsHoveringOnTrigger(true)
    console.log(isHoveringOnTrigger)
  }

  const handleTriggerMouseLeave = () => {
    setIsHoveringOnTrigger(false)

    mouseLeaveTimeoutRef.current = setTimeout(() => {
      sendBoundingRectToIframe(true)
      mouseLeaveTimeoutRef.current = null
    }, 300)
  }

  useEffect(() => {
    if (!firstMountCrutchRef.current) {
      return
    }

    if (isMobileViewport) {
      return
    }

    if (!open) {
      widgetOpenTimeoutRef.current = setTimeout(sendBoundingRectToIframe, 300)
      return
    }
    
    if (widgetOpenTimeoutRef.current) {
      clearTimeout(widgetOpenTimeoutRef.current)
    }

    sendBoundingRectToIframe()
  }, [open])

  useEffect(() => {
    if (isMobileViewport) {
      return
    }
    sendBoundingRectToIframe(true)
  }, [liveNotifications, isMobileViewport])

  useEffect(() => {
    sendBoundingRectToIframe(true)
    firstMountCrutchRef.current = true
  }, [])


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

  return (
    <div
      ref={containerRef}
      data-lemnity-interactive
      data-lemnity-notification={isMobileViewport ? undefined : true}
      className={cn(
        'flex flex-col gap-3',
        props.preview ? 'relative' : 'fixed bottom-3',
        triggerPosition === 'bottom-right' ? 'right-3' : 'left-3',
      )}
    >
      {isMobileViewport
        ? <MobileWidgetTrigger
            ref={triggerRef}
            open={open}
            toggleOpen={toggleOpen}
            triggerStyle={triggerStyle}
            triggerText={triggerText}
          >
            <Widget
              open={open}
              mobile={isMobileViewport}
              liveNotifications={liveNotifications}
              brandingEnabled={brandingEnabled}
            />
          </MobileWidgetTrigger>
        : <DesktopWidgetTrigger
            ref={triggerRef}
            closeIconStyle={closeIconStyle}
            numberOfNotifications={liveNotifications.length}
            onMouseEnter={handleTriggerMouseEnter}
            onMouseLeave={handleTriggerMouseLeave}
            toggleOpen={toggleOpen}
            open={open}
            triggerHoverDivStyle={triggerHoverDivStyle}
            triggerHoverTextStyle={triggerHoverTextStyle}
            triggerIcon={triggerIcon}
            triggerPosition={triggerPosition}
            triggerStyle={triggerStyle}
            triggerText={triggerText}
          >
            <Widget
              open={open}
              liveNotifications={liveNotifications}
              brandingEnabled={brandingEnabled}
            />
          </DesktopWidgetTrigger>
      }
    </div>
  )
}

export default NotificationEmbedRuntime
