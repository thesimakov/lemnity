import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  role?: 'dialog' | 'alertdialog'
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  backdropClassName?: string
  containerClassName?: string
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
  ariaLabelledBy,
  ariaDescribedBy,
  closeOnBackdrop = true,
  closeOnEsc = true,
  backdropClassName = 'bg-black/50',
  containerClassName = ''
}) => {
  const portalRoot = useMemo(() => ensureModalRoot(), [])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastFocused = useRef<Element | null>(null)
  const hiddenSiblings = useRef<HTMLElement[]>([])

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
    if (!isOpen) return
    const root = portalRoot
    const siblings = Array.from(document.body.children) as HTMLElement[]
    hiddenSiblings.current = []
    for (const el of siblings) {
      if (el === root) continue
      if (!el.hasAttribute('aria-hidden')) hiddenSiblings.current.push(el)
      el.setAttribute('aria-hidden', 'true')
      ;(el as HTMLElement).inert = true
    }
    return () => {
      for (const el of hiddenSiblings.current) {
        el.removeAttribute('aria-hidden')
        try {
          ;(el as HTMLElement).inert = false
        } catch {
          console.error('Error setting inert attribute', el)
        }
      }
      hiddenSiblings.current = []
    }
  }, [isOpen, portalRoot])

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
      const nodes = getFocusableElements(dialog)
      if (nodes.length === 0) {
        e.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement
      if (e.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    dialog.addEventListener('keydown', handleKeyDown)
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
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

  const content = (
    <div
      ref={wrapperRef}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-opacity duration-150 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`absolute inset-0 ${backdropClassName}`} />
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={`relative bg-white rounded-2xl overflow-hidden shadow-xl max-h-[90vh] w-full ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  )

  return createPortal(content, portalRoot)
}

export default Modal
