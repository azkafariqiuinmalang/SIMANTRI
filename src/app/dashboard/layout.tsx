'use client'

import { LanguageSwitcher, useLanguage } from '@/components/ui/LanguageProvider'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
  Bot,
  Camera,
  LayoutDashboard,
  Loader2,
  Menu,
  Search,
  TrendingUp,
  UserRound,
  MapPin,
  Calendar,
  Bell,
  Sparkles,
} from 'lucide-react'
import FloatingAssistant, { openSimaAssistant } from '@/components/dashboard/FloatingAssistant'
import Sidebar from '@/components/dashboard/Sidebar'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

const bottomNavigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'SIMA AI', href: '/dashboard/chat', icon: Bot },
  { label: 'Deteksi', href: '/dashboard/deteksi', icon: Camera },
  { label: 'Harga', href: '/dashboard/harga', icon: TrendingUp },
  { label: 'Profil', href: '/dashboard/profil', icon: UserRound },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = new Date()
      setFormattedDate(
        today.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      )
    }, 0)
    return () => window.clearTimeout(timer)
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

        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (currentProfile) setProfile(currentProfile as Profile)
      } catch (error) {
        console.error('Auth check error in dashboard layout:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  useEffect(() => {
    const timer = window.setTimeout(() => closeSidebar(), 0)
    return () => window.clearTimeout(timer)
  }, [closeSidebar, pathname])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openSimaAssistant()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F6F8F6] font-jakarta">
        <div className="flex flex-col items-center gap-3" role="status">
          <Loader2 className="h-8 w-8 animate-spin text-simantri-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">{t("Memuat Sistem SIMANTRI…")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] font-jakarta flex overflow-x-clip text-slate-800">
      <Sidebar
        profile={profile}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((open) => !open)}
        onClose={closeSidebar}
      />

      <div className="min-w-0 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/85 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
              aria-label={t("Buka menu navigasi")}
              aria-expanded={isSidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Brand */}
            <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
              <Image
                src="/logo_simantri.png"
                alt="SIMANTRI"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
                priority
              />
              <span className="hidden min-[430px]:block font-extrabold text-sm tracking-tight text-simantri-700">
                SIMANTRI
              </span>
            </Link>

            {/* Location & Date Pills (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-simantri-600" />
                <span>{formattedDate || t("Selasa, 24 Oktober")}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-simantri-50 text-xs font-bold text-simantri-700 border border-simantri-200/50">
                <MapPin className="w-3.5 h-3.5 text-simantri-600" />
                <span>{t("Nganjuk (Sentra Bawang Merah)")}</span>
              </div>
            </div>
          </div>

          {/* Center Search Bar (SIMA Assistant trigger) */}
          <div className="hidden 2xl:flex min-w-0 flex-1 max-w-md mx-6">
            <button
              type="button"
              onClick={() => openSimaAssistant()}
              className="w-full h-10 px-4 rounded-full border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-simantri-300 text-left text-xs text-slate-400 flex items-center justify-between transition-all group shadow-xs cursor-pointer"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-simantri-600" />
                <span className="truncate">{t("Cari panduan, hama, atau tanya SIMA…")}</span>
              </div>
              <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-500">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & User Avatar */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <Link
              href="/dashboard/chat"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-simantri-50 hover:bg-simantri-100 text-xs font-bold text-simantri-700 border border-simantri-200/60 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-simantri-600" />
              <span>{t("Tanya SIMA")}</span>
            </Link>

            <Link
              href="/dashboard/profil"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-simantri-700 text-xs font-bold text-white shadow-xs">
                {profile?.full_name?.charAt(0).toUpperCase() || t("P")}
              </span>
              <span className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {profile?.full_name?.split(' ')[0] || t("Petani")}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">
                  {profile?.village || 'Nganjuk'}
                </span>
              </span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main id="main-content" lang={['/dashboard/sinyal-wilayah', '/dashboard/tinjau-usulan'].includes(pathname) ? 'id' : undefined} className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10">
          {children}
        </main>

        {pathname !== '/dashboard/chat' && <FloatingAssistant />}

        {/* Mobile Bottom Navigation Bar */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden shadow-lg"
          aria-label={t("Navigasi utama mobile")}
        >
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {bottomNavigation.map((item) => {
              const active =
                item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-all ${
                      active
                        ? 'text-simantri-700 bg-simantri-50/90'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                    <span>{t(item.label)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
