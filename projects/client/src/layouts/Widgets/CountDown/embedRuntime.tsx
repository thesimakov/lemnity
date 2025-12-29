import React, { useState } from 'react'
import ActionTimerDesktopScreen from './ActionTimerDesktopScreen'
import useWidgetSettingsStore from '@/stores/widgetSettingsStore'
import Modal from '@/components/Modal/Modal'
import DesktopPreview from '../Common/DesktopPreview/DesktopPreview'
import { useWidgetActions } from '../useWidgetActions'
import { actionTimerHandlers } from './actionHandlers'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import type { DisplaySettings } from '@/stores/widgetSettings/types'
import { useWidgetStaticDefaults } from '@/stores/widgetSettingsStore'
import { useShallow } from 'zustand/react/shallow'
import { sendEvent } from '@/common/api/httpWrapper'

type ActionTimerModalContentProps = {
  screen: 'main' | 'panel' | 'prize'
  setScreen: (next: 'main' | 'panel' | 'prize') => void
  onRequestClose: () => void
  onCloseAction?: () => void
  onSubmit?: () => void
}

export const ActionTimerModalContent = ({
  screen,
  setScreen,
  onSubmit
}: ActionTimerModalContentProps) => {
  const { run } = useWidgetActions()

  const handleSubmit = () => {
    const handled = run(
      'submit',
      {
        payload: { screen },
        helpers: {
          setScreen: (s: string) =>
            setScreen(s === 'prize' ? 'prize' : s === 'panel' ? 'panel' : 'main')
        }
      },
      undefined,
      handlerId => actionTimerHandlers[handlerId ?? '']
    )

    if (!handled) setScreen('prize')
    onSubmit?.()
  }

  return (
    <div className="relative">
      <DesktopPreview
        screen={screen}
        onSubmit={handleSubmit}
        hideCloseButton
        screens={{
          main: ActionTimerDesktopScreen,
          prize: ActionTimerDesktopScreen,
          panel: ActionTimerDesktopScreen
        }}
      />
    </div>
  )
}

export const ActionTimerEmbedRuntime = () => {
  const staticDefaults = useWidgetStaticDefaults()
  const staticIcon = staticDefaults?.display?.icon
  const defaultIcon: NonNullable<DisplaySettings['icon']> = {
    type: staticIcon?.type ?? 'button',
    position: staticIcon?.position ?? 'bottom-right',
    hide: staticIcon?.hide ?? 'always',
    image: staticIcon?.image ?? { fileName: '', url: '' },
    button: staticIcon?.button ?? {
      text: 'Открыть',
      buttonColor: '#5951E5',
      textColor: '#FFFFFF'
    }
  }

  const iconConfig = useWidgetSettingsStore(
    useShallow(s => withDefaultsPath(s.settings?.display, 'icon', defaultIcon))
  )
  const widgetId = useWidgetSettingsStore(s => s.settings?.id)
  const [open, setOpen] = useState(false)
  const [screen, setScreen] = useState<'main' | 'panel' | 'prize'>('main')

  const iconType = iconConfig.type ?? defaultIcon.type
  const buttonConfig = iconConfig.button ??
    defaultIcon.button ?? {
      text: 'Открыть',
      buttonColor: '#5951E5',
      textColor: '#FFFFFF'
    }
  const buttonText = buttonConfig.text?.trim() || 'Открыть'
  const buttonBg = buttonConfig.buttonColor || '#5951E5'
  const buttonTextColor = buttonConfig.textColor || '#FFFFFF'
  const imageUrl = iconConfig.image?.url

  const anchorStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 2147483641
  }

  switch (iconConfig.position) {
    case 'bottom-left':
      anchorStyle.bottom = '24px'
      anchorStyle.left = '24px'
      break
    case 'top-right':
      anchorStyle.top = '24px'
      anchorStyle.right = '24px'
      break
    case 'bottom-right':
    default:
      anchorStyle.bottom = '24px'
      anchorStyle.right = '24px'
      break
  }

  const handleOpen = () => {
    setOpen(true)
    setScreen('main')
    if (widgetId) {
      sendEvent({ event_name: 'countdown.open', widget_id: widgetId })
    }
  }

  const resetState = () => {
    setOpen(false)
    setScreen('main')
  }

  const handleClose = () => {
    resetState()
    if (widgetId) {
      sendEvent({ event_name: 'countdown.close', widget_id: widgetId })
    }
  }

  const Trigger =
    iconType === 'image' && imageUrl ? (
      <button
        type="button"
        onClick={handleOpen}
        className="block rounded-full transform transition-transform duration-200 ease-out hover:scale-[1.05]"
      >
        <img src={imageUrl} alt={buttonText} className="h-16 w-16 block" />
      </button>
    ) : (
      <button
        type="button"
        className="rounded-full px-5 py-3 shadow-lg transform transition duration-200 ease-out hover:scale-[1.05] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{ backgroundColor: buttonBg, color: buttonTextColor }}
        onClick={handleOpen}
      >
        {buttonText}
      </button>
    )

  return (
    <>
      <div style={anchorStyle}>{Trigger}</div>
      <Modal isOpen={open} onClose={handleClose} containerClassName="max-w-[928px]">
        <ActionTimerModalContent
          screen={screen}
          setScreen={setScreen}
          onRequestClose={resetState}
          onSubmit={() => setScreen('prize')}
        />
      </Modal>
    </>
  )
}
