import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@heroui/theme'

import AnnouncementWidget from './AnnouncementWidget'
import CountdownAnnouncementWidget from './CountdownAnnouncementWidget'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import useUrlImageOrDefault from './utils/useUrlImage'

import type {
  AnnouncementWidgetType,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from './defaults'

const noBackgroundImageUrl = 'https://app.lemnity.ru/uploads/images/2026/01/2f539d8a-e1a6-4ced-a863-8e4aa37242d9-lemnity-pic.webp'

type FadeInOutProps = {
  visible: boolean
  children: React.ReactNode[]
}

const FadeInOut = (props: FadeInOutProps) => {
  return (
    <AnimatePresence initial={false}>
      {props.visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="flex flex-col gap-1"
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const AnnouncementPreview = () => {
  const {
    format,
    colorScheme,
    backgroundColor,
    borderRadius,

    contentType,
    contentAlignment,
    contentUrl,

    rewardScreenEnabled,
  } = useWidgetSettingsStore(
    useShallow(s => {
      const widget = s.settings?.widget as AnnouncementWidgetType
      const appearence = widget.appearence
      const rewardMessageSettings = widget.rewardMessageSettings
      const infoSettings = widget.infoSettings

      return {
        format: appearence.format,
        colorScheme: appearence.colorScheme,
        backgroundColor: appearence.backgroundColor,
        borderRadius: appearence.borderRadius,

        contentType: infoSettings.contentType,
        contentAlignment: infoSettings.contentAlignment,
        contentUrl: infoSettings.contentUrl,

        rewardScreenEnabled: rewardMessageSettings.rewardScreenEnabled,
      }
    })
  )

  const {
    base64Image: contentBase64Image,
    // error,
    isLoading,
  } = useUrlImageOrDefault(contentUrl)

  const containerStyle: CSSProperties = {
    backgroundColor: colorScheme === 'primary'
      ? format === 'announcement' ? '#FFFFFF' : '#725DFF'
      : backgroundColor && backgroundColor.length !== 0
          ? backgroundColor
          : announcementWidgetDefaults.appearence.backgroundColor,
    borderRadius: borderRadius
      ?? announcementWidgetDefaults.appearence.borderRadius,
  }

  const backgroundImage = contentUrl && !isLoading
    ? contentBase64Image as string
    : noBackgroundImageUrl

  if (contentType === 'background') {
    containerStyle.backgroundImage = `url('${backgroundImage}')`
    containerStyle.backgroundSize = 'cover'
    containerStyle.backgroundPosition = contentAlignment
  }

  const previewWidgetCardStyle = cn(
    'w-fit scale-40 origin-top-left ml-32.5',
    'pointer-events-none',
    // 'h-57',
  )

  const annInfoScreenRef = useRef<HTMLDivElement | null>(null)
  const annRewardScreenRef = useRef<HTMLDivElement | null>(null)

  const countdownInfoScreenRef = useRef<HTMLDivElement | null>(null)
  const countdownFormScreenRef = useRef<HTMLDivElement | null>(null)
  const countdownRewardScreenRef = useRef<HTMLDivElement | null>(null)

  const [annInfoScreenRect, setAnnInfoScreenRect] =
    useState<DOMRect | null>(null)
  const [annRewardScreenRect, setAnnRewardScreenRect] =
    useState<DOMRect | null>(null)

  const [countdownInfoScreenRect, setCountdownInfoScreenRect] =
    useState<DOMRect | null>(null)
  const [countdownFormScreenRect, setCountdownFormScreen] =
    useState<DOMRect | null>(null)
  const [countdownRewardScreenRect, setCountdownRewardScreen] =
    useState<DOMRect | null>(null)

  useEffect(() => {
    if (!annInfoScreenRef.current || !annRewardScreenRef.current) {
      return
    }

    const annInfoScreenObserver = new ResizeObserver(() => {
      if (!annInfoScreenRef.current) return
      setAnnInfoScreenRect(
        annInfoScreenRef.current.getBoundingClientRect()
      )
    })
    annInfoScreenObserver.observe(annInfoScreenRef.current)

    const annRewardScreenObserver = new ResizeObserver(() => {
      if (!annRewardScreenRef.current) return
      setAnnRewardScreenRect(
        annRewardScreenRef.current.getBoundingClientRect()
      )
    })
    annRewardScreenObserver.observe(annRewardScreenRef.current)

    return () => {
      annInfoScreenObserver.disconnect()
      annRewardScreenObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (
      !countdownInfoScreenRef.current
      || !countdownFormScreenRef.current
      || !countdownRewardScreenRef.current
    ) {
      return
    }

    const countdownInfoScreenObserver = new ResizeObserver(() => {
      if (!countdownInfoScreenRef.current) return
      setCountdownInfoScreenRect(
        countdownInfoScreenRef.current.getBoundingClientRect()
      )
    })
    countdownInfoScreenObserver.observe(countdownInfoScreenRef.current)

    const countdownFormScreenObserver = new ResizeObserver(() => {
      if (!countdownFormScreenRef.current) return
      setCountdownFormScreen(
        countdownFormScreenRef.current.getBoundingClientRect()
      )
    })
    countdownFormScreenObserver.observe(countdownFormScreenRef.current)

    const countdownRewardScreenObserver = new ResizeObserver(() => {
      if (!countdownRewardScreenRef.current) return
      setCountdownRewardScreen(
        countdownRewardScreenRef.current.getBoundingClientRect()
      )
    })
    countdownRewardScreenObserver.observe(countdownRewardScreenRef.current)

    return () => {
      countdownInfoScreenObserver.disconnect()
      countdownFormScreenObserver.disconnect()
      countdownRewardScreenObserver.disconnect()
    }
  }, [])

  return (
    // don't look at the vertical margins =w=
    // i was fed the fuck up with how much gaps were bitching at me
    <div className="w-full h-full flex flex-col overflow-auto select-none">
      {format === 'announcement' && (
        <div className="flex flex-col gap-1 h-full">
          <span className="text-xs self-center">
            Главный экран
          </span>
          <div
            className={previewWidgetCardStyle}
            style={{
              height: annInfoScreenRect
                ? `${annInfoScreenRect.height}px`
                : '228px'
            }}
          >
            <AnnouncementWidget
              ref={annInfoScreenRef}
              variant='announcement'
              focused
            />
          </div>

          <FadeInOut visible={rewardScreenEnabled}>
            <span className="text-xs self-center mb-1">
              Экран выигрыша
            </span>
            <div
              className={previewWidgetCardStyle}
              style={{
                height: annRewardScreenRect
                  ? `${annRewardScreenRect.height}px`
                  : '228px'
              }}
            >
              <AnnouncementWidget
                ref={annRewardScreenRef}
                variant="reward"
                focused
              />
            </div>
          </FadeInOut>
        </div>
      )}

      {format === 'countdown' && (
        <div className="flex flex-col gap-1 h-full">
          <span className="text-xs self-center mb-2">
            Главный экран
          </span>
          <div
            className={previewWidgetCardStyle}
            style={{
              height: countdownInfoScreenRect
                ? `${countdownInfoScreenRect.height}px`
                : '228px'
            }}
          >
            <CountdownAnnouncementWidget
              ref={countdownInfoScreenRef}
              variant="countdown"
              focused
              containerStyle={containerStyle}
            />
          </div>

          <FadeInOut visible={rewardScreenEnabled}>
            <span className="text-xs self-center mt-1 mb-1">
              Экран формы
            </span>
            <div
              className={previewWidgetCardStyle}
              style={{
                height: countdownFormScreenRect
                  ? `${countdownFormScreenRect.height}px`
                  : '228px'
              }}
            >
              <CountdownAnnouncementWidget
                ref={countdownFormScreenRef}
                variant="form"
                focused
                containerStyle={containerStyle}
              />
            </div>

            <span className="text-xs self-center mb-1">
              Экран выигрыша
            </span>
            <div
              className={previewWidgetCardStyle}
              style={{
                height: countdownRewardScreenRect
                  ? `${countdownRewardScreenRect.height}px`
                  : '228px'
              }}
            >
              <CountdownAnnouncementWidget
                ref={countdownRewardScreenRef}
                variant="reward"
                focused
                containerStyle={containerStyle}
              />
            </div>
          </FadeInOut>
        </div>
      )}
    </div>
  )
}

export default AnnouncementPreview
