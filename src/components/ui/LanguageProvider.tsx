'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'
import { ThemeSwitcher, ThemeSystemControl } from './ThemeProvider'
import { LANGUAGE_STORAGE_KEY, normalizeLanguage, translate, type Language, type TranslationParams } from '@/lib/i18n'

const CHANGE_EVENT = 'simantri-language-change'
let memoryLanguage: Language = 'id'
let storageWriteFailed = false

function getSnapshot(): Language {
  try { return storageWriteFailed ? memoryLanguage : normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY)) }
  catch { return memoryLanguage }
}
function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => { if (!event.key || event.key === LANGUAGE_STORAGE_KEY) notify() }
  window.addEventListener('storage', onStorage)
  window.addEventListener(CHANGE_EVENT, notify)
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(CHANGE_EVENT, notify) }
}

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (source: string, params?: TranslationParams) => string
}
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, () => 'id' as Language)
  const pathname = usePathname()
  const setLanguage = useCallback((next: Language) => {
    memoryLanguage = normalizeLanguage(next)
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, memoryLanguage); storageWriteFailed = false } catch { storageWriteFailed = true /* Session-only preference when storage is unavailable. */ }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])
  const t = useCallback((source: string, params?: TranslationParams) => translate(source, language, params), [language])
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])
  useEffect(() => { document.documentElement.lang = language }, [language])

  return <LanguageContext.Provider value={value}>
    {children}
    {!pathname.startsWith('/dashboard') && !pathname.startsWith('/admin') && (
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 flex items-center gap-2">
        {pathname !== '/dunia-brambang' && <LanguageSwitcher />}
        {!['/', '/privacy', '/terms', '/data-deletion', '/login', '/register'].includes(pathname) && <ThemeSwitcher />}
        <ThemeSystemControl />
      </div>
    )}
    {['/login', '/register'].includes(pathname) && <div className="fixed top-4 right-4 z-50"><ThemeSwitcher /></div>}
  </LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('LanguageProvider is required')
  return context
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage()
  return <label className={`relative inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-simantri-200 dark:border-[var(--theme-green)] bg-white dark:bg-[var(--theme-surface)] px-2.5 text-xs font-semibold text-simantri-800 dark:text-[var(--theme-green)] shadow-sm ${compact ? 'max-sm:h-11 max-sm:w-11 max-sm:justify-center' : ''}`}>
    <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
    <span className="sr-only">{t('Pilih bahasa')}</span>
    <select aria-label={t('Pilih bahasa')} value={language} onChange={(event) => setLanguage(normalizeLanguage(event.target.value))} className={`min-h-11 max-w-[130px] cursor-pointer bg-transparent pr-1 text-xs font-semibold ${compact ? 'max-sm:absolute max-sm:inset-0 max-sm:w-full max-sm:opacity-0' : ''}`}>
      <option value="id" lang="id">Indonesia</option>
      <option value="jv" lang="jv">Basa Jawa</option>
    </select>
  </label>
}
