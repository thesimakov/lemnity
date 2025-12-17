import React from 'react'
import PreviewModal from '@/layouts/Widgets/Common/PreviewModal'
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

export const WheelEmbedRuntime = () => {
  const [open, setOpen] = React.useState(false)
  const [screen, setScreen] = React.useState<'main' | 'prize'>('main')
  const { run } = useWidgetActions()
  const spinTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const clearSpinTimer = () => {
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current)
      spinTimerRef.current = null
    }
  }

  const handleSubmit = () => {
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
          close: () => setOpen(false)
        }
      },
      undefined,
      handlerId => wheelActionHandlers[handlerId ?? '']
    )
  }

  const handleClose = () => {
    clearSpinTimer()
    setOpen(false)
    setScreen('main')
  }

  React.useEffect(() => () => clearSpinTimer(), [])

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
      <PreviewModal isOpen={open} onClose={handleClose} screen={screen} onSubmit={handleSubmit} />
    </>
  )
}
