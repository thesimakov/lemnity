import React from 'react'
import { useWidgetActions } from '../useWidgetActions'
import usePreviewRuntimeStore from '@/stores/previewRuntimeStore'
import useWidgetSettingsStore, {
  type ButtonPosition,
  useWidgetStaticDefaults
} from '@/stores/widgetSettingsStore'
import type { DisplaySettings } from '@/stores/widgetSettings/types'
import { withDefaultsPath } from '@/stores/widgetSettings/utils'
import { useShallow } from 'zustand/react/shallow'
import { wheelActionHandlers } from './actionHandlers'
import Modal from '@/components/Modal/Modal'
import DesktopPreview from '@/layouts/Widgets/Common/DesktopPreview/DesktopPreview'
import { getWidgetDefinition } from '@/layouts/Widgets/registry'
import { WidgetTypeEnum } from '@lemnity/api-sdk'
import CloseButton from '../Common/CloseButton/CloseButton'

type WheelModalContentProps = {
  initialScreen?: 'main' | 'prize'
  onSubmit?: () => void
  onClose: () => void
}

export const WheelModalContent = ({
  initialScreen = 'main',
  onSubmit,
  onClose
}: WheelModalContentProps) => {
  const [screen, setScreen] = React.useState<'main' | 'prize'>(initialScreen)
  const { run } = useWidgetActions()
  const spinTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSpinTimer = React.useCallback(() => {
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current)
      spinTimerRef.current = null
    }
  }, [])

  const handleSubmit = React.useCallback(() => {
    const emit = usePreviewRuntimeStore.getState().emit
    const setTimer = (ms: number, cb: () => void) => {
      clearSpinTimer()
      spinTimerRef.current = setTimeout(() => {
        cb()
        spinTimerRef.current = null
      }, ms)
    }
    run(
      'spin',
      {
        payload: { screen },
        helpers: {
          emit,
          setScreen: (s: string) => setScreen(s === 'prize' ? 'prize' : 'main'),
          setTimer,
          clearTimer: clearSpinTimer,
          close: onClose
        }
      },
      undefined,
      handlerId => wheelActionHandlers[handlerId ?? '']
    )
    onSubmit?.()
  }, [clearSpinTimer, onClose, onSubmit, run, screen])

  const handleClose = React.useCallback(() => {
    clearSpinTimer()
    setScreen('main')
    onClose()
  }, [clearSpinTimer, onClose])

  React.useEffect(() => () => clearSpinTimer(), [clearSpinTimer])

  const definition = getWidgetDefinition(WidgetTypeEnum.WHEEL_OF_FORTUNE)

  return (
    <div className="relative">
      <CloseButton position="right" onClose={handleClose} />
      <DesktopPreview
        screen={screen}
        hideCloseButton
        onSubmit={handleSubmit}
        screens={definition?.preview?.desktopScreens}
      />
    </div>
  )
}

export const WheelEmbedRuntime = () => {
  const [open, setOpen] = React.useState(false)
  const staticDefaults = useWidgetStaticDefaults()
  const staticIcon = staticDefaults?.display?.icon
  const defaultIcon: NonNullable<DisplaySettings['icon']> = {
    type: staticIcon?.type ?? 'button',
    position: 'bottom-right',
    hide: staticIcon?.hide ?? 'always',
    image: staticIcon?.image ?? { fileName: '', url: '' },
    button: staticIcon?.button ?? {
      text: 'Испытай удачу',
      buttonColor: '#5951E5',
      textColor: '#FFFFFF'
    }
  }
  const iconConfig = useWidgetSettingsStore(
    useShallow(s => withDefaultsPath(s.settings?.display, 'icon', defaultIcon))
  )
  const buttonPosition = (iconConfig.position as ButtonPosition | undefined) ?? 'bottom-right'
  const buttonConfig = iconConfig.button ?? defaultIcon.button
  const iconType = iconConfig.type ?? defaultIcon.type
  const imageUrl = iconConfig.image?.url

  const anchorStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 2147483641
  }
  switch (buttonPosition) {
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

  const Trigger =
    iconType === 'image' && imageUrl ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block rounded-full transform transition-transform duration-200 ease-out hover:scale-[1.05]"
      >
        <img
          src={imageUrl}
          alt={buttonConfig?.text?.trim() || 'Lemnity'}
          className="h-16 w-16 block"
        />
      </button>
    ) : (
      <button
        type="button"
        className="rounded-full px-5 py-3 shadow-lg transform transition duration-200 ease-out hover:scale-[1.05] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{
          backgroundColor: buttonConfig?.buttonColor,
          color: buttonConfig?.textColor
        }}
        onClick={() => setOpen(true)}
      >
        {buttonConfig?.text?.trim() || 'Испытай удачу'}
      </button>
    )

  return (
    <>
      <div style={anchorStyle}>{Trigger}</div>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        containerClassName="max-w-[928px]"
      >
        <WheelModalContent onClose={() => setOpen(false)} />
      </Modal>
    </>
  )
}
