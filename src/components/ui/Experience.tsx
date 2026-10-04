'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

/** Keep message updates within the thread, without pulling readers away. */
export function useChatScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const followRef = useRef(true)
  const onScroll = () => {
    const element = scrollRef.current
    if (element) followRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 96
  }
  const scrollToLatest = () => {
    const element = scrollRef.current
    if (!element || !followRef.current) return
    element.scrollTo({ top: element.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return { scrollRef, onScroll, scrollToLatest }
}

/** Overlay keyboard handling shared by drawers and chat dialogs. */
export function useOverlayFocus(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    if (!panel) return
    const candidates = () => Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')).filter((element) => element.getClientRects().length > 0)
    candidates()[0]?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      if (event.key !== 'Tab') return
      const items = candidates()
      const first = items[0]
      const last = items.at(-1)
      if (!first) { event.preventDefault(); panel.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    panel.addEventListener('keydown', handleKey)
    return () => { panel.removeEventListener('keydown', handleKey); if (trigger?.isConnected) trigger.focus() }
  }, [open, onClose])
  return panelRef
}

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useLanguage()
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismiss = useEffectEvent(onDismiss)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setClosing(true)
      closeTimer.current = setTimeout(() => dismiss(), 220)
    }, 4280)
    return () => { window.clearTimeout(timer); if (closeTimer.current) clearTimeout(closeTimer.current) }
  }, [message])
  const close = () => {
    setClosing(true)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(onDismiss, 220)
  }
  return <div className={`sim-toast ${closing ? 'sim-toast-closing' : ''}`} role="status"><CheckCircle2 className="h-5 w-5 shrink-0 text-simantri-600" aria-hidden="true" /><span>{t(message)}</span><button type="button" onClick={close} aria-label={t("Tutup pemberitahuan")}><X className="h-4 w-4" aria-hidden="true" /></button></div>
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`sim-skeleton ${className}`} aria-hidden="true" />
}
