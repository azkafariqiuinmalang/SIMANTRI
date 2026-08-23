'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import Sidebar from '@/components/dashboard/Sidebar'
import {
  Menu,
  PanelLeftOpen,
  PanelLeftClose,
  Loader2,
  Bell,
  Sparkles,
  MapPin,
  Bot,
  Camera,
  TrendingUp,
  FileText,
  BookOpen,
  UserCog,
  LayoutDashboard,
  Activity,
  ClipboardCheck,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Handle responsive default sidebar state on mount & resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024)
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsSidebarOpen(true)
        } else {
          setIsSidebarOpen(false)
        }
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
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
        console.error('Auth check error in dashboard layout:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  // Get current section name for breadcrumb
  const getPageTitle = () => {
    if (pathname.includes('/chat')) return 'AI Asisten Tani (SIMA)'
    if (pathname.includes('/deteksi')) return 'Deteksi Penyakit (YOLOv8)'
    if (pathname.includes('/harga')) return 'Prakiraan Harga Panen'
    if (pathname.includes('/usulan')) return 'Usulan & Koreksi'
    if (pathname.includes('/verifikasi-penyuluh')) return 'Verifikasi Kredensial Penyuluh'
    if (pathname.includes('/market/input')) return 'Input Harga Pasar'
    if (pathname.includes('/tinjau-usulan')) return 'Peninjauan Usulan Petani'
    if (pathname.includes('/sinyal-wilayah')) return 'Sinyal Penyakit Wilayah'
    return 'Dashboard Utama'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF4EE]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A]" />
          <p className="text-xs font-semibold text-[#4A3A32]">
            Memuat Dasbor SIMANTRI...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF4EE] flex">
      {/* Dynamic Role Sidebar (Collapsible Desktop & Mobile Drawer) */}
      <Sidebar
        profile={profile}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        {/* TOP PERSISTENT NAVBAR */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5DFD6] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-[#4A3A32] hover:text-[#C4487A] hover:bg-[#FBF4EE] border border-[#E5DFD6] transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-semibold hidden md:inline">
                {isSidebarOpen ? 'Tutup Menu' : 'Menu'}
              </span>
            </button>

            {/* Mobile / Collapsed Logo Badge */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-white p-1 shadow-sm border border-[#E5DFD6] flex items-center justify-center">
                <Image
                  src="/logo_simantri.png"
                  alt="Logo SIMANTRI"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-serif font-bold text-sm sm:text-base text-[#0E080A]">
                SIMANTRI
              </span>
            </Link>

            {/* Page Title / Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E5DFD6]">
              <span className="text-xs font-semibold text-[#8A8580]">
                Navigasi /
              </span>
              <span className="text-xs font-bold text-[#0E080A]">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard/chat"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C4487A] bg-[#C4487A]/10 hover:bg-[#C4487A]/20 rounded-xl border border-[#C4487A]/25 transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Tanya SIMA</span>
            </Link>

            <Link
              href="/dashboard/profil"
              className="flex items-center gap-2 pl-2 border-l border-[#E5DFD6] group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A1F2B] to-[#C4487A] text-white flex items-center justify-center text-xs font-bold font-serif shadow-sm group-hover:scale-105 transition-transform">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#0E080A] leading-tight truncate max-w-[120px]">
                  {profile?.full_name || 'Petani'}
                </p>
                <p className="text-[10px] uppercase font-mono text-[#C4487A] font-semibold">
                  {profile?.role || 'petani'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content (with pb-20 on mobile to clear bottom navigation) */}
        <main className="flex-1 flex flex-col pb-20 lg:pb-0 min-h-0">
          {children}
        </main>

        {/* MOBILE FLOATING BOTTOM NAVIGATION BAR (lg:hidden) */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E5DFD6] px-3 py-2 flex items-center justify-around shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.1)] lg:hidden"
          aria-label="Navigasi Bawah Mobile"
        >
          {/* Beranda */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
              pathname === '/dashboard'
                ? 'text-[#C4487A] font-bold scale-105'
                : 'text-[#8A8580] hover:text-[#4A3A32]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Beranda</span>
          </Link>

          {/* Deteksi Penyakit */}
          <Link
            href="/dashboard/deteksi"
            className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
              pathname.startsWith('/dashboard/deteksi')
                ? 'text-[#C4487A] font-bold scale-105'
                : 'text-[#8A8580] hover:text-[#4A3A32]'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Deteksi</span>
          </Link>

          {/* AI Chatbot SIMA (Prominent Center Button) */}
          <Link
            href="/dashboard/chat"
            className={`relative -top-3 flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#4A1F2B] to-[#C4487A] text-white shadow-lg shadow-[#C4487A]/30 transition-transform active:scale-95 ${
              pathname.startsWith('/dashboard/chat') ? 'ring-2 ring-[#C4487A] ring-offset-2' : ''
            }`}
          >
            <Bot className="w-6 h-6" />
            <span className="text-[9px] font-bold tracking-tight mt-0.5">SIMA AI</span>
          </Link>

          {/* Prediksi Harga */}
          <Link
            href="/dashboard/harga"
            className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
              pathname.startsWith('/dashboard/harga')
                ? 'text-[#C4487A] font-bold scale-105'
                : 'text-[#8A8580] hover:text-[#4A3A32]'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Harga</span>
          </Link>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[#8A8580] hover:text-[#4A3A32] active:scale-95"
            aria-label="Buka Semua Menu"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
