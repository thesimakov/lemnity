import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CloseButton from '@/layouts/Widgets/Common/CloseButton/CloseButton'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  role?: 'dialog' | 'alertdialog'
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  /**
   * Hide the default close (X) button rendered inside the dialog.
   * Useful when the modal content renders its own close control.
   */
  hideCloseButton?: boolean
  backdropClassName?: string
  containerClassName?: string
  /**
   * Optional override for where to portal the modal.
   * Falls back to context, then to document.body root.
   */
  portalRoot?: HTMLElement | null
}

const MODAL_ROOT_ID = 'lemnity-modal-root'

function ensureModalRoot(): HTMLElement {
  let root = document.getElementById(MODAL_ROOT_ID)
  if (!root) {
    root = document.createElement('div')
    root.id = MODAL_ROOT_ID
    document.body.appendChild(root)
  }
  return root
}

const ModalPortalContext = React.createContext<HTMLElement | null>(null)
export const ModalPortalProvider = ModalPortalContext.Provider

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ]
  return Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
    el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  )
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  role = 'dialog',
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  backdropClassName = 'bg-black/50',
  containerClassName = '',
  portalRoot
}) => {
  const inheritedPortalRoot = useContext(ModalPortalContext)
  const [resolvedPortalRoot, setResolvedPortalRoot] = useState<HTMLElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastFocused = useRef<Element | null>(null)
  const hiddenSiblings = useRef<
    { el: HTMLElement; prevAriaHidden: string | null; prevInert: boolean }[]
  >([])

  // Resolve portal root only in the browser to avoid SSR crashes
  useEffect(() => {
    if (portalRoot) {
      setResolvedPortalRoot(portalRoot)
      return
    }
    if (inheritedPortalRoot) {
      setResolvedPortalRoot(inheritedPortalRoot)
      return
    }
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      setResolvedPortalRoot(ensureModalRoot())
    }
  }, [portalRoot, inheritedPortalRoot])

  // Body scroll lock when modal is open
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeOnEsc, onClose])

  // When the modal is open, this code temporarily "hides" the rest of the page content
  // for accessibility helpers and makes it unclickable
  useEffect(() => {
    if (!isOpen || !resolvedPortalRoot) return
    const isShadowTarget = resolvedPortalRoot.getRootNode() instanceof ShadowRoot
    if (!isShadowTarget) {
      const root = resolvedPortalRoot
      const siblings = Array.from(document.body.children) as HTMLElement[]
      hiddenSiblings.current = []
      for (const el of siblings) {
        if (el === root) continue
        hiddenSiblings.current.push({
          el,
          prevAriaHidden: el.getAttribute('aria-hidden'),
          prevInert: (el as HTMLElement).inert ?? false
        })
        el.setAttribute('aria-hidden', 'true')
        if ('inert' in HTMLElement.prototype) {
          ;(el as HTMLElement).inert = true
        }
      }
    }
    return () => {
      if (!isShadowTarget) {
        for (const { el, prevAriaHidden, prevInert } of hiddenSiblings.current) {
          if (prevAriaHidden === null) {
            el.removeAttribute('aria-hidden')
          } else {
            el.setAttribute('aria-hidden', prevAriaHidden)
          }
          if ('inert' in HTMLElement.prototype) {
            try {
              ;(el as HTMLElement).inert = prevInert
            } catch {
              console.error('Error setting inert attribute', el)
            }
          }
        }
        hiddenSiblings.current = []
      }
    }
  }, [isOpen, resolvedPortalRoot])

  // Focus management / trap
  useEffect(() => {
    if (!isOpen) return
    lastFocused.current = document.activeElement
    const dialog = dialogRef.current
    if (!dialog) return
    const focusables = getFocusableElements(dialog)
    ;(focusables[0] || dialog).focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const currentDialog = dialogRef.current
      if (!currentDialog) return
      const nodes = getFocusableElements(currentDialog)
      if (nodes.length === 0) {
        e.preventDefault()
        currentDialog.focus()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement
      if (e.shiftKey) {
        if (!currentDialog.contains(active) || active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last || !currentDialog.contains(active)) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const toRestore = lastFocused.current as HTMLElement | null
      if (toRestore && typeof toRestore.focus === 'function') toRestore.focus()
    }
  }, [isOpen])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isOpen || !closeOnBackdrop) return
      const dialog = dialogRef.current
      const target = e.target as Node | null
      if (!dialog || !target) return
      // Close when click happens outside the dialog
      if (!dialog.contains(target)) onClose()
    },
    [isOpen, closeOnBackdrop, onClose]
  )

  if (!isOpen || !resolvedPortalRoot) return null

  const content = (
    <div
      ref={wrapperRef}
      className={`fixed inset-0 z-[2147483646] flex items-center justify-center p-4 transition-opacity duration-150 ${'opacity-100 pointer-events-auto'}`}
      onClick={handleBackdropClick}
    >
      <div className={`absolute inset-0 ${backdropClassName}`} />
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : 'Modal dialog')}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={`relative bg-white rounded-2xl overflow-hidden shadow-xl max-h-[90vh] w-full ${containerClassName}`}
      >
        {!hideCloseButton && <CloseButton position="right" onClose={onClose} />}
        {children}
      </div>
    </div>
  )

  return createPortal(content, resolvedPortalRoot)
}

export default Modal
