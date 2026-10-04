'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
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

export function ThemeSwitcher() {
  const context = useContext(ThemeContext)
  const { t } = useLanguage()
  if (!context) throw new Error('ThemeProvider is required')
  const { preference, setTheme } = context
  const Icon = preference === 'dark' ? Moon : preference === 'light' ? Sun : Monitor
  return <label title={t('Pilih tema')} className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-simantri-200 dark:border-[var(--theme-green)] bg-white dark:bg-[var(--theme-surface)] text-simantri-800 dark:text-[var(--theme-green)] shadow-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-simantri-400">
    <Icon className="h-4 w-4" aria-hidden="true" />
    <span className="sr-only">{t('Pilih tema')}</span>
    <select aria-label={t('Pilih tema')} value={preference} onChange={(event) => setTheme(normalizeTheme(event.target.value))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
      <option value="light">{t('Terang')}</option>
      <option value="dark">{t('Gelap')}</option>
      <option value="system">{t('Ikuti perangkat')}</option>
    </select>
  </label>
}
