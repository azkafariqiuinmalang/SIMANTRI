'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import Sidebar from '@/components/dashboard/Sidebar'
import { ThemeSwitcher } from '@/components/ui/ThemeProvider'
import { LanguageSwitcher } from '@/components/ui/LanguageProvider'
import FloatingAssistant, { openSimaAssistant } from '@/components/dashboard/FloatingAssistant'
import {
  Menu,
  Loader2,
  Calendar,
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const today = new Date()
    setFormattedDate(
      today.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    )
  }, [])

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data: prof, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!error && prof) {
          setProfile(prof as Profile)
        }
      } catch (err) {
        console.error('Auth check error in admin layout:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const getPageTitle = () => {
    if (pathname.includes('/market/input')) return 'Input & Sinkronisasi Harga Harian'
    if (pathname.includes('/verifikasi-penyuluh')) return 'Verifikasi Kredensial Penyuluh'
    return 'Pusat Operasional & Integritas SIMANTRI'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8F6] dark:bg-[var(--theme-canvas)] font-jakarta">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-simantri-600 dark:text-[var(--theme-green)]" />
          <p className="text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)]">
            Memuat Portal Admin SIMANTRI...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[var(--theme-canvas)] font-jakarta flex overflow-x-clip text-slate-800 dark:text-[var(--theme-ink)]">
      {/* Dynamic Role Sidebar */}
      <Sidebar
        profile={profile}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((open) => !open)}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/85 dark:bg-[var(--theme-surface)]/85 backdrop-blur-xl border-b border-slate-100 dark:border-[var(--theme-line)] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-[var(--theme-line)] text-slate-700 dark:text-[var(--theme-body)] hover:bg-slate-50 dark:hover:bg-[var(--theme-canvas)] lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Brand */}
            <Link href="/admin" className="flex items-center gap-2 lg:hidden">
              <Image
                src="/logo_simantri.png"
                alt="SIMANTRI"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
                priority
              />
              <span className="font-extrabold text-sm tracking-tight text-simantri-700 dark:text-[var(--theme-green)] min-[380px]:block">
                ADMIN
              </span>
            </Link>

            {/* Breadcrumb Title (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[var(--theme-muted)]">
              <span className="text-slate-400 dark:text-[var(--theme-muted)]">Admin Portal</span>
              <span>&gt;</span>
              <span className="text-simantri-700 dark:text-[var(--theme-green)] font-bold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Right Status Badges & Profile */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <ThemeSwitcher />
            <div className="hidden 2xl:inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-[var(--theme-body)]">
              <Calendar className="w-3.5 h-3.5 text-simantri-600 dark:text-[var(--theme-green)]" />
              <span>{formattedDate || 'Selasa, 24 Oktober'}</span>
            </div>


            <Link
              href="/dashboard/profil"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[var(--theme-raised)] transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-simantri-700 text-xs font-bold text-white shadow-xs">
                {profile?.full_name?.charAt(0).toUpperCase() || 'A'}
              </span>
              <span className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-[var(--theme-ink)] leading-tight">
                  {profile?.full_name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-[var(--theme-muted)]">Dinas Pertanian</span>
              </span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 pb-16">
          {children}
        </main>

        <FloatingAssistant />
      </div>
    </div>
  )
}
