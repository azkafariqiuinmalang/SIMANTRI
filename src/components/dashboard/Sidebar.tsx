'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  LayoutDashboard,
  Bot,
  Camera,
  TrendingUp,
  BookOpen,
  FileText,
  UserCog,
  LogOut,
  X,
  UserCheck,
  ClipboardCheck,
  BadgeDollarSign,
  Activity,
  MapPin,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface SidebarProps {
  profile: Profile | null
  isOpen: boolean
  onToggle?: () => void
  onClose: () => void
}

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

type NavGroup = {
  title: string
  items: NavItem[]
}

export default function Sidebar({ profile, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const role = profile?.role || 'petani'

  // Navigation Groups based on Role
  const navGroups: NavGroup[] = [
    {
      title: 'Smart Farming',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Asisten (SIMA)', href: '/dashboard/chat', icon: Bot },
        { label: 'Deteksi Penyakit', href: '/dashboard/deteksi', icon: Camera },
        { label: 'Prediksi Harga', href: '/dashboard/harga', icon: TrendingUp },
      ],
    },
    {
      title: 'Knowledge & Edukasi',
      items: [
        { label: 'Dunia Brambang', href: '/dunia-brambang', icon: BookOpen },
        { label: 'Usulan Pengetahuan', href: '/dashboard/usulan', icon: FileText },
        ...(role === 'penyuluh'
          ? [{ label: 'Sinyal Wilayah', href: '/dashboard/sinyal-wilayah', icon: Activity }]
          : []),
        ...(role === 'admin'
          ? [
              { label: 'Verifikasi Penyuluh', href: '/admin/verifikasi-penyuluh', icon: UserCheck },
              { label: 'Tinjau Usulan', href: '/dashboard/tinjau-usulan', icon: ClipboardCheck },
              { label: 'Input Harga Pasar', href: '/admin/market/input', icon: BadgeDollarSign },
            ]
          : []),
      ],
    },
    {
      title: 'Pengaturan',
      items: [{ label: 'Kelola Profil', href: '/dashboard/profil', icon: UserCog }],
    },
  ]

  useEffect(() => {
    if (!isOpen || window.innerWidth >= 1024) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isItemActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const content = (
    <div className="flex h-full w-[270px] max-w-[85vw] flex-col justify-between bg-white text-slate-800 shadow-[0_1px_8px_rgba(20,40,28,0.06)] border-r border-slate-100 font-jakarta">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-50">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
            <div className="h-10 w-10 relative flex items-center justify-center">
              <Image
                src="/logo_simantri.png"
                alt="Logo SIMANTRI"
                width={40}
                height={40}
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-simantri-700 leading-tight">
                SIMANTRI
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Sistem Bawang Merah
              </span>
            </div>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="px-3 py-4 flex flex-col gap-4" aria-label="Navigasi utama">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isItemActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          active
                            ? 'bg-simantri-500 text-white shadow-sm shadow-simantri-500/25'
                            : 'text-slate-600 hover:bg-simantri-50/70 hover:text-simantri-700'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Mini Bar & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-slate-200/80 shadow-xs">
          <Link
            href="/dashboard/profil"
            onClick={onClose}
            className="flex items-center gap-2.5 overflow-hidden min-w-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-simantri-700 text-xs font-bold text-white shadow-xs">
              {profile?.full_name?.charAt(0).toUpperCase() || 'P'}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">
                {profile?.full_name || 'Petani Bawang'}
              </span>
              <span className="text-[10px] text-slate-500 truncate capitalize">
                {profile?.role === 'penyuluh'
                  ? 'PPL Nganjuk'
                  : profile?.role === 'admin'
                  ? 'Administrator'
                  : 'Petani Bawang Merah'}
              </span>
              <span className="text-[10px] text-simantri-700 flex items-center gap-1 truncate font-medium">
                <MapPin className="w-2.5 h-2.5" />
                {profile?.village || 'Sukomoro, Nganjuk'}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            title="Keluar dari akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) onClose()
        }}
        role="presentation"
      >
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className={`h-dvh transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {content}
        </aside>
      </div>

      <aside className="sticky top-0 hidden h-dvh w-[270px] shrink-0 border-r border-slate-100 bg-white lg:block">
        {content}
      </aside>
    </>
  )
}
