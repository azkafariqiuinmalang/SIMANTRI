'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  LayoutDashboard,
  Bot,
  Camera,
  TrendingUp,
  FileText,
  BookOpen,
  UserCog,
  LogOut,
  Menu,
  X,
  Sparkles,
  Activity,
  ClipboardCheck,
  BadgeDollarSign,
  MapPin,
  PanelLeftClose,
  ChevronLeft,
  UserCheck,
  BadgeCheck,
  Clock,
} from 'lucide-react'

interface SidebarProps {
  profile: Profile | null
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export default function Sidebar({ profile, isOpen, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const role = profile?.role || 'petani'

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Define menu items by actor
  const getMenuItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Dashboard Admin', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Verifikasi Penyuluh', href: '/admin/verifikasi-penyuluh', icon: UserCheck, badge: 'Kredensial' },
        { label: 'Tinjau Usulan Petani', href: '/dashboard/tinjau-usulan', icon: ClipboardCheck, badge: 'Admin' },
        { label: 'Input Harga Pasar', href: '/admin/market/input', icon: BadgeDollarSign, badge: 'Harian' },
        { label: 'AI Asisten SIMA', href: '/dashboard/chat', icon: Bot },
        { label: 'Deteksi Penyakit', href: '/dashboard/deteksi', icon: Camera },
        { label: 'Prediksi Harga', href: '/dashboard/harga', icon: TrendingUp },
        { label: 'Dunia Brambang', href: '/dunia-brambang', icon: BookOpen },
        { label: 'Kelola Profil', href: '/dashboard/profil', icon: UserCog },
      ]
    }

    if (role === 'penyuluh') {
      return [
        { label: 'Dashboard Penyuluh', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Sinyal Wilayah', href: '/dashboard/sinyal-wilayah', icon: Activity, badge: 'Signal' },
        { label: 'AI Asisten SIMA', href: '/dashboard/chat', icon: Bot },
        { label: 'Deteksi Penyakit', href: '/dashboard/deteksi', icon: Camera },
        { label: 'Prediksi Harga', href: '/dashboard/harga', icon: TrendingUp },
        { label: 'Usulan & Koreksi', href: '/dashboard/usulan', icon: FileText },
        { label: 'Dunia Brambang', href: '/dunia-brambang', icon: BookOpen },
        { label: 'Kelola Profil', href: '/dashboard/profil', icon: UserCog },
      ]
    }

    // Default: Petani
    return [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'AI Asisten (SIMA)', href: '/dashboard/chat', icon: Bot, badge: 'RAG' },
      { label: 'Deteksi Penyakit', href: '/dashboard/deteksi', icon: Camera, badge: 'YOLOv8' },
      { label: 'Prediksi Harga', href: '/dashboard/harga', icon: TrendingUp, badge: 'XGBoost' },
      { label: 'Usulan Saya', href: '/dashboard/usulan', icon: FileText },
      { label: 'Dunia Brambang', href: '/dunia-brambang', icon: BookOpen },
      { label: 'Kelola Profil', href: '/dashboard/profil', icon: UserCog },
    ]
  }

  const menuItems = getMenuItems()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#4A1F2B] text-white select-none border-r border-[#6B2F3E] w-64">
      {/* BRAND / LOGO WITH CLEAN WHITE CONTAINER */}
      <div className="p-4 border-b border-[#6B2F3E] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
          {/* Pristine White Background Container for Logo */}
          <div className="w-11 h-11 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-white/80">
            <Image
              src="/logo_simantri.png"
              alt="Logo SIMANTRI"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-white tracking-wide block leading-tight">
              SIMANTRI
            </span>
            <span className="text-[10px] font-mono text-[#E6A15C] uppercase tracking-wider block">
              Sistem Bawang Merah
            </span>
          </div>
        </Link>

        {/* Toggle Hamburger / Close button */}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup / Sembunyikan Sidebar"
          aria-label="Sembunyikan Sidebar"
        >
          <PanelLeftClose className="w-5 h-5 text-[#E5DFD6]" />
        </button>
      </div>

      {/* USER ROLE BADGE */}
      <div className="px-4 py-3 bg-black/15 border-b border-[#6B2F3E] space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3A5A40] animate-pulse" />
            <span className="text-xs text-white/80 font-medium">Aktor:</span>
          </div>
          <span
            className={`text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
              role === 'admin'
                ? 'bg-[#C4487A]/25 border-[#C4487A] text-[#F9A8D4]'
                : role === 'penyuluh'
                ? 'bg-[#2A5A70]/30 border-[#38BDF8] text-[#7DD3FC]'
                : 'bg-[#3A5A40]/30 border-[#4ADE80] text-[#86EFAC]'
            }`}
          >
            {role}
          </span>
        </div>

        {role === 'penyuluh' && (
          <div className="pt-0.5">
            {profile?.is_verified_contributor ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#86EFAC] bg-[#3A5A40]/30 px-2 py-0.5 rounded border border-[#4ADE80]/30">
                <BadgeCheck className="w-3 h-3 text-[#4ADE80]" />
                Penyuluh Terverifikasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#FDE047] bg-[#CA8A04]/20 px-2 py-0.5 rounded border border-[#FDE047]/30">
                <Clock className="w-3 h-3" />
                Menunggu Verifikasi KTA
              </span>
            )}
          </div>
        )}
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#C4487A] text-white shadow-md shadow-[#C4487A]/30 translate-x-1'
                  : 'text-[#E5DFD6] hover:text-white hover:bg-white/10 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E6A15C]'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-black/30 text-[#E6A15C] border border-[#E6A15C]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER / USER PROFILE CARD */}
      <div className="p-3.5 border-t border-[#6B2F3E] bg-black/20 space-y-2.5">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4487A] to-[#E6A15C] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {profile?.full_name || 'Pengguna SIMANTRI'}
            </p>
            <p className="text-[10px] text-white/60 truncate flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-[#E6A15C]" />
              {profile?.village || 'Kabupaten Nganjuk'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-[#F9A8D4]" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* MOBILE DRAWER OVERLAY (Slide in / out) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div
          className={`w-64 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {sidebarContent}
        </div>
      </div>

      {/* DESKTOP COLLAPSIBLE SIDEBAR (Smooth slide left/right) */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
