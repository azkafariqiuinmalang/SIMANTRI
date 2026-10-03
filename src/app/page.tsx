'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  LogIn,
  UserPlus,
  Send,
  ShieldCheck,
  Microscope,
  BookOpen,
  Calendar,
  Layers,
  Database,
  Percent,
  Lock,
  ChevronRight,
  PhoneCall,
} from 'lucide-react'

interface SimaScenario {
  user: string
  reply: string
  source: string
  action: string
  target: string
  typing: string
  category: string
}

const SIMA_SCENARIOS: SimaScenario[] = [
  {
    category: 'Penyakit Daun',
    user: 'Daun bawang saya mulai ada bercak lonjong ungu melekuk di blok Sukomoro. Ini gejala apa ya?',
    reply:
      'Berdasarkan pola bercak cekung keunguan dengan cincin konsentris, terindikasi kuat penyakit Trotol (Alternaria porri). Segera perbaiki saluran parit bedengan agar tidak tergenang, dan semprot fungisida berbahan aktif Difenokonazol/Mankozeb saat cuaca teduh sore.',
    source: 'Rujukan: Dunia Brambang — Balai Proteksi Hortikultura',
    action: 'Lihat panduan penanganan trotol',
    target: '/dunia-brambang',
    typing: 'SIMA sedang menganalisis gejala daun & kondisi parit...',
  },
  {
    category: 'Waktu Tanam',
    user: 'Kapan waktu tanam paling tepat untuk varietas Tajuk saat pergantian musim di Nganjuk?',
    reply:
      'Untuk varietas Tajuk di zona Sukomoro-Bagor, jendela optimal pancaroba adalah akhir April hingga pertengahan Mei. Siapkan bedengan setinggi 30-35 cm untuk antisipasi hujan sisa, serta pastikan bibit umbi telah melewati masa simpan ayom minimal 60-70 hari.',
    source: 'Rujukan: Kalender Tanam BPTP Jawa Timur 2024/2025',
    action: 'Pelajari SOP varietas Tajuk',
    target: '/dunia-brambang',
    typing: 'Menghubungkan kalender tanam BMKG Nganjuk & BPTP...',
  },
  {
    category: 'Proyeksi Harga',
    user: 'Bagaimana proyeksi harga bawang merah di Pasar Grosir Sukomoro 3 hari ke depan?',
    reply:
      'Harga rata-rata mutu super hari ini tercatat Rp 28.500/kg (naik +4.2%). Karena pasokan kiriman panen dataran rendah sedang melandai 15%, tren harga diproyeksikan bertahan menguat di kisaran Rp 28.000 - Rp 30.500/kg. Momentum aman untuk lepas panen bertahap.',
    source: 'Rujukan: Data Timbang Pasar Sukomoro & PIHPS',
    action: 'Buka grafik analitik pasar',
    target: '/login',
    typing: 'Menghitung agregasi data lelang Pasar Grosir Sukomoro...',
  },
]

const CAROUSEL_CARDS = [
  {
    id: 'tugu-bawang',
    title: 'Tugu Bawang Nganjuk',
    subtitle: 'Simbol kejayaan bawang merah nasional',
    tag: 'Ikon Sentra Agraria',
    badge: 'Nganjuk Sentra',
    badgeBg: 'bg-[#173E2D]/90 text-[#b8efc9]',
    tagBg: 'bg-[#DDE8D8] text-[#002819]',
    img: '/bg_tugu_bawang.jpg',
  },
  {
    id: 'varietas-tajuk',
    title: 'Varietas Tajuk',
    subtitle: 'Aroma tajam, umbi padat & tahan simpan',
    tag: 'Hasil Panen Unggul',
    badge: 'Khas Nganjuk',
    badgeBg: 'bg-[#EAC6D2]/90 text-[#6b1434]',
    tagBg: 'bg-[#b8efc9] text-[#002110]',
    img: '/varietas_tajuk.jpg',
  },
  {
    id: 'petani-merah',
    title: 'Petani Bawang Merah',
    subtitle: 'Dedikasi pemeliharaan parit & tanah subur',
    tag: 'Sukomoro & Bagor',
    badge: 'Rawat Bedengan',
    badgeBg: 'bg-[#173E2D]/90 text-[#b8efc9]',
    tagBg: 'bg-[#DDE8D8] text-[#002819]',
    img: '/petani_bawang_merah.jpg',
  },
  {
    id: 'varietas-bauji',
    title: 'Varietas Bauji',
    subtitle: 'Favorit pasar lelang konsumsi & industri',
    tag: 'Karakter Umbi Padat',
    badge: 'Bibit Pilihan',
    badgeBg: 'bg-[#f1eae0] text-[#173e2d]',
    tagBg: 'bg-[#EAC6D2] text-[#6b1434]',
    img: '/varietas_bauji.jpg',
  },
  {
    id: 'deteksi-penyakit',
    title: 'Deteksi Penyakit',
    subtitle: 'Diagnostik dini Alternaria porri (Trotol)',
    tag: 'Gejala Bercak Ungu',
    badge: 'Scan Citra AI',
    badgeBg: 'bg-[#173E2D]/90 text-[#b8efc9]',
    tagBg: 'bg-[#EAC6D2] text-[#6b1434]',
    img: '/penyakit_bercak_ungu.jpg',
    hasScanner: true,
  },
  {
    id: 'jayastamba',
    title: 'Jayastamba Nganjuk',
    subtitle: 'Prasasti kemenangan & tanah subur merdeka',
    tag: 'Bumi Anjuk Ladang',
    badge: 'Anjuk Ladang',
    badgeBg: 'bg-[#DDE8D8] text-[#002819]',
    tagBg: 'bg-[#b8efc9] text-[#002110]',
    img: '/jayastamba.jpg',
  },
  {
    id: 'panen-petani',
    title: 'Panen Petani',
    subtitle: 'Senyum keberhasilan panen melimpah',
    tag: 'Kualitas Terverifikasi',
    badge: '60-70 HST',
    badgeBg: 'bg-[#DDE8D8] text-[#002819]',
    tagBg: 'bg-[#b5ecc6] text-[#3a6d4e]',
    img: '/foto_bawang_merah.jpg',
  },
]

const LANDING_NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', href: '#beranda' },
  { id: 'masalah', label: 'Masalah', href: '#masalah' },
  { id: 'solusi-section', label: 'Solusi', href: '#solusi-section' },
  { id: 'cara-kerja', label: 'Cara Kerja', href: '#cara-kerja' },
  { id: 'untuk-siapa', label: 'Untuk Siapa', href: '#untuk-siapa' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('beranda')
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 })
  const navContainerRef = useRef<HTMLElement | null>(null)
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const isClickScrollingRef = useRef(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // SIMA Interactive Widget States
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(2) // Default: Proyeksi Harga
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [displayedData, setDisplayedData] = useState(SIMA_SCENARIOS[2])
  const [userCustomQuery, setUserCustomQuery] = useState<string | null>(null)
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)

  // Update sliding indicator pill position with perfect autolayout alignment
  const updateIndicatorPosition = (sectionId: string) => {
    const currentEl = navItemRefs.current[sectionId]
    const containerEl = navContainerRef.current
    if (currentEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect()
      const itemRect = currentEl.getBoundingClientRect()
      setIndicatorStyle({
        left: itemRect.left - containerRect.left,
        top: itemRect.top - containerRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      })
    }
  }

  useEffect(() => {
    updateIndicatorPosition(activeSection)
  }, [activeSection])

  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition(activeSection)
    }
    window.addEventListener('resize', handleResize)
    const timer = setTimeout(() => updateIndicatorPosition(activeSection), 150)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [activeSection])

  // Scrollspy to automatically update active nav item on scroll (Landing Page sections only)
  useEffect(() => {
    const sectionIds = ['beranda', 'masalah', 'solusi-section', 'cara-kerja', 'untuk-siapa']

    let frame = 0
    const handleScroll = () => {
      if (isClickScrollingRef.current) return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // When near top
      if (scrollY < 180) {
        setActiveSection('beranda')
        return
      }

      // When near bottom of page
      if (scrollY + windowHeight >= documentHeight - 60) {
        setActiveSection('untuk-siapa')
        return
      }

      const offset = 140
      let currentActive = 'beranda'

      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i]
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollY - offset
          if (scrollY >= elementTop - 50) {
            currentActive = id
          }
        }
      }

      setActiveSection(currentActive)
    }

    const scheduleScroll = () => { if (!frame) frame = window.requestAnimationFrame(() => { frame = 0; handleScroll() }) }
    window.addEventListener('scroll', scheduleScroll, { passive: true })
    handleScroll()

    return () => { window.removeEventListener('scroll', scheduleScroll); window.cancelAnimationFrame(frame) }
  }, [])

  // Smooth scroll handler for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    e.preventDefault()
    setActiveSection(id)
    isClickScrollingRef.current = true
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
    }, 800)

    const targetEl = document.getElementById(id)
    if (targetEl) {
      const navbarHeight = 86
      const elementPosition = targetEl.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight
      window.scrollTo({
        top: id === 'beranda' ? 0 : Math.max(0, offsetPosition),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
      window.history.pushState(null, '', href)
    }
    setMobileMenuOpen(false)
  }

  // Reveal only the major heading/content groups once, with an accessible fallback.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const groups = Array.from(document.querySelectorAll<HTMLElement>('main > section > div > .text-center'))
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.remove('sim-reveal-pending')
        entry.target.classList.add('sim-reveal-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12 })
    groups.forEach((group) => { group.classList.add('sim-reveal-pending'); observer.observe(group) })
    const revealAll = () => groups.forEach((group) => group.classList.remove('sim-reveal-pending'))
    media.addEventListener('change', revealAll)
    return () => { observer.disconnect(); revealAll(); media.removeEventListener('change', revealAll) }
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); trigger?.focus() }
  }, [mobileMenuOpen])

  // Trigger scenario switch
  const selectScenario = (idx: number, isManual = false) => {
    if (isManual && autoRotateRef.current) {
      clearInterval(autoRotateRef.current)
      autoRotateRef.current = null
    }

    const scenario = SIMA_SCENARIOS[idx]
    if (!scenario) return

    setActiveScenarioIdx(idx)
    setUserCustomQuery(null)
    setIsTyping(true)
    setTypingText(scenario.typing)

    setTimeout(() => {
      setDisplayedData(scenario)
      setIsTyping(false)
    }, 550)
  }

  // Handle custom user submission in SIMA demo
  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = customInput.trim()
    if (!q) return

    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current)
      autoRotateRef.current = null
    }

    setActiveScenarioIdx(-1)
    setUserCustomQuery(q)
    setCustomInput('')
    setIsTyping(true)
    setTypingText('SIMA menghubungkan pertanyaan dengan basis agronomi lokal Nganjuk...')

    setTimeout(() => {
      setDisplayedData({
        category: 'Konsultasi Mandiri',
        user: q,
        reply: `Mengenai pertanyaan Anda: "${q}", tim agronomi merekomendasikan verifikasi lapangan langsung ke PPL desa atau membuka ensiklopedia varietas kami untuk panduan teknis langkah per langkah.`,
        source: 'Rujukan: Telemetri Lapangan SIMA Nganjuk & PPL Kecamatan',
        action: 'Konsultasi mendalam di Dunia Brambang',
        target: '/dunia-brambang',
        typing: '',
      })
      setIsTyping(false)
    }, 650)
  }

  // Auto-rotate demo scenarios
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    autoRotateRef.current = setInterval(() => {
      setActiveScenarioIdx((prev) => {
        const next = (prev + 1) % SIMA_SCENARIOS.length
        const s = SIMA_SCENARIOS[next]
        setIsTyping(true)
        setTypingText(s.typing)
        setTimeout(() => {
          setDisplayedData(s)
          setIsTyping(false)
        }, 550)
        return next
      })
    }, 8500)

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current)
    }
  }, [])

  return (
    <div className="bg-[#FAF7F2] text-[#1A221D] font-manrope antialiased min-h-screen selection:bg-[#b5ecc6] selection:text-[#002110]">
      {/* TOP FLOATING CAPSULE NAVIGATION */}
      <header className="fixed top-4 xl:top-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-6xl mx-auto h-16 bg-white/90 backdrop-blur-md border border-[#173e2d]/10 rounded-full px-3 sm:px-6 shadow-[0_8px_30px_rgba(20,35,28,0.06)] flex items-center justify-between pointer-events-auto transition-all duration-300 hover:border-[#173e2d]/25 hover:shadow-[0_12px_35px_rgba(20,35,28,0.1)]">
          {/* Brand - Official SIMANTRI Logo */}
          <Link
            href="#beranda"
            onClick={(e) => handleNavClick(e, 'beranda', '#beranda')}
            className="flex shrink-0 items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173e2d] focus-visible:ring-offset-2 rounded-full sm:pr-2"
          >
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-[#173e2d]/5 group-hover:bg-[#173e2d]/10 transition-colors duration-200 p-1">
              <Image
                src="/UIUX BARU/logo_simantri.png"
                alt="Logo SIMANTRI"
                width={36}
                height={36}
                className="object-contain drop-shadow-xs"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-[20px] font-semibold text-[#173e2d] tracking-tight leading-none group-hover:text-[#275a3d] transition-colors duration-200">
                SIMANTRI
              </span>
              <span className="text-[9.5px] font-mono uppercase text-[#5E665F] tracking-wider mt-0.5 hidden sm:inline">
                Nganjuk Agro Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with Sliding Indicator */}
          <div className="hidden xl:flex items-center gap-1">
            <nav
              ref={navContainerRef}
              role="navigation"
              aria-label="Navigasi Utama"
              className="relative flex items-center p-1 rounded-full"
            >
              {/* Sliding Active Pill Background Indicator with Perfect Centering */}
              <div
                aria-hidden="true"
                className="absolute rounded-full bg-[#173e2d]/10 pointer-events-none transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
                  width: `${indicatorStyle.width}px`,
                  height: `${indicatorStyle.height}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {LANDING_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <a
                    key={item.id}
                    ref={(el) => {
                      navItemRefs.current[item.id] = el
                    }}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id, item.href)}
                    className={`relative z-10 inline-flex items-center justify-center h-8 px-3.5 text-[13.5px] font-manrope rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173e2d] focus-visible:ring-offset-1 select-none leading-none ${
                      isActive
                        ? 'text-[#002819] font-bold'
                        : 'text-[#5E665F] hover:text-[#1A221D] hover:bg-[#173e2d]/5 font-medium'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="translate-y-[-0.5px]">{item.label}</span>
                  </a>
                )
              })}
            </nav>

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-[#173e2d]/15 mx-1" aria-hidden="true" />

            {/* Dedicated Dunia Brambang Link (Navigates directly to /dunia-brambang page) */}
            <Link
              href="/dunia-brambang"
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 text-[13.5px] font-manrope font-semibold text-[#5E665F] hover:text-[#6b1434] hover:bg-[#EAC6D2]/50 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1434] focus-visible:ring-offset-1 leading-none select-none"
            >
              <span className="translate-y-[-0.5px]">Dunia Brambang</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E25C58] animate-pulse"></span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center text-[14px] font-semibold text-[#5E665F] hover:text-[#173e2d] hover:bg-[#173e2d]/8 px-2 sm:px-4 py-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173e2d] focus-visible:ring-offset-1 transition-colors duration-200"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center bg-[#173e2d] text-[#F8F4EC] text-[13.5px] font-semibold px-3 sm:px-5 py-2 rounded-full hover:bg-[#275a3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173e2d] focus-visible:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              Daftar
            </Link>
            
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="xl:hidden p-2 rounded-full text-[#173e2d] hover:bg-[#173e2d]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173e2d] transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {(
          <div inert={!mobileMenuOpen} aria-hidden={!mobileMenuOpen} style={{ opacity: mobileMenuOpen ? 1 : 0, visibility: mobileMenuOpen ? 'visible' : 'hidden', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-8px)', transition: `opacity 220ms ease-out, transform 220ms ease-out, visibility 0s ${mobileMenuOpen ? '0s' : '220ms'}` }} className="absolute left-4 right-4 top-full xl:hidden max-w-6xl mx-auto mt-2 bg-white/95 backdrop-blur-md border border-[#173e2d]/10 rounded-2xl p-4 shadow-xl pointer-events-auto">
            <nav className="flex flex-col gap-1.5 text-[14px]" role="navigation" aria-label="Navigasi Mobile">
              {LANDING_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <a
                    key={`mobile-${item.id}`}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id, item.href)}
                    className={`px-4 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-between ${
                      isActive
                        ? 'bg-[#173e2d]/10 font-bold text-[#002819]'
                        : 'text-[#5E665F] hover:text-[#002819] hover:bg-[#FAF7F2]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#173e2d]"></span>}
                  </a>
                )
              })}

              <Link
                href="/dunia-brambang"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-[#EAC6D2]/30 text-[#173e2d] font-semibold flex items-center justify-between transition-colors duration-200"
              >
                <span>Dunia Brambang (Pustaka Agronomi)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#EAC6D2] text-[#6b1434]">
                  Khas Nganjuk
                </span>
              </Link>

              <div className="pt-2 mt-1 border-t border-[#173e2d]/10 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2.5 rounded-full border border-[#173e2d]/20 text-[#173e2d] hover:bg-[#173e2d]/5 font-semibold text-[13px] transition-colors"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 rounded-full bg-[#173e2d] hover:bg-[#275a3d] text-white font-semibold text-[13px] transition-colors"
                >
                  Daftar Petani
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN BODY WRAPPER */}
      <main className="w-full pt-20 sm:pt-24 bg-[#FAF7F2]">
        {/* HERO SECTION WITH INFINITE MOVING CAROUSEL */}
        <section id="beranda" className="relative w-full pt-10 sm:pt-14 pb-14 sm:pb-20 overflow-hidden scroll-mt-24">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[360px] bg-gradient-to-b from-[#EFE8DC]/90 via-transparent to-transparent pointer-events-none -z-10 rounded-full blur-3xl"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
            {/* Top Right Annotation (Doodle Arrow & Note) */}
            <div
              className="hidden md:flex absolute right-4 lg:right-10 flex-col items-center rotate-6 pointer-events-none select-none z-20"
              style={{ top: '-18px' }}
            >
              <span className="font-handwriting text-[23px] text-[#275a3d] font-bold tracking-wide">
                Kawal Panen Anda!
              </span>
              <svg
                className="w-10 h-10 text-[#275a3d] -mt-1 translate-x-3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 48 48"
              >
                <path d="M12 8 C 22 18, 30 22, 28 36"></path>
                <path d="M20 34 L 28 38 L 32 30"></path>
              </svg>
            </div>

            {/* Top Left Annotation Lines */}
            <div className="hidden md:block absolute top-6 left-8 lg:left-14 pointer-events-none select-none">
              <svg
                className="w-8 h-8 text-[#8B918B]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 14 L9 6"></path>
                <path d="M12 18 L16 11"></path>
              </svg>
            </div>

            {/* Main Headline */}
            <h1 className="font-editorial text-[38px] sm:text-[54px] lg:text-[68px] leading-[1.08] text-[#1A221D] tracking-tight max-w-4xl mx-auto mb-4 sm:mb-5 font-semibold">
              Pertanian Bawang Merah yang Lebih Cerdas,{' '}
              <br className="hidden sm:inline" />
              dari Lahan hingga{' '}
              <span className="italic font-normal text-[#275a3d]">
                Keputusan Jual.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-[16px] sm:text-[18px] text-[#5E665F] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
              SIMANTRI mendampingi petani Nganjuk membaca dinamika pasar, mendeteksi ancaman penyakit sejak dini, dan mengakses pustaka budidaya terpadu.
            </p>
          </div>

          {/* INFINITE MOVING CAROUSEL TRACK (Right to Left, Pause on Hover with Prominent Card Zoom) */}
          <div className="carousel-container relative w-full overflow-hidden py-12 sm:py-14 select-none -my-6">
            {/* Side gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-20 pointer-events-none"></div>

            <div className="carousel-track items-center py-4">
              {/* SET 1: 7 CARDS */}
              <div className="flex items-center gap-5 sm:gap-6 pr-5 sm:pr-6">
                {CAROUSEL_CARDS.map((card, idx) => (
                  <div
                    key={`card-set1-${idx}`}
                    className="carousel-card w-52 sm:w-60 lg:w-64 h-76 sm:h-88 lg:h-[410px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md group cursor-pointer shrink-0 bg-[#f1eae0] border border-white/70"
                  >
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="carousel-card-img object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002819]/90 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-[#002819]/95 group-hover:via-black/15 pointer-events-none"></div>

                    {/* Scanner overlay if card is detection */}
                    {card.hasScanner && (
                      <div className="absolute inset-5 border border-white/30 rounded-xl pointer-events-none flex items-center justify-center group-hover:border-[#b8efc9]/60 transition-colors">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-[#b8efc9] absolute top-2 left-2 group-hover:scale-[1.02] transition-transform"></div>
                        <div className="w-4 h-4 border-t-2 border-r-2 border-[#b8efc9] absolute top-2 right-2 group-hover:scale-[1.02] transition-transform"></div>
                        <div className="w-4 h-4 border-b-2 border-l-2 border-[#b8efc9] absolute bottom-2 left-2 group-hover:scale-[1.02] transition-transform"></div>
                        <div className="w-4 h-4 border-b-2 border-r-2 border-[#b8efc9] absolute bottom-2 right-2 group-hover:scale-[1.02] transition-transform"></div>
                      </div>
                    )}

                    {/* Top Tag */}
                    <div className="absolute top-3.5 left-3.5 pointer-events-none">
                      <span
                        className={`inline-flex items-center text-[10.5px] font-mono uppercase px-2.5 py-1 rounded-full font-bold shadow-xs transition-transform duration-300 group-hover:scale-[1.02] ${card.badgeBg}`}
                      >
                        {card.badge}
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-4 left-4 right-4 text-left transition-transform duration-300 group-hover:translate-y-[-2px] pointer-events-none">
                      <span
                        className={`inline-block text-[10.5px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold mb-1.5 shadow-xs ${card.tagBg}`}
                      >
                        {card.tag}
                      </span>
                      <h4 className="text-white text-[16px] sm:text-[17px] font-editorial font-semibold leading-snug drop-shadow-sm group-hover:text-[#b8efc9] transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-white/85 text-[11.5px] mt-0.5 line-clamp-1 font-normal">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* DUPLICATE SET FOR SEAMLESS 100% INFINITE LOOP */}
              <div aria-hidden="true" className="flex items-center gap-5 sm:gap-6 pr-5 sm:pr-6">
                {CAROUSEL_CARDS.map((card, idx) => (
                  <div
                    key={`card-set2-${idx}`}
                    className="carousel-card w-52 sm:w-60 lg:w-64 h-76 sm:h-88 lg:h-[410px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md group cursor-pointer shrink-0 bg-[#f1eae0] border border-white/70"
                  >
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="carousel-card-img object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002819]/90 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-[#002819]/95 group-hover:via-black/15 pointer-events-none"></div>

                    {card.hasScanner && (
                      <div className="absolute inset-5 border border-white/30 rounded-xl pointer-events-none flex items-center justify-center group-hover:border-[#b8efc9]/60 transition-colors">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-[#b8efc9] absolute top-2 left-2 group-hover:scale-[1.02] transition-transform"></div>
                        <div className="w-4 h-4 border-t-2 border-r-2 border-[#b8efc9] absolute top-2 right-2 group-hover:scale-[1.02] transition-transform"></div>
                        <div className="w-4 h-4 border-b-2 border-l-2 border-[#b8efc9] absolute bottom-2 left-2 group-hover:scale-[1.02] transition-transform"></div>
                        <div className="w-4 h-4 border-b-2 border-r-2 border-[#b8efc9] absolute bottom-2 right-2 group-hover:scale-[1.02] transition-transform"></div>
                      </div>
                    )}

                    <div className="absolute top-3.5 left-3.5 pointer-events-none">
                      <span
                        className={`inline-flex items-center text-[10.5px] font-mono uppercase px-2.5 py-1 rounded-full font-bold shadow-xs transition-transform duration-300 group-hover:scale-[1.02] ${card.badgeBg}`}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-left transition-transform duration-300 group-hover:translate-y-[-2px] pointer-events-none">
                      <span
                        className={`inline-block text-[10.5px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold mb-1.5 shadow-xs ${card.tagBg}`}
                      >
                        {card.tag}
                      </span>
                      <h4 className="text-white text-[16px] sm:text-[17px] font-editorial font-semibold leading-snug drop-shadow-sm group-hover:text-[#b8efc9] transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-white/85 text-[11.5px] mt-0.5 line-clamp-1 font-normal">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FLOATING CTA WITH HANDWRITTEN ANNOTATION */}
          <div className="relative max-w-md mx-auto mt-6 sm:mt-8 flex flex-col items-center justify-center">
            <Link
              href="/register"
              className="relative inline-flex items-center justify-center bg-[#E25C58] hover:bg-[#d04b47] text-white font-semibold text-[15px] sm:text-[16px] px-9 py-3.5 sm:py-4 rounded-full shadow-lg shadow-[#E25C58]/25 hover:shadow-2xl hover:shadow-[#E25C58]/40 hover:-translate-y-px active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              Mulai Gunakan SIMANTRI
            </Link>

            {/* Hand-drawn Annotation below CTA */}
            <div className="flex items-center gap-2 mt-2.5 text-[#5E665F] select-none">
              <svg
                className="w-7 h-7 text-[#275a3d] -rotate-12"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 32 32"
              >
                <path d="M24 6 C 18 10, 10 16, 12 24"></path>
                <path d="M8 20 L 12 26 L 18 22"></path>
              </svg>
              <span className="font-handwriting text-[20px] text-[#173e2d] font-bold">
                Akses Terbuka & Gratis Petani
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: TENTANG SIMANTRI (EDITORIAL SPLIT) */}
        <section className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#F7F2EA] border-t border-[#173e2d]/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Photo Cluster */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 relative">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="rounded-[24px] overflow-hidden shadow-sm h-60 sm:h-76 bg-[#f1eae0] relative hover-card-lift">
                  <Image
                    src="/foto_bawang_merah.jpg"
                    alt="Bawang Merah Nganjuk Berkualitas"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <div className="bg-white p-6 rounded-[24px] shadow-xs flex flex-col justify-between border border-[#173e2d]/10 hover-card-lift hover:bg-[#FAF7F2]">
                  <span className="text-[11px] font-mono uppercase text-[#275a3d] font-bold tracking-widest">
                    Wilayah Sentra
                  </span>
                  <p className="font-editorial text-[22px] font-semibold text-[#173e2d] mt-2">
                    Sukomoro & Bagor
                  </p>
                  <p className="text-[13px] text-[#5E665F] mt-1 leading-relaxed">
                    Basis penghasil utama varietas Tajuk & Bauji dengan pasokan harian terluas Jawa Timur.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6 pt-6 sm:pt-8">
                <div className="bg-[#173e2d] text-[#F8F4EC] p-6 rounded-[24px] shadow-sm hover-card-lift hover:bg-[#275a3d]">
                  <div className="flex items-center gap-2 mb-2 text-[#b8efc9]">
                    <Sparkles size={18} />
                    <span className="text-[13px] font-semibold">Sains Berbasis Lahan</span>
                  </div>
                  <p className="text-[13px] text-[#81a993] leading-relaxed">
                    Menggabungkan catatan empiris puluhan tahun dengan model algoritma analisis prediktif.
                  </p>
                </div>
                <div className="rounded-[24px] overflow-hidden shadow-sm h-60 sm:h-76 bg-[#f1eae0] relative hover-card-lift">
                  <Image
                    src="/bg_tugu_bawang.jpg"
                    alt="Lahan Sentra Nganjuk"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Narrative */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[11.5px] font-mono uppercase text-[#275a3d] tracking-[0.2em] font-bold mb-3">
                Tentang Platform
              </span>
              <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight mb-6 leading-tight">
                Dari Nganjuk, untuk keputusan tani yang lebih terukur.
              </h2>
              <div className="space-y-4 text-[15px] sm:text-[16px] text-[#5E665F] leading-relaxed">
                <p>
                  Bawang merah adalah urat nadi perekonomian Nganjuk. Namun, fluktuasi harga yang tajam dan ancaman serangan hama sering kali memaksa petani mengambil keputusan panen dalam posisi tertekan tanpa pegangan data yang jelas.
                </p>
                <p>
                  SIMANTRI dirancang bukan sekadar alat pencatat angka di atas layar. Ini adalah ruang temu antara data historis pasar yang objektif, analisis agronomi presisi, dan kearifan lokal yang telah diuji musim demi musim oleh petani Nganjuk.
                </p>
              </div>
              <div className="pt-8 flex items-center gap-4">
                <a
                  href="#solusi-section"
                  className="hover-btn-scale inline-flex items-center gap-2 text-[14px] font-semibold bg-[#173e2d]/10 hover:bg-[#173e2d] text-[#173e2d] hover:text-white px-6 py-3 rounded-full border border-[#173e2d]/15 hover:border-transparent group shadow-xs"
                >
                  <span>Pelajari arsitektur solusi SIMANTRI</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: MASALAH UTAMA */}
        <section id="masalah" className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#FAF7F2] scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
              <div className="lg:col-span-7">
                <span className="text-[11.5px] font-mono uppercase text-[#6b1434] tracking-[0.2em] font-bold mb-2 block">
                  Kerentanan Musiman
                </span>
                <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight leading-tight">
                  Tiga tantangan utama yang dihadapi petani bawang merah Nganjuk.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-[15px] text-[#5E665F] leading-relaxed">
                  Ketergantungan pada kabar lisan dan lambatnya respon terhadap tanda-tanda kerusakan tanaman berdampak langsung pada margin pendapatan rumah tangga petani.
                </p>
              </div>
            </div>

            {/* Problem Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Problem 1 */}
              <div className="hover-card-lift bg-[#F7F2EA] hover:bg-white rounded-[24px] p-7 flex flex-col justify-between shadow-xs border border-[#173e2d]/10 hover:border-[#173e2d]/25">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-editorial text-[24px] font-bold text-[#275a3d]">01</span>
                    <div className="w-10 h-10 rounded-full bg-[#EAC6D2]/50 flex items-center justify-center text-[#ba1a1a] transition-transform duration-300 group-hover:scale-[1.02]">
                      <TrendingDown size={20} />
                    </div>
                  </div>
                  <h3 className="font-editorial text-[20px] font-semibold text-[#1A221D] mb-3 leading-snug">
                    Harga bergerak lebih cepat daripada keputusan panen.
                  </h3>
                  <p className="text-[13.5px] text-[#5E665F] leading-relaxed">
                    Petani seringkali melepas panen pada harga terendah akibat ketiadaan proyeksi tren harga riil harian di pasar grosir Sukomoro dan sentra regional sekitarnya.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#173e2d]/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  <span className="text-[12px] font-medium text-[#414844]">Risiko kerugian margin hingga 35%</span>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="hover-card-lift bg-[#F7F2EA] hover:bg-white rounded-[24px] p-7 flex flex-col justify-between shadow-xs border border-[#173e2d]/10 hover:border-[#173e2d]/25">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-editorial text-[24px] font-bold text-[#275a3d]">02</span>
                    <div className="w-10 h-10 rounded-full bg-[#EAC6D2]/50 flex items-center justify-center text-[#ba1a1a] transition-transform duration-300 group-hover:scale-[1.02]">
                      <Microscope size={20} />
                    </div>
                  </div>
                  <h3 className="font-editorial text-[20px] font-semibold text-[#1A221D] mb-3 leading-snug">
                    Penyakit daun terlambat diidentifikasi pada fase awal.
                  </h3>
                  <p className="text-[13.5px] text-[#5E665F] leading-relaxed">
                    Gejala awal layu Fusarium (Moler) dan Trotol (Alternaria) kerap disalahartikan sebagai kekurangan air, memicu pengobatan keliru yang mempercepat pembusukan umbi.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#173e2d]/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  <span className="text-[12px] font-medium text-[#414844]">Penyebaran patogen spora dalam 72 jam</span>
                </div>
              </div>

              {/* Problem 3 */}
              <div className="hover-card-lift bg-[#F7F2EA] hover:bg-white rounded-[24px] p-7 flex flex-col justify-between shadow-xs border border-[#173e2d]/10 hover:border-[#173e2d]/25">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-editorial text-[24px] font-bold text-[#275a3d]">03</span>
                    <div className="w-10 h-10 rounded-full bg-[#DDE8D8] flex items-center justify-center text-[#275a3d] transition-transform duration-300 group-hover:scale-[1.02]">
                      <BookOpen size={20} />
                    </div>
                  </div>
                  <h3 className="font-editorial text-[20px] font-semibold text-[#1A221D] mb-3 leading-snug">
                    Kearifan lokal agronomi belum terhimpun rapi.
                  </h3>
                  <p className="text-[13.5px] text-[#5E665F] leading-relaxed">
                    Taktik pemupukan spesifik tanah liat berpasir Nganjuk dan penanganan bibit Tajuk tersimpan sporadis pada ingatan petani lansia tanpa transmisi sistematis.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-[#173e2d]/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#36684a]"></span>
                  <span className="text-[12px] font-medium text-[#414844]">Hilangnya panduan adaptasi cuaca ekstrem</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: EMPAT SOLUSI UTAMA */}
        <section id="solusi-section" className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#F7F2EA] border-t border-[#173e2d]/10 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[11.5px] font-mono uppercase text-[#275a3d] tracking-[0.2em] font-bold mb-2 block">
                  Ekosistem Terintegrasi
                </span>
                <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight leading-tight">
                  Semua yang dibutuhkan petani bawang merah.
                </h2>
              </div>
              <p className="text-[15px] text-[#5E665F] mt-3 md:mt-0 max-w-md">
                Empat pilar fungsional yang dirancang khusus untuk memandu setiap tahapan budidaya di tanah Nganjuk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Solution 1 */}
              <div className="hover-card-lift group relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-end p-6 shadow-sm border border-transparent hover:border-[#b8efc9]/40">
                <Image
                  src="/bg_tugu_bawang.jpg"
                  alt="Pasar Sukomoro"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-[420ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002819] via-[#002819]/65 to-transparent"></div>
                <div className="relative z-10 flex flex-col">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#b5ecc6] text-[#002110] text-[11px] font-bold self-start mb-3 shadow-xs">
                    Analitik Pasar
                  </span>
                  <h3 className="font-editorial text-[22px] font-semibold text-white mb-2">
                    Prediksi Harga
                  </h3>
                  <p className="text-[13px] text-[#81a993] mb-4 line-clamp-3 leading-relaxed">
                    Estimasi tren harga pasar 3-7 hari ke depan berbasis data historis transaksi untuk memilih hari lepas panen terbaik.
                  </p>
                  <Link
                    href="/login"
                    className="hover-btn-scale inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#b8efc9] hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 self-start"
                  >
                    <span>Buka Analisis Pasar</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Solution 2 */}
              <div className="hover-card-lift group relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-end p-6 shadow-sm border border-transparent hover:border-[#b8efc9]/40">
                <Image
                  src="/penyakit_bercak_ungu.jpg"
                  alt="Deteksi Penyakit Daun"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-[420ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002819] via-[#002819]/65 to-transparent"></div>
                <div className="relative z-10 flex flex-col">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EAC6D2] text-[#6b1434] text-[11px] font-bold self-start mb-3 shadow-xs">
                    Diagnostik Citra AI
                  </span>
                  <h3 className="font-editorial text-[22px] font-semibold text-white mb-2">
                    Deteksi Penyakit
                  </h3>
                  <p className="text-[13px] text-[#81a993] mb-4 line-clamp-3 leading-relaxed">
                    Identifikasi visual penyakit moler, ulat grayak, dan antraknosa secara transparan dengan skor keyakinan terukur.
                  </p>
                  <Link
                    href="/login"
                    className="hover-btn-scale inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#b8efc9] hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 self-start"
                  >
                    <span>Mulai Deteksi Foto</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Solution 3 */}
              <div className="hover-card-lift group relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-end p-6 shadow-sm border border-transparent hover:border-[#b8efc9]/40">
                <Image
                  src="/petani_bawang_merah.jpg"
                  alt="SIMA Asisten Tani"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-[420ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002819] via-[#002819]/65 to-transparent"></div>
                <div className="relative z-10 flex flex-col">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#c1ecd4] text-[#002114] text-[11px] font-bold self-start mb-3 shadow-xs">
                    Asisten AI Cerdas
                  </span>
                  <h3 className="font-editorial text-[22px] font-semibold text-white mb-2">
                    SIMA (Asisten Tani)
                  </h3>
                  <p className="text-[13px] text-[#81a993] mb-4 line-clamp-3 leading-relaxed">
                    Tanya jawab seputar takaran pupuk NPK, pengendalian jamur saat hujan deras, dan rekomendasi cuaca harian Nganjuk.
                  </p>
                  <a
                    href="#sima-showcase"
                    className="hover-btn-scale inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#b8efc9] hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 self-start"
                  >
                    <span>Konsultasi SIMA</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Solution 4 */}
              <div className="hover-card-lift group relative rounded-[24px] overflow-hidden min-h-[400px] flex flex-col justify-end p-6 shadow-sm border border-transparent hover:border-[#b8efc9]/40">
                <Image
                  src="/varietas_tajuk.jpg"
                  alt="Dunia Brambang"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-[420ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002819] via-[#002819]/65 to-transparent"></div>
                <div className="relative z-10 flex flex-col">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f1eae0] text-[#173e2d] text-[11px] font-bold self-start mb-3 shadow-xs">
                    Pustaka Agronomi
                  </span>
                  <h3 className="font-editorial text-[22px] font-semibold text-white mb-2">
                    Dunia Brambang
                  </h3>
                  <p className="text-[13px] text-[#81a993] mb-4 line-clamp-3 leading-relaxed">
                    Ensiklopedia varietas lokal unggul (Tajuk, Bauji, Trisula), metode simpan bibit tradisional, dan tata kelola tanah.
                  </p>
                  <Link
                    href="/dunia-brambang"
                    className="hover-btn-scale inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#b8efc9] hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 self-start"
                  >
                    <span>Buka Direktori Pustaka</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DEDICATED INTERACTIVE SIMA AI CHAT */}
        <section className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#FAF7F2]" id="sima-showcase">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Context & Overview */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDE8D8] text-[#002819] text-xs font-semibold uppercase tracking-wider self-start mb-4">
                <Sparkles size={14} />
                <span>AI Asisten Tani Nganjuk</span>
              </div>
              <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight mb-5 leading-tight">
                Punya kendala di bedengan? Tanyakan langsung pada SIMA.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#5E665F] leading-relaxed mb-8 font-normal">
                SIMA mendampingi petani Nganjuk membedah penyakit tanaman, rekomendasi pupuk musiman, hingga proyeksi lelang pasar Sukomoro secara real-time lewat bahasa yang akrab dan lugas.
              </p>

              <div className="space-y-4 mb-9">
                <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#F7F2EA] transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#DDE8D8] flex items-center justify-center shrink-0 text-[#173e2d] transition-transform duration-300 hover:scale-[1.02]">
                    <Microscope size={19} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1A221D] leading-tight">Diagnostik Gejala Cepat</p>
                    <p className="text-[12.5px] text-[#5E665F]">Pemisahan akurat antara layu moler vs trotol bercak ungu.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#F7F2EA] transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#DDE8D8] flex items-center justify-center shrink-0 text-[#173e2d] transition-transform duration-300 hover:scale-[1.02]">
                    <Calendar size={19} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1A221D] leading-tight">Kalender Agronomi Nganjuk</p>
                    <p className="text-[12.5px] text-[#5E665F]">Jadwal tanam & dosis pupuk disesuaikan iklim Sukomoro & Bagor.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#F7F2EA] transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#DDE8D8] flex items-center justify-center shrink-0 text-[#173e2d] transition-transform duration-300 hover:scale-[1.02]">
                    <TrendingUp size={19} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1A221D] leading-tight">Pantauan Harga Lelang Sukomoro</p>
                    <p className="text-[12.5px] text-[#5E665F]">Data rujukan timbang harian pasar grosir terbesar se-Jawa Timur.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hover-btn-scale inline-flex items-center gap-2 bg-[#002819] hover:bg-[#275a3d] text-[#F8F4EC] font-semibold text-[14px] px-8 py-3.5 rounded-full shadow-md group"
                >
                  <span>Buka Asisten SIMA Lengkap</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Chat Simulation Widget */}
            <div className="lg:col-span-7">
              <div className="w-full bg-white rounded-[28px] border border-[#173e2d]/10 shadow-[0_16px_36px_-12px_rgba(23,62,45,0.12)] overflow-hidden flex flex-col hover-card-lift">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-[#173e2d]/10 flex items-center justify-between bg-[#FDFBF7]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-[#173E2D] text-[#b8efc9] flex items-center justify-center font-bold shadow-xs transition-transform hover:scale-[1.02]">
                        <Sparkles size={20} />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#36684a] border-2 border-white"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-editorial text-[18px] font-bold text-[#173e2d] leading-none">
                          SIMA Lapangan
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#DDE8D8] text-[#002819]">
                          v2.4 Online
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5E665F] block mt-0.5 font-medium">
                        Agronomi Telemetri • Kec. Sukomoro & Bagor
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDE8D8]/70 border border-[#36684a]/15 text-[11.5px] font-medium text-[#002819]">
                      <span className="w-2 h-2 rounded-full bg-[#36684a] animate-pulse"></span>
                      <span>Live Telemetri</span>
                    </span>
                  </div>
                </div>

                {/* Chat Body */}
                <div className="p-6 space-y-4 bg-[#FAF7F2] min-h-[380px] sm:min-h-[410px] flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    {/* System Welcome Banner */}
                    <div className="bg-[#F7F2EA] border border-[#173e2d]/10 rounded-2xl p-3.5 text-left text-[#5E665F] text-xs flex items-center gap-3">
                      <ShieldCheck size={18} className="text-[#275a3d] shrink-0" />
                      <p className="leading-relaxed">
                        Percakapan interaktif berbasis data lapangan Balitsa & harga lelang pasar grosir Sukomoro hari ini.
                      </p>
                    </div>

                    {/* Farmer / User Bubble */}
                    <div className="flex items-start justify-end gap-3 transition-opacity duration-300">
                      <div className="bg-[#173E2D] text-[#F8F4EC] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-sm text-left">
                        <div className="flex items-center justify-between gap-3 mb-1 text-[11px] text-[#b8efc9]/90 font-medium">
                          <span>{userCustomQuery ? 'Anda (Petani Mandiri)' : 'Pak Sugiono (Sukomoro)'}</span>
                          <span className="text-[10px] font-mono text-[#a6d0b8]">08:48 WIB</span>
                        </div>
                        <p className="text-[13.5px] leading-relaxed">
                          {displayedData.user}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#E9E2D4] border border-[#173e2d]/15 flex items-center justify-center shrink-0 text-[#173e2d] font-bold text-xs shadow-xs">
                        {userCustomQuery ? 'PT' : 'SG'}
                      </div>
                    </div>

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-[#5E665F] text-[12px] pl-3 py-1">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#36684a] sim-typing-dot"></span>
                          <span className="w-2 h-2 rounded-full bg-[#36684a] sim-typing-dot [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 rounded-full bg-[#36684a] sim-typing-dot [animation-delay:0.4s]"></span>
                        </div>
                        <span className="font-medium text-[12px]">{typingText}</span>
                      </div>
                    )}

                    {/* SIMA AI Response Bubble */}
                    {!isTyping && (
                      <div className="flex items-start gap-3 transition-all duration-300">
                        <div className="w-9 h-9 rounded-full bg-[#173E2D] text-[#b8efc9] flex items-center justify-center shrink-0 border border-[#36684a]/20 shadow-xs">
                          <Sparkles size={16} />
                        </div>
                        <div className="bg-white border border-[#173e2d]/10 text-[#173e2d] rounded-2xl rounded-tl-none p-4 max-w-[88%] shadow-sm text-left">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[12.5px] font-bold text-[#002819]">
                              SIMA Agronomi
                            </span>
                            <span className="text-[10px] text-[#8B918B] font-mono">
                              • 08:49 WIB
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#36684a] bg-[#DDE8D8] px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={12} /> RAG Terverifikasi
                            </span>
                          </div>
                          <p className="text-[13.5px] leading-relaxed text-[#1e1b13]">
                            {displayedData.reply}
                          </p>
                          <div className="mt-3 pt-2.5 border-t border-[#173e2d]/10 flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#5E665F]">
                              <BookOpen size={13} className="text-[#36684a]" />
                              <span>{displayedData.source}</span>
                            </span>
                            <Link
                              href={displayedData.target}
                              className="hover-btn-scale inline-flex items-center gap-1 text-[11.5px] font-bold text-[#275a3d] hover:text-[#002819] px-2.5 py-1 rounded-full hover:bg-[#DDE8D8]/50"
                            >
                              <span>{displayedData.action}</span>
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Question Chips */}
                  <div className="pt-3 border-t border-[#173e2d]/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#5E665F] font-bold">
                        Pilih Pertanyaan Cepat:
                      </p>
                      <span className="text-[10px] text-[#8B918B] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                        Klik untuk simulasikan
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIMA_SCENARIOS.map((item, idx) => (
                        <button
                          key={`sima-chip-${idx}`}
                          onClick={() => selectScenario(idx, true)}
                          className={`hover-btn-scale px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                            activeScenarioIdx === idx
                              ? 'bg-[#173E2D] text-[#F8F4EC] shadow-xs hover:bg-[#275a3d]'
                              : 'bg-white hover:bg-[#FAF7F2] text-[#173e2d] border border-[#173e2d]/15 hover:border-[#173e2d]/30'
                          }`}
                        >
                          <span>{item.category === 'Penyakit Daun' ? '🌿' : item.category === 'Waktu Tanam' ? '📅' : '📈'}</span>
                          <span>{item.user.length > 32 ? item.user.slice(0, 32) + '...' : item.user}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Composer Input */}
                <form onSubmit={handleCustomSubmit} className="p-4 bg-white border-t border-[#173e2d]/10 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Tanyakan seputar pupuk, hama, atau harga Sukomoro..."
                      className="w-full bg-[#FAF7F2] border border-[#173e2d]/15 text-[#173e2d] text-sm rounded-full pl-4 pr-11 py-2.5 focus:outline-none focus:border-[#173e2d] focus:bg-white placeholder:text-[#5E665F]/70 transition-all"
                    />
                    <button
                      type="submit"
                      aria-label="Kirim pertanyaan"
                      className="hover-btn-scale absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#173E2D] hover:bg-[#275a3d] text-white flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <Send size={14} className="translate-x-0.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CARA KERJA (MODULAR PROCESS) */}
        <section id="cara-kerja" className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#F7F2EA] border-t border-[#173e2d]/10 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11.5px] font-mono uppercase text-[#275a3d] tracking-[0.2em] font-bold mb-3 block">
                Alur Penerapan
              </span>
              <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight leading-tight">
                Cara kerja SIMANTRI, dari lahan sampai keputusan jual.
              </h2>
              <p className="text-[15px] text-[#5E665F] mt-3">
                Pendampingan terstruktur di setiap fase vegetatif dan generatif tanaman bawang merah Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Step 1 */}
              <div className="hover-card-lift bg-white p-6 rounded-[20px] border border-[#173e2d]/10 hover:border-[#173e2d]/25 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#b5ecc6] text-[#002110] font-editorial text-[20px] font-bold flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                    1
                  </div>
                  <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">Persiapan</h4>
                  <p className="text-[13px] text-[#5E665F] leading-relaxed">
                    Pengecekan kualitas bibit umbi sertifikasi dan kalibrasi pH tanah bedengan Nganjuk.
                  </p>
                </div>
                <span className="text-[11px] font-mono uppercase text-[#275a3d] mt-6 tracking-wider font-semibold">
                  Fase Pra-Tanam
                </span>
              </div>

              {/* Step 2 */}
              <div className="hover-card-lift bg-white p-6 rounded-[20px] border border-[#173e2d]/10 hover:border-[#173e2d]/25 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f1eae0] text-[#173e2d] font-editorial text-[20px] font-bold flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                    2
                  </div>
                  <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">Tanam</h4>
                  <p className="text-[13px] text-[#5E665F] leading-relaxed">
                    Pencatatan tanggal tanam, pola jarak kerapatan (15x15 cm), dan panduan pemupukan dasar.
                  </p>
                </div>
                <span className="text-[11px] font-mono uppercase text-[#275a3d] mt-6 tracking-wider font-semibold">
                  Hari Ke 1-15
                </span>
              </div>

              {/* Step 3 (Highlighted Kritis) */}
              <div className="hover-card-lift bg-[#173E2D] hover:bg-[#275a3d] text-[#F8F4EC] p-6 rounded-[20px] flex flex-col justify-between shadow-md relative">
                <div className="absolute -top-3 right-4 bg-[#b8efc9] text-[#002110] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Kritis
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#36684a] text-white font-editorial text-[20px] font-bold flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                    3
                  </div>
                  <h4 className="font-editorial text-[18px] font-semibold text-white mb-2">Rawat</h4>
                  <p className="text-[13px] text-[#81a993] leading-relaxed">
                    Monitoring gejala hama melalui kamera ponsel dan konsultasi tanggap darurat asisten SIMA.
                  </p>
                </div>
                <span className="text-[11px] font-mono uppercase text-[#b8efc9] mt-6 tracking-wider font-semibold">
                  Hari Ke 16-50
                </span>
              </div>

              {/* Step 4 */}
              <div className="hover-card-lift bg-white p-6 rounded-[20px] border border-[#173e2d]/10 hover:border-[#173e2d]/25 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f1eae0] text-[#173e2d] font-editorial text-[20px] font-bold flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                    4
                  </div>
                  <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">Panen</h4>
                  <p className="text-[13px] text-[#5E665F] leading-relaxed">
                    Penentuan umur panen optimal (60-70 HST) dan metode pengeringan lapangan (ayom).
                  </p>
                </div>
                <span className="text-[11px] font-mono uppercase text-[#275a3d] mt-6 tracking-wider font-semibold">
                  Hari Ke 55-65
                </span>
              </div>

              {/* Step 5 */}
              <div className="hover-card-lift bg-white p-6 rounded-[20px] border border-[#173e2d]/10 hover:border-[#173e2d]/25 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#EAC6D2] text-[#6b1434] font-editorial text-[20px] font-bold flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                    5
                  </div>
                  <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">Jual</h4>
                  <p className="text-[13px] text-[#5E665F] leading-relaxed">
                    Melihat indeks harga regional, negosiasi adil dengan pembeli, dan pencatatan laba bersih.
                  </p>
                </div>
                <span className="text-[11px] font-mono uppercase text-[#275a3d] mt-6 tracking-wider font-semibold">
                  Pascapanen
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PLATFORM SPOTLIGHT DASHBOARD */}
        <section className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Realistic Mock UI Window */}
            <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 shadow-xl border border-[#173e2d]/10 hover-card-lift">
              <div className="flex items-center justify-between pb-5 border-b border-[#173e2d]/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="ml-2 font-mono text-[12px] text-[#5E665F]">simantri.nganjukkab.go.id</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDE8D8] text-[#002819] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#36684a] animate-pulse"></span> Data Pasar Aktif
                </span>
              </div>

              <div className="mt-6 space-y-6">
                <div className="bg-[#F7F2EA] hover:bg-white transition-colors p-5 rounded-[18px] border border-transparent hover:border-[#173e2d]/15 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-[#5E665F] font-semibold">
                        Harga Acuan Rata-rata
                      </span>
                      <p className="font-editorial text-[24px] font-semibold text-[#173e2d]">
                        Rp 28.500 <span className="text-[13px] text-[#5E665F] font-normal">/ kg (Basah)</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center text-[#275a3d] text-[13px] font-bold">
                        <TrendingUp size={16} className="mr-1" /> +4.2%
                      </span>
                      <p className="text-[11.5px] text-[#5E665F]">Pasar Sukomoro</p>
                    </div>
                  </div>

                  {/* Sparkline Visual SVG */}
                  <div className="w-full h-16 pt-2">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 50">
                      <path
                        d="M0,40 Q40,35 80,38 T160,20 T240,24 T300,8"
                        fill="none"
                        stroke="#36684a"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M0,40 Q40,35 80,38 T160,20 T240,24 T300,8 L300,50 L0,50 Z"
                        fill="rgba(54, 104, 74, 0.08)"
                      />
                      <circle cx="300" cy="8" fill="#173E2D" r="4" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#5E665F] pt-2">
                    <span>Sen</span>
                    <span>Sel</span>
                    <span>Rab</span>
                    <span>Kam</span>
                    <span>Jum</span>
                    <span>Sab</span>
                    <span className="font-bold text-[#173e2d]">Hari Ini</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F7F2EA] hover:bg-white transition-colors p-4 rounded-[18px] flex items-center gap-3.5 border border-transparent hover:border-[#173e2d]/15 shadow-xs">
                    <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0 bg-[#f1eae0] relative">
                      <Image
                        src="/penyakit_bercak_ungu.jpg"
                        alt="Diagnostik Trotol"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#6b1434] font-bold">
                        Deteksi Citra AI
                      </span>
                      <p className="text-[13px] font-bold text-[#1A221D] leading-tight mt-0.5">
                        Alternaria porri (Trotol)
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-[#36684a]"></span>
                        <span className="text-[11.5px] text-[#5E665F]">Keyakinan 94.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#173E2D] hover:bg-[#275a3d] transition-colors text-[#F8F4EC] p-4 rounded-[18px] flex flex-col justify-between shadow-xs">
                    <div className="flex items-center gap-2 mb-1 text-[#b8efc9]">
                      <Sparkles size={15} />
                      <span className="text-[12px] font-semibold">SIMA Pertanian</span>
                    </div>
                    <p className="text-[12px] text-[#81a993] line-clamp-2 leading-relaxed">
                      &quot;Kurangi pupuk Urea saat kelembaban udara malam hari &gt;85% di Sukomoro...&quot;
                    </p>
                    <span className="text-[10px] text-[#a6d0b8] text-right mt-1 font-mono">Respons instan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-[11.5px] font-mono uppercase text-[#275a3d] tracking-[0.2em] font-bold mb-3">
                Pusat Informasi
              </span>
              <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight mb-6 leading-tight">
                Semua informasi penting, dalam satu genggaman.
              </h2>
              <p className="text-[15px] text-[#5E665F] leading-relaxed mb-8">
                Antarmuka yang tenang dan bersih tanpa grafik rumit yang membingungkan. Dirancang agar mudah dioperasikan langsung di pematang sawah lewat ponsel cerdas Anda.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-2 rounded-2xl hover:bg-white transition-colors">
                  <CheckCircle2 size={20} className="text-[#275a3d] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1A221D]">Harga Harian Terverifikasi</h4>
                    <p className="text-[13px] text-[#5E665F] leading-relaxed">
                      Pembaruan data harga setiap pukul 09.00 WIB langsung dari sentra timbang.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-2xl hover:bg-white transition-colors">
                  <CheckCircle2 size={20} className="text-[#275a3d] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1A221D]">Deteksi Penyakit dalam Hitungan Detik</h4>
                    <p className="text-[13px] text-[#5E665F] leading-relaxed">
                      Cukup foto daun tanaman yang bergejala tanpa perlu menunggu sampel uji lab berhari-hari.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-2 rounded-2xl hover:bg-white transition-colors">
                  <CheckCircle2 size={20} className="text-[#275a3d] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1A221D]">Asisten yang Memahami Tanah Nganjuk</h4>
                    <p className="text-[13px] text-[#5E665F] leading-relaxed">
                      Diprogram dengan konteks lokal jenis tanah Alluvial dan iklim mikrokosmos Sukomoro-Rejoso.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION: UNTUK SIAPA */}
        <section id="untuk-siapa" className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#F7F2EA] border-t border-[#173e2d]/10 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="text-[11.5px] font-mono uppercase text-[#275a3d] tracking-[0.2em] font-bold mb-3 block">
                Penerima Manfaat
              </span>
              <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight leading-tight">
                Dibuat untuk seluruh ekosistem pertanian bawang merah.
              </h2>
              <p className="text-[15px] text-[#5E665F] mt-3">
                Menghubungkan praktisi di lapangan, pendamping teknis, hingga pengambil kebijakan daerah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role 1 */}
              <div className="hover-card-lift bg-white rounded-[28px] overflow-hidden flex flex-col justify-between shadow-xs border border-[#173e2d]/10 hover:border-[#173e2d]/30">
                <div className="h-48 sm:h-52 w-full bg-[#f1eae0] overflow-hidden relative">
                  <Image
                    src="/petani_bawang_merah.jpg"
                    alt="Petani Nganjuk"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#275a3d] font-bold">Praktisi Lapangan</span>
                    <h3 className="font-editorial text-[20px] font-semibold text-[#1A221D] mt-1 mb-3">
                      Petani Mandiri & Kelompok Tani
                    </h3>
                    <p className="text-[13px] text-[#5E665F] leading-relaxed mb-6">
                      Memperoleh kepastian harga jual, panduan dosis obat tepat guna, serta konsultasi cepat tanpa rasa sungkan saat menemukan bercak aneh pada daun bibit.
                    </p>
                  </div>
                  <ul className="space-y-2 text-[12.5px] text-[#414844] pt-4 border-t border-[#173e2d]/10">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                      <span>Akses proyeksi tren harga</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                      <span>Penanganan hama tepat sasaran</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Role 2 */}
              <div className="hover-card-lift bg-white rounded-[28px] overflow-hidden flex flex-col justify-between shadow-xs border border-[#173e2d]/10 hover:border-[#173e2d]/30">
                <div className="h-48 sm:h-52 w-full bg-[#f1eae0] overflow-hidden relative">
                  <Image
                    src="/jayastamba.jpg"
                    alt="PPL Pertanian Nganjuk"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#275a3d] font-bold">Pendamping Teknis</span>
                    <h3 className="font-editorial text-[20px] font-semibold text-[#1A221D] mt-1 mb-3">
                      Penyuluh Lapangan (PPL)
                    </h3>
                    <p className="text-[13px] text-[#5E665F] leading-relaxed mb-6">
                      Memantau peta sebaran kendala hama di tingkat desa, mencatat validasi temuan lapangan, serta menyebarkan panduan teknis musiman secara efisien.
                    </p>
                  </div>
                  <ul className="space-y-2 text-[12.5px] text-[#414844] pt-4 border-t border-[#173e2d]/10">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                      <span>Peta persebaran serangan patogen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                      <span>Kurasi artikel agronomi resmi</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Role 3 */}
              <div className="hover-card-lift bg-white rounded-[28px] overflow-hidden flex flex-col justify-between shadow-xs border border-[#173e2d]/10 hover:border-[#173e2d]/30">
                <div className="h-48 sm:h-52 w-full bg-[#f1eae0] overflow-hidden relative">
                  <Image
                    src="/bg_tugu_bawang.jpg"
                    alt="Dinas Pertanian Nganjuk"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#275a3d] font-bold">Pemerintah Daerah</span>
                    <h3 className="font-editorial text-[20px] font-semibold text-[#1A221D] mt-1 mb-3">
                      Dinas Pertanian & Regulator
                    </h3>
                    <p className="text-[13px] text-[#5E665F] leading-relaxed mb-6">
                      Melihat neraca estimasi pasokan bawang merah daerah, mengantisipasi kelangkaan pasokan, serta merumuskan kebijakan pupuk bersubsidi yang akurat.
                    </p>
                  </div>
                  <ul className="space-y-2 text-[12.5px] text-[#414844] pt-4 border-t border-[#173e2d]/10">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                      <span>Data agregasi luas tanam real-time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36684a]"></span>
                      <span>Stabilitas pasokan pangan daerah</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: TRANSPARANSI & INTEGRITAS TEKNOLOGI / DUNIA BRAMBANG */}
        <section id="dunia-brambang" className="w-full px-6 lg:px-14 py-16 lg:py-24 bg-[#FAF7F2] scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11.5px] font-mono uppercase text-[#275a3d] tracking-[0.2em] font-bold mb-3 block">
                Prinsip Integritas Data
              </span>
              <h2 className="font-editorial text-[32px] sm:text-[42px] text-[#1A221D] font-medium tracking-tight leading-tight">
                Teknologi yang menjelaskan dari mana jawabannya berasal.
              </h2>
              <p className="text-[15px] text-[#5E665F] mt-3">
                Kami menolak sistem kotak hitam. Setiap rekomendasi dapat dilacak sumber data rujukannya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="hover-card-lift flex flex-col bg-white p-6 rounded-2xl border border-[#173e2d]/10 hover:border-[#173e2d]/30 shadow-xs">
                <div className="w-12 h-12 rounded-[16px] bg-[#DDE8D8] text-[#002819] flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                  <Database size={24} />
                </div>
                <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">
                  Sumber Terverifikasi
                </h4>
                <p className="text-[13px] text-[#5E665F] leading-relaxed">
                  Data pasar bersumber dari pencatatan harian pedagang grosir Sukomoro dan PIHPS nasional, bukan estimasi sintetis.
                </p>
              </div>

              <div className="hover-card-lift flex flex-col bg-white p-6 rounded-2xl border border-[#173e2d]/10 hover:border-[#173e2d]/30 shadow-xs">
                <div className="w-12 h-12 rounded-[16px] bg-[#DDE8D8] text-[#002819] flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                  <Percent size={24} />
                </div>
                <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">
                  Tingkat Keyakinan Jelas
                </h4>
                <p className="text-[13px] text-[#5E665F] leading-relaxed">
                  Hasil deteksi citra selalu menyertakan persentase keyakinan. Jika citra buram, sistem meminta foto ulang secara jujur.
                </p>
              </div>

              <div className="hover-card-lift flex flex-col bg-white p-6 rounded-2xl border border-[#173e2d]/10 hover:border-[#173e2d]/30 shadow-xs">
                <div className="w-12 h-12 rounded-[16px] bg-[#DDE8D8] text-[#002819] flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">
                  Berbasis Bukti Ilmiah
                </h4>
                <p className="text-[13px] text-[#5E665F] leading-relaxed">
                  Setiap dosis anjuran pupuk dan pestisida merujuk pada standar agronomi Kementerian Pertanian dan Balitsa Lembang.
                </p>
              </div>

              <div className="hover-card-lift flex flex-col bg-white p-6 rounded-2xl border border-[#173e2d]/10 hover:border-[#173e2d]/30 shadow-xs">
                <div className="w-12 h-12 rounded-[16px] bg-[#DDE8D8] text-[#002819] flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-[1.02]">
                  <Lock size={24} />
                </div>
                <h4 className="font-editorial text-[18px] font-semibold text-[#1A221D] mb-2">
                  Akses Terstruktur
                </h4>
                <p className="text-[13px] text-[#5E665F] leading-relaxed">
                  Privasi data lahan petani dijaga ketat. Tidak ada data pribadi yang dijualbelikan kepada pihak ketiga komersial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FINAL EDITORIAL BANNER */}
        <section className="w-full px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24">
          <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden p-8 sm:p-14 lg:p-20 bg-[#173E2D] text-[#F8F4EC] text-center flex flex-col items-center justify-center shadow-xl">
            <Image
              src="/bg_tugu_bawang.jpg"
              alt="Pemandangan Sawah Bawang Nganjuk"
              fill
              className="object-cover opacity-15 pointer-events-none"
            />
            <div className="relative z-10 max-w-3xl flex flex-col items-center">
              <span className="text-[12px] font-mono uppercase text-[#b8efc9] tracking-[0.2em] font-semibold mb-3">
                Ekosistem Pertanian Nganjuk
              </span>
              <h2 className="font-editorial text-[30px] sm:text-[42px] font-normal leading-tight text-white tracking-tight mb-5 max-w-2xl text-center">
                Mulai perjalanan pertanian bawang merah yang lebih cerdas bersama SIMANTRI.
              </h2>
              <p className="text-[15px] sm:text-[16px] font-normal text-[#81a993] max-w-xl mb-9 leading-relaxed text-center">
                Bergabunglah bersama ribuan petani, penyuluh kecamatan, dan praktisi agrikultur se-Kabupaten Nganjuk dalam ekosistem digital terpadu.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="hover-btn-coral inline-flex items-center justify-center bg-[#E25C58] text-white font-semibold text-[14px] px-8 py-3.5 rounded-full shadow-lg"
                >
                  Mulai Gunakan SIMANTRI
                </Link>
                <Link
                  href="/dunia-brambang"
                  className="hover-btn-scale inline-flex items-center justify-center border border-[#81a993]/40 text-white hover:bg-white/10 font-semibold text-[14px] px-8 py-3.5 rounded-full"
                >
                  Jelajahi Dunia Brambang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#173E2D] text-[#F8F4EC] pt-16 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/10 p-1">
                  <Image
                    src="/logo_sima.png"
                    alt="Logo SIMANTRI"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="font-editorial text-[22px] text-white tracking-tight font-semibold">
                  SIMANTRI
                </span>
              </div>
              <p className="text-[13px] text-[#81a993] max-w-md leading-relaxed">
                Platform informasi dan tata kelola pertanian presisi untuk memperkuat ketahanan pangan komoditas bawang merah di Kabupaten Nganjuk secara berkelanjutan.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#b5ecc6] text-[#002110] text-[11px] font-semibold">
                  Nganjuk Agro Hub
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EAC6D2] text-[#6b1434] text-[11px] font-semibold">
                  Varietas Tajuk & Bauji
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4 font-mono">
                NAVIGASI
              </h4>
              <ul className="space-y-2.5 text-[13px]">
                <li className="flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#81a993]" />
                  <a href="#masalah" className="text-[#81a993] hover:text-white transition-colors">
                    Masalah
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#81a993]" />
                  <a href="#solusi-section" className="text-[#81a993] hover:text-white transition-colors">
                    Solusi Terpadu
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#81a993]" />
                  <a href="#cara-kerja" className="text-[#81a993] hover:text-white transition-colors">
                    Cara Kerja
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#81a993]" />
                  <a href="#untuk-siapa" className="text-[#81a993] hover:text-white transition-colors">
                    Untuk Siapa
                  </a>
                </li>
                <li className="flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-[#81a993]" />
                  <Link href="/dunia-brambang" className="text-[#81a993] hover:text-white transition-colors">
                    Dunia Brambang
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4 font-mono">
                AKSES LAYANAN
              </h4>
              <ul className="space-y-2.5 text-[13px]">
                <li className="flex items-center gap-1.5">
                  <LogIn size={13} className="text-[#81a993]" />
                  <Link href="/login" className="text-[#81a993] hover:text-white transition-colors">
                    Masuk Petani
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <UserPlus size={13} className="text-[#81a993]" />
                  <Link href="/register" className="text-[#81a993] hover:text-white transition-colors">
                    Daftar Akun Baru
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <Layers size={13} className="text-[#81a993]" />
                  <Link href="/dashboard" className="text-[#81a993] hover:text-white transition-colors">
                    Dashboard Mandiri
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#81a993]" />
                  <Link href="/login" className="text-[#81a993] hover:text-white transition-colors">
                    Analitik Pasar
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4 font-mono">
                BANTUAN & KEBIJAKAN
              </h4>
              <ul className="space-y-2.5 text-[13px]">
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-[#81a993]" />
                  <Link href="/terms" className="text-[#81a993] hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-[#81a993]" />
                  <Link href="/privacy" className="text-[#81a993] hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-[#81a993]" />
                  <Link href="/data-deletion" className="text-[#81a993] hover:text-white transition-colors">
                    Penghapusan Data
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <PhoneCall size={13} className="text-[#81a993]" />
                  <span className="text-[#81a993]">
                    Dispertan Nganjuk
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#81a993] border-t border-white/10">
            <p>© {new Date().getFullYear()} SIMANTRI Nganjuk. Semua hak dilindungi.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privasi
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Ketentuan Layanan
              </Link>
              <Link href="/data-deletion" className="hover:text-white transition-colors">
                Penghapusan Data
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
