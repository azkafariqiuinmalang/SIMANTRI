'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import Sidebar from '@/components/dashboard/Sidebar'
import FloatingAssistant, { openSimaAssistant } from '@/components/dashboard/FloatingAssistant'
import {
  Menu,
  Loader2,
  Camera,
  TrendingUp,
  LayoutDashboard,
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
        console.error('Auth check error in admin layout:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const getPageTitle = () => {
    if (pathname.includes('/market/input')) return 'Input Harga Pasar (PIHPS)'
    if (pathname.includes('/verifikasi-penyuluh')) return 'Verifikasi Kredensial Penyuluh'
    return 'Panel Admin SIMANTRI'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF4EE]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A]" />
          <p className="text-xs font-semibold text-[#4A3A32]">
            Memuat Panel Admin SIMANTRI...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF4EE] flex">
      {/* Dynamic Role Sidebar */}
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
                Admin /
              </span>
              <span className="text-xs font-bold text-[#0E080A]">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => openSimaAssistant()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C4487A] bg-[#C4487A]/10 hover:bg-[#C4487A]/20 rounded-xl border border-[#C4487A]/25 transition-colors shadow-sm cursor-pointer active:scale-95"
              title="Buka Asisten SIMA"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src="/logo_sima.png"
                  alt="SIMA"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Tanya SIMA</span>
            </button>

            <Link
              href="/dashboard/profil"
              className="flex items-center gap-2 pl-2 border-l border-[#E5DFD6] group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A1F2B] to-[#C4487A] text-white flex items-center justify-center text-xs font-bold font-serif shadow-sm group-hover:scale-105 transition-transform">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#0E080A] leading-tight truncate max-w-[120px]">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-[10px] uppercase font-mono text-[#C4487A] font-semibold">
                  {profile?.role || 'admin'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col pb-20 lg:pb-0 min-h-0">
          {children}
        </main>

        {/* GLOBAL FLOATING SIMA ASSISTANT PANEL */}
        <FloatingAssistant />

        {/* MOBILE FLOATING BOTTOM NAVIGATION BAR */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E5DFD6] px-3 py-2 flex items-center justify-around shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.1)] lg:hidden"
          aria-label="Navigasi Bawah Mobile"
        >
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

          <Link
            href="/dashboard/chat"
            className={`relative -top-3 flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#4A1F2B] to-[#C4487A] text-white shadow-lg shadow-[#C4487A]/30 transition-transform active:scale-95 p-1 ${
              pathname.startsWith('/dashboard/chat') ? 'ring-2 ring-[#C4487A] ring-offset-2' : ''
            }`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white/20 p-0.5">
              <Image
                src="/logo_sima.png"
                alt="SIMA"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] font-bold tracking-tight mt-0.5">SIMA</span>
          </Link>

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
