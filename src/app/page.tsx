'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Bot,
  ChevronRight,
  CloudSun,
  Leaf,
  LineChart,
  Microscope,
  ShieldCheck,
  Users,
  Menu,
  X,
  LogIn,
  UserPlus,
  TrendingUp,
} from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'

const navItems = [
  { label: 'Masalah', href: '#masalah' },
  { label: 'Solusi', href: '#solusi' },
  { label: 'Cara Kerja', href: '#siklus' },
  { label: 'Untuk Siapa', href: '#siapa' },
  { label: 'Dunia Brambang', href: '/dunia-brambang' },
]

const pressures = [
  {
    number: '01',
    title: 'Harga bergerak lebih cepat daripada keputusan petani',
    copy:
      'Petani sering menjual berdasarkan kabar pasar hari itu, padahal perubahan harga bisa dipengaruhi tren historis, cuaca, dan momentum panen raya.',
  },
  {
    number: '02',
    title: 'Penyakit tanaman sulit dibaca pada fase awal',
    copy:
      'Gejala Fusarium, Antraknosa, dan bercak daun membutuhkan respons cepat. Keterlambatan beberapa hari dapat mengubah biaya perawatan.',
  },
  {
    number: '03',
    title: 'Pengetahuan lokal belum terdokumentasi rapi',
    copy:
      'Pengalaman petani senior, pola musim, varietas, dan praktik tanam turun-temurun perlu ruang digital agar tidak hilang bersama waktu.',
  },
]

const features = [
  {
    tag: 'Market Intelligence',
    title: 'Prakiraan Harga Cerdas',
    copy:
      'Estimasi harga bawang merah 1-7 hari ke depan berbasis model XGBoost, dilengkapi riwayat pasar dan sinyal cuaca agar keputusan jual lebih tenang.',
    icon: LineChart,
    href: '/dashboard/harga',
    cta: 'Lihat modul harga',
  },
  {
    tag: 'Computer Vision',
    title: 'Deteksi Dini Penyakit',
    copy:
      'Diagnosis visual untuk membantu membaca gejala utama tanaman bawang merah, dengan skor keyakinan dan arahan tindak lanjut yang mudah dipahami.',
    icon: Microscope,
    href: '/login',
    cta: 'Masuk untuk uji diagnosis',
  },
  {
    tag: 'Knowledge Base',
    title: 'Dunia Brambang',
    copy:
      'Pameran digital yang merangkum identitas Kota Brambang, varietas unggulan, fase tanam, dan memori lisan petani Nganjuk.',
    icon: BookOpen,
    href: '/dunia-brambang',
    cta: 'Masuk pameran',
  },
  {
    tag: 'Trusted Ecosystem',
    title: 'Akses Aman Berbasis Peran',
    copy:
      'Alur admin, penyuluh, dan petani dipisahkan dengan autentikasi dan kontrol akses sehingga data pertanian tetap terlindungi.',
    icon: ShieldCheck,
    href: '/login',
    cta: 'Buka portal',
  },
]

const cycleSteps = [
  ['01', 'Persiapan', 'Jenis tanah, varietas bibit, dan pola lahan dibaca sebagai konteks awal.'],
  ['02', 'Tanam', 'Fase musim membantu petani memilih waktu tanam yang lebih masuk akal.'],
  ['03', 'Rawat', 'Gejala penyakit, OPT, dan rekomendasi SOP dipantau sepanjang pertumbuhan.'],
  ['04', 'Panen', 'Risiko cuaca dan umur tanaman disandingkan dengan kondisi lapangan.'],
  ['05', 'Jual', 'Prediksi harga membantu menentukan kapan hasil panen sebaiknya dilepas.'],
]

const audiences = [
  {
    label: 'Petani',
    title: 'Keputusan harian yang lebih jelas',
    copy:
      'Membaca harga, penyakit, fase tanam, dan pengetahuan budidaya dalam bahasa yang dekat dengan kebutuhan lapangan.',
  },
  {
    label: 'Penyuluh',
    title: 'Basis edukasi yang lebih konsisten',
    copy:
      'Materi penyuluhan dapat disandarkan pada pengetahuan terkurasi, bukti lapangan, dan konteks tiap kecamatan.',
  },
  {
    label: 'Admin',
    title: 'Tata kelola data yang rapi',
    copy:
      'Input harga, moderasi pengetahuan, dan validasi konten bergerak dalam alur kerja yang terukur.',
  },
]

function BrandMark({
  compact = false,
  whiteBg = false,
}: {
  compact?: boolean
  whiteBg?: boolean
}) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 ${
        whiteBg
          ? 'bg-white p-1.5 shadow-sm border border-white/80'
          : ''
      } ${compact ? 'h-10 w-10' : 'h-14 w-14'}`}
    >
      <Image
        src="/logo_simantri.png"
        alt="Logo SIMANTRI"
        width={compact ? 40 : 56}
        height={compact ? 40 : 56}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  )
}


function HeroBulb() {
  return (
    <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center justify-center p-2 sm:p-4">
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.3)_0%,rgba(230,161,92,0.18)_40%,transparent_70%)] blur-3xl animate-pulse pointer-events-none" />

      {/* Main Logo Container with 3D Tilt & Frosted Glass Frame */}
      <div className="relative z-10 flex w-full max-w-[300px] sm:max-w-[380px] items-center justify-center py-4 animate-sim-float">
        <TiltCard max={24} className="w-full flex items-center justify-center">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-black/30 backdrop-blur-xl border border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.55)] group hover:border-[#F472B6]/60 transition-all duration-300">
            <Image
              src="/logo_simantri.png"
              alt="Logo Resmi SIMANTRI"
              width={375}
              height={375}
              className="h-auto w-full max-w-[240px] sm:max-w-[310px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
              priority
            />
          </div>
        </TiltCard>
      </div>

      {/* Badge MAPE: Sleek glassmorphic card */}
      <div className="absolute -right-2 top-2 sm:top-4 hidden sm:block rounded-2xl border border-white/25 bg-[#1A0C11]/85 backdrop-blur-xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-[0_20px_40px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F472B6]/40 hover:shadow-2xl z-20">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#E5DFD6]/80">MAPE Historis</p>
        <p className="font-serif text-xl sm:text-2xl font-bold text-[#F9A8D4] drop-shadow-sm">~3.0%</p>
      </div>

      {/* Field Signal Indicator: Sleek integrated status card */}
      <div className="mt-3 sm:mt-4 w-full rounded-2xl border border-white/20 bg-[#1A0C11]/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F472B6]/40 hover:shadow-2xl z-20">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0 rounded-full bg-[#4ADE80]">
            <span className="absolute inset-0 rounded-full border-2 border-[#4ADE80] animate-sim-pulse" />
          </span>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#FFFDF8]">Harga hari ini terpantau stabil</p>
            <p className="text-[11px] sm:text-xs text-[#E5DFD6]/80">Tersambung langsung ke pasar & cuaca Nganjuk.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll position for dynamic glassmorphism blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileDrawerOpen])

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F6ECDF] text-[#241812]">
      {/* STICKY HEADER WITH DYNAMIC BLUR ON SCROLL */}
      <header
        className={`landing-glass-header ${scrolled ? 'is-scrolled' : 'is-at-top'}`}
      >
        <nav className="mx-auto flex h-[68px] sm:h-[76px] max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* LOGO & BRAND */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="SIMANTRI beranda"
          >
            <BrandMark compact whiteBg={!scrolled} />
            <div>
              <span className={`block font-serif text-lg sm:text-xl font-bold leading-none tracking-tight transition-colors duration-300 ${
                scrolled ? 'text-[#241812] group-hover:text-[#A6304F]' : 'text-white drop-shadow-sm group-hover:text-[#F9A8D4]'
              }`}>
                SIMAN<em className={scrolled ? 'text-[#A6304F]' : 'text-[#F9A8D4]'}>TRI</em>
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                scrolled ? 'text-[#6b5b52]' : 'text-[#F6ECDF]/80'
              }`}>
                Bawang Merah Nganjuk
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={scrolled ? 'nav-link-pill' : 'nav-link-pill-hero'}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP & TABLET ACTION BUTTONS */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                scrolled
                  ? 'text-[#241812]/80 hover:bg-[#A6304F]/10 hover:text-[#A6304F]'
                  : 'text-white/90 hover:bg-white/15 hover:text-white hover:shadow-sm'
              }`}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className={`group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 ${
                scrolled
                  ? 'bg-[#241812] text-[#F6ECDF] shadow-[0_14px_28px_-18px_rgba(36,24,18,0.85)] hover:bg-[#A6304F] hover:shadow-[0_20px_36px_-18px_rgba(166,48,79,0.8)]'
                  : 'bg-gradient-to-r from-[#C4487A] to-[#A6304F] text-white shadow-[0_10px_24px_rgba(196,72,122,0.5)] hover:shadow-[0_14px_30px_rgba(244,114,182,0.7)] border border-white/20'
              }`}
            >
              Daftar
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/login"
              className={`sm:hidden text-xs font-semibold px-3 py-1.5 rounded-full border ${
                scrolled
                  ? 'text-[#A6304F] border-[#A6304F]/30 bg-[#A6304F]/10'
                  : 'text-white border-white/30 bg-white/15 backdrop-blur-sm'
              }`}
            >
              Masuk
            </Link>
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className={`p-2 rounded-xl transition-all active:scale-95 border ${
                scrolled
                  ? 'text-[#241812] hover:text-[#A6304F] hover:bg-[#A6304F]/10 border-[#241812]/15'
                  : 'text-white hover:bg-white/15 border-white/25 backdrop-blur-sm'
              }`}
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER SIDEBAR (Slide-in Drawer) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
        />

        {/* Drawer Content */}
        <aside
          className={`absolute top-0 right-0 h-full w-[85vw] max-w-[340px] bg-[#241812] text-[#F6ECDF] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            mobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow flex items-center justify-center">
                <Image
                  src="/logo_simantri.png"
                  alt="Logo SIMANTRI"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-white leading-tight">
                  SIMAN<em className="text-[#E6A15C]">TRI</em>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                  Kab. Nganjuk
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#E6A15C] font-semibold">
              Menu Eksplorasi
            </p>

            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </Link>
            ))}

            <div className="pt-4 pb-2">
              <div className="h-px bg-white/10" />
            </div>

            <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#E6A15C] font-semibold">
              Fitur Cerdas
            </p>

            <Link
              href="/dashboard/harga"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-white/80 hover:bg-white/10 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-[#E6A15C]" />
              <span>Prediksi Harga Panen</span>
            </Link>
            <Link
              href="/dashboard/chat"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-white/80 hover:bg-white/10 transition-colors"
            >
              <Bot className="w-4 h-4 text-[#F9A8D4]" />
              <span>AI Asisten Petani SIMA</span>
            </Link>
            <Link
              href="/dunia-brambang"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-white/80 hover:bg-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#86EFAC]" />
              <span>Pameran Dunia Brambang</span>
            </Link>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-black/25 space-y-2.5">
            <Link
              href="/login"
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold text-white transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 text-[#E6A15C]" />
              <span>Masuk Portal</span>
            </Link>

            <Link
              href="/register"
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#A6304F] hover:bg-[#C4487A] text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Akun Baru</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* MAIN CONTENT */}
      <main>
        {/* HERO SECTION WITH SAWAH VIDEO BACKGROUND */}
        <section className="relative px-4 sm:px-8 py-16 sm:py-24 lg:py-32 overflow-hidden min-h-[660px] lg:min-h-[740px] flex items-center justify-center -mt-[68px] sm:-mt-[76px] pt-[88px] sm:pt-[106px]">
          {/* 1. Background Video */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover object-center scale-105 filter brightness-[0.78] contrast-[1.08] saturate-[1.15]"
            >
              <source src="/video_landing_page.mp4" type="video/mp4" />
            </video>

            {/* 2. Multi-layer Vignette & Editorial Atmosphere Overlays */}
            {/* Primary Dark Warm Gradient Overlay for Maximum Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#12070A]/95 via-[#1A0C11]/82 to-[#12070A]/60" />
            
            {/* Organic Ambient Glow in Shallot Pink & Warm Amber */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,72,122,0.3)_0%,rgba(230,161,92,0.15)_40%,transparent_70%)]" />

            {/* Fine Grid Texture for Modern Agritech Feel */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(100deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_34px)] opacity-70" />

            {/* Seamless Top Vignette */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

            {/* Seamless Bottom Fade Transition directly into Masalah Section */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#FFFDF8] via-[#FFFDF8]/35 to-transparent" />
          </div>

          {/* 3. Hero Content Foreground */}
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 sm:gap-14 lg:grid-cols-[1.14fr_0.86fr]">
            <div className="text-center lg:text-left">
              {/* Editorial Title with High Contrast Drop Shadows */}
              <h1 className="max-w-4xl font-serif text-3xl sm:text-5xl lg:text-7xl font-semibold leading-[1.14] sm:leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
                Bawang merah Nganjuk, dijaga oleh{' '}
                <em className="font-medium italic text-[#F9A8D4] drop-shadow-[0_2px_15px_rgba(244,114,182,0.3)]">
                  pengetahuan petaninya sendiri.
                </em>
              </h1>

              {/* Subtitle with Shadow & High Legibility */}
              <p className="mt-5 sm:mt-7 max-w-2xl text-sm sm:text-lg leading-relaxed sm:leading-8 text-[#F6ECDF]/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] font-sans mx-auto lg:mx-0">
                SIMANTRI adalah teman pintar untuk petani bawang merah Nganjuk yang belajar langsung dari wawancara petani berpengalaman, bukan dari internet umum. Bertanya kapan waktu tanam, pantau harga pasar, deteksi penyakit dari foto, dan kenalkan bawang merah pada generasi muda.
              </p>

              {/* CTA Action Buttons with Glassmorphic Elegance */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#C4487A] via-[#A6304F] to-[#8C2442] px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-white shadow-[0_14px_32px_-6px_rgba(196,72,122,0.8)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_40px_-6px_rgba(244,114,182,0.9)] active:scale-95 border border-white/20"
                >
                  <span>Mulai Gunakan SIMANTRI</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dunia-brambang"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-black/35 px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-[#FFFDF8] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/20 hover:border-[#F9A8D4]/60 hover:text-white active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  <BookOpen className="h-4 w-4 text-[#F9A8D4]" />
                  <span>Jelajah Dunia Brambang</span>
                </Link>
              </div>
            </div>

            {/* HERO VISUAL WITH TILT & GLOW */}
            <div className="mt-6 lg:mt-0">
              <HeroBulb />
            </div>
          </div>
        </section>

        {/* MASALAH SECTION */}
        <section id="masalah" className="border-t border-[#241812]/10 bg-[#FFFDF8] px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                Tiga tekanan utama yang dihadapi petani bawang merah Nganjuk hari ini.
              </h2>
            </div>

            <div className="mt-10 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pressures.map((item) => (
                <article
                  key={item.number}
                  className="simantri-card-hover group relative rounded-2xl sm:rounded-3xl border border-[#241812]/10 bg-[#F6ECDF]/65 p-6 sm:p-8 backdrop-blur-sm"
                >
                  <span className="font-mono text-xs font-bold text-[#A6304F] tracking-widest">{item.number}</span>
                  <h3 className="mt-4 font-serif text-xl sm:text-2xl font-semibold leading-snug text-[#241812] group-hover:text-[#A6304F] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed sm:leading-7 text-[#6b5b52]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUSI SECTION */}
        <section id="solusi" className="border-t border-[#241812]/10 bg-[#F6ECDF] px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                Empat pilar solusi yang bekerja terintegrasi.
              </h2>
            </div>

            <div className="mt-10 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="simantri-feature-card-hover group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#241812]/10 bg-[#FFFDF8] p-6 sm:p-7 shadow-sm"
                  >
                    <div>
                      <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E2340]">
                        {feature.tag}
                      </span>
                      <div
                        className={`mt-4 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl text-[#FFFDF8] shadow-md transition-all duration-400 group-hover:scale-115 group-hover:rotate-3 ${
                          index === 0
                            ? 'bg-[#A6304F] group-hover:bg-[#8C2E56]'
                            : index === 1
                            ? 'bg-[#D89B3C] group-hover:bg-[#B07A2C]'
                            : index === 2
                            ? 'bg-[#56724A] group-hover:bg-[#3D5A34]'
                            : 'bg-[#241812] group-hover:bg-[#3D261A]'
                        }`}
                      >
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <h3 className="mt-5 font-serif text-xl sm:text-2xl font-semibold text-[#241812] group-hover:text-[#A6304F] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed sm:leading-7 text-[#6b5b52]">
                        {feature.copy}
                      </p>
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#A6304F] transition-all duration-300 group-hover:text-[#7E2340] group-hover:translate-x-1">
                      {feature.cta}
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* SIKLUS BUDIDAYA SECTION */}
        <section id="siklus" className="bg-[#FFFDF8] px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                Dari persiapan lahan sampai keputusan jual panen.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#6b5b52] leading-relaxed">
                Alur pendampingan SIMANTRI terstruktur di setiap fase siklus pertanian bawang merah Nganjuk.
              </p>
            </div>

            {/* MOBILE & TABLET VERTICAL TIMELINE ALUR (< lg) */}
            <div className="mt-10 relative lg:hidden">
              {/* Continuous Vertical Connecting Line */}
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#A6304F] via-[#D89B3C] to-[#56724A] opacity-40" />

              <div className="space-y-6">
                {cycleSteps.map(([number, title, copy], idx) => (
                  <div key={number} className="relative flex items-start gap-4 sm:gap-6 group">
                    {/* Step Number Circle Indicator (Sitting on timeline line) */}
                    <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-[#A6304F]/30 bg-white font-serif text-base font-bold text-[#A6304F] shadow-md transition-all duration-300 group-hover:scale-115 group-hover:bg-[#A6304F] group-hover:text-white group-hover:border-[#A6304F] group-hover:shadow-lg">
                      {number}
                    </div>

                    {/* Step Content Card */}
                    <div className="simantri-timeline-card-hover flex-1 rounded-2xl border border-[#241812]/10 bg-[#F6ECDF]/60 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#7E2340]">
                          Fase {number}
                        </span>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/70 text-[#241812]/60 border border-[#241812]/5">
                          Langkah {idx + 1} dari 5
                        </span>
                      </div>
                      <h3 className="mt-1 font-serif text-lg font-bold text-[#241812] group-hover:text-[#A6304F] transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#6b5b52]">
                        {copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP HORIZONTAL PROCESS GRID (>= lg) */}
            <div className="relative mt-16 hidden lg:grid lg:grid-cols-5 gap-6">
              <div className="absolute left-[5%] right-[5%] top-7 hidden border-t-2 border-dashed border-[#241812]/20 lg:block pointer-events-none" />
              {cycleSteps.map(([number, title, copy]) => (
                <article
                  key={number}
                  className="simantri-step-card-hover group relative rounded-2xl border border-[#241812]/10 bg-[#F6ECDF]/50 p-6 backdrop-blur-sm shadow-sm"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#241812]/15 bg-[#FFFDF8] font-serif text-lg font-bold text-[#A6304F] transition-all duration-300 group-hover:scale-115 group-hover:bg-[#A6304F] group-hover:text-[#FFFDF8] group-hover:border-[#A6304F] shadow-sm">
                    {number}
                  </div>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#7E2340] font-semibold">
                    Fase
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold group-hover:text-[#A6304F] transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#6b5b52]">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* UNTUK SIAPA SECTION */}
        <section id="siapa" className="bg-[#F6ECDF] px-4 sm:px-8 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                Dibuat untuk ekosistem, bukan hanya satu jenis pengguna.
              </h2>
            </div>

            <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {audiences.map((audience, index) => (
                <article
                  key={audience.label}
                  className={`simantri-persona-card-hover group relative min-h-[260px] sm:min-h-[300px] rounded-3xl p-6 sm:p-8 text-[#FFFDF8] overflow-hidden shadow-md ${
                    index === 0
                      ? 'bg-[linear-gradient(155deg,#8a2b48,#241812_120%)]'
                      : index === 1
                      ? 'bg-[linear-gradient(155deg,#56724A,#241812_120%)]'
                      : 'bg-[linear-gradient(155deg,#b07a2c,#241812_120%)]'
                  }`}
                >
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 rounded-full bg-white/10 blur-2xl group-hover:scale-150 group-hover:opacity-80 transition-all duration-500 pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#FFFDF8]/90 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors">
                      {audience.label}
                    </span>
                    <div className="transition-transform duration-400 group-hover:scale-125 group-hover:rotate-12">
                      {index === 0 ? (
                        <Leaf className="h-6 w-6 text-[#FBF4EE]" />
                      ) : index === 1 ? (
                        <Users className="h-6 w-6 text-[#FBF4EE]" />
                      ) : (
                        <Bot className="h-6 w-6 text-[#FBF4EE]" />
                      )}
                    </div>
                  </div>
                  <h3 className="mt-12 sm:mt-16 font-serif text-xl sm:text-2xl font-semibold leading-tight relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">
                    {audience.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed sm:leading-7 text-[#FFFDF8]/80 relative z-10">
                    {audience.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE & CTA BANNER */}
        <section className="relative overflow-hidden bg-[#241812] px-4 sm:px-8 py-20 sm:py-28 text-center text-[#F6ECDF]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,72,122,0.2)_0%,transparent_70%)] pointer-events-none" />
          <CloudSun className="mx-auto mb-6 h-10 w-10 sm:h-12 sm:w-12 text-[#D89B3C] animate-pulse" />
          <p className="mx-auto max-w-4xl font-serif text-2xl sm:text-4xl lg:text-5xl font-medium italic leading-snug">
            &ldquo;Teknologi terbaik bukan yang menggantikan manusia, tetapi yang menjaga warisannya.&rdquo;
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10">
            <Link
              href="/dunia-brambang"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#A6304F] px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-[#FFFDF8] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#7E2340] active:scale-95"
            >
              Masuk Dunia Brambang
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F6ECDF]/25 px-7 py-3.5 sm:px-8 sm:py-4 text-sm font-semibold text-[#F6ECDF] transition-all duration-300 hover:bg-[#F6ECDF]/10 active:scale-95"
            >
              Masuk Portal Pengguna
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1b120d] px-4 sm:px-8 py-10 sm:py-14 text-[#F6ECDF]/70 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            {/* BRAND LOGO WITH WHITE BACKGROUND CONTAINER */}
            <Link
              href="/"
              className="group flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 w-fit"
              aria-label="SIMANTRI beranda"
            >
              <BrandMark compact whiteBg />
              <div>
                <span className="block font-serif text-xl font-bold text-[#F6ECDF] group-hover:text-[#E6A15C] transition-colors leading-tight">
                  SIMAN<em className="text-[#E6A15C]">TRI</em>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#F6ECDF]/50 block">
                  Bawang Merah Nganjuk
                </span>
              </div>
            </Link>

            {/* INTERACTIVE NAV PILLS WITH HOVER/TOUCH LIKE NAVBAR */}
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 rounded-full font-medium text-[#F6ECDF]/80 border border-white/10 bg-white/5 transition-all duration-300 hover:text-white hover:bg-[#A6304F] hover:border-[#A6304F] hover:scale-105 active:scale-95 hover:shadow-lg shadow-black/30"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="max-w-xl font-mono text-[11px] sm:text-xs leading-relaxed text-[#F6ECDF]/60">
              SIMANTRI - Sistem Manajemen Tani Bawang Merah Nganjuk. Dibangun di atas pengetahuan nyata petani, data yang terkurasi, dan akses yang lebih terpercaya.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#F6ECDF]/75">
              <Link href="/privacy" className="hover:text-[#E6A15C] transition-colors">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#E6A15C] transition-colors">
                Syarat & Ketentuan
              </Link>
              <span>•</span>
              <Link href="/data-deletion" className="hover:text-[#E6A15C] transition-colors">
                Penghapusan Data
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
