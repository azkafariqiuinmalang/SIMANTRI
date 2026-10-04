'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from 'react'
import { Monitor, MoonStar, Sun } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { normalizeTheme, resolveTheme, THEME_STORAGE_KEY, type ThemePreference } from '@/lib/theme'

const EVENT = 'simantri-theme-change'
let memoryPreference: ThemePreference = 'system'
let storageUnavailable = false

function getSnapshot(): ThemePreference {
  try { return storageUnavailable ? memoryPreference : normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY)) }
  catch { return memoryPreference }
}
function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => { if (!event.key || event.key === THEME_STORAGE_KEY) notify() }
  window.addEventListener('storage', storage)
  window.addEventListener(EVENT, notify)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener(EVENT, notify) }
}

const ThemeContext = createContext<{ preference: ThemePreference; setTheme: (value: ThemePreference) => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(subscribe, getSnapshot, () => 'system' as ThemePreference)
  const setTheme = useCallback((value: ThemePreference) => {
    memoryPreference = normalizeTheme(value)
    try { localStorage.setItem(THEME_STORAGE_KEY, memoryPreference); storageUnavailable = false }
    catch { storageUnavailable = true }
    document.documentElement.dataset.theme = resolveTheme(memoryPreference, window.matchMedia('(prefers-color-scheme: dark)').matches)
    window.dispatchEvent(new Event(EVENT))
  }, [])
  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => { document.documentElement.dataset.theme = resolveTheme(getSnapshot(), media.matches) }
    apply()
    media.addEventListener('change', apply)
    window.addEventListener('storage', apply)
    window.addEventListener(EVENT, apply)
    return () => { media.removeEventListener('change', apply); window.removeEventListener('storage', apply); window.removeEventListener(EVENT, apply) }
  }, [])
  const value = useMemo(() => ({ preference, setTheme }), [preference, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function subscribeSystem(notify: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}

export function ThemeSwitcher() {
  const context = useContext(ThemeContext)
  const { t } = useLanguage()
  const systemDark = useSyncExternalStore(subscribeSystem, () => window.matchMedia('(prefers-color-scheme: dark)').matches, () => false)
  if (!context) throw new Error('ThemeProvider is required')
  const { preference, setTheme } = context
  const dark = resolveTheme(preference, systemDark) === 'dark'
  return <button type="button" role="switch" aria-label={t('Gelap')} aria-checked={dark} title={t('Pilih tema')} onClick={() => setTheme(dark ? 'light' : 'dark')} className="sim-theme-toggle">
    <span className="sim-theme-thumb" aria-hidden="true" />
    <Sun className="sim-theme-sun" aria-hidden="true" />
    <MoonStar className="sim-theme-moon" aria-hidden="true" />
  </button>
}

export function ThemeSystemControl({ showLabel = false }: { showLabel?: boolean }) {
  const context = useContext(ThemeContext)
  const { t } = useLanguage()
  if (!context) throw new Error('ThemeProvider is required')
  return <button type="button" title={t('Ikuti perangkat')} aria-label={t('Ikuti perangkat')} aria-pressed={context.preference === 'system'} onClick={() => context.setTheme('system')} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-simantri-200 bg-white px-3 text-xs font-semibold text-simantri-800 dark:border-[var(--theme-line)] dark:bg-[var(--theme-surface)] dark:text-[var(--theme-body)]">
    <Monitor className="h-4 w-4" aria-hidden="true" />
    {showLabel && <span>{t('Ikuti perangkat')}</span>}
  </button>
}
