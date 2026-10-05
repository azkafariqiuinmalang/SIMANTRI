'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'

const SHOWCASE_SLIDES = [
  {
    image: '/jayastamba.jpg',
    title: 'Monumen Jayastamba',
    subtitle: 'Simbol Kejayaan & Bumi Bawang Merah',
  },
  {
    image: '/bg_tugu_bawang.jpg',
    title: 'Sentra Hortikultura',
    subtitle: 'Pusat Distribusi Bawang Merah Nasional',
  },
]

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const cleanEmail = email.trim().toLowerCase()

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        setErrorMessage(
          error.message === 'Invalid login credentials'
            ? 'Email atau kata sandi tidak cocok. Silakan periksa kembali data akun Anda.'
            : error.message
        )
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      setErrorMessage(message)
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length)
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[var(--theme-canvas)] text-slate-800 dark:text-[var(--theme-ink)] flex items-center justify-center p-3 sm:p-5 lg:p-7 antialiased font-jakarta">
      {/* Tombol Balik ke Beranda (Fixed di pojok atas) */}
      <div className="fixed top-4 left-4 z-30 hidden sm:block">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-[var(--theme-line)] bg-white/80 dark:bg-[var(--theme-surface)]/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] shadow-sm transition-all hover:bg-white dark:hover:bg-[var(--theme-surface)] hover:shadow hover:text-simantri-700 dark:hover:text-[var(--theme-green)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-simantri-600 dark:text-[var(--theme-green)]" />
          <span>{t("Kembali ke Beranda")}</span>
        </Link>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-[1360px] min-h-[760px] bg-white dark:bg-[var(--theme-surface)] rounded-[32px] shadow-2xl shadow-emerald-950/5 border border-slate-100 dark:border-[var(--theme-line)] p-3.5 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Showcase Section (Left Side) */}
        <section
          aria-label={t("Informasi Wilayah Pertanian")}
          className="relative w-full lg:w-[50%] min-h-[460px] lg:min-h-[720px] rounded-[28px] overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white shadow-inner bg-slate-900"
        >
          {/* Background Image Carousel */}
          <div className="absolute inset-0">
            <Image
              src={SHOWCASE_SLIDES[activeSlide].image}
              alt={t(SHOWCASE_SLIDES[activeSlide].title)}
              fill
              priority
              className="object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-all duration-700"
            />
          </div>

          {/* Atmospheric Ambient Gradient Overlay */}
          <div className="absolute inset-0 hero-mask z-0" />

          {/* Showcase Header */}
          <header className="relative z-10 flex items-center justify-end gap-4">

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium">
              <Link
                href="/dunia-brambang"
                className="text-white/85 hover:text-white transition py-1.5 px-3 hidden sm:inline-block"
              >
                {t("Dunia Brambang")}</Link>
              <Link
                href="/register"
                className="border border-white/40 hover:border-white dark:hover:border-[var(--theme-line)] text-white backdrop-blur-md bg-white/10 hover:bg-white/20 transition duration-200 px-4 py-1.5 rounded-full font-semibold"
              >
                {t("Daftar Akun")}</Link>
            </div>
          </header>

          {/* Middle Highlight Quote */}
          <div className="relative z-10 my-auto py-8 max-w-md">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
              {t("Digitalisasi Pertanian Bawang Merah Berkelanjutan")}</h2>
            <p className="mt-3 text-xs sm:text-sm text-emerald-50/85 leading-relaxed font-normal">
              {t("Akses prediksi harga pasar harian, diagnosa citra penyakit daun, dan wawasan agronomis presisi khusus Kabupaten Nganjuk.")}</p>
          </div>

          {/* Showcase Footer */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6 border-t border-white/15">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl ring-2 ring-emerald-300/40 dark:ring-[var(--theme-green)]/40 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide leading-snug drop-shadow-sm">
                  {t(SHOWCASE_SLIDES[activeSlide].title)}
                </h3>
                <p className="text-xs text-emerald-100/80 font-medium">
                  {SHOWCASE_SLIDES[activeSlide].subtitle}
                </p>
              </div>
            </div>

            {/* Slider Controls */}
            <div aria-label={t("Kontrol Galeri")} className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                onClick={prevSlide}
                aria-label={t("Sebelumnya")}
                className="w-9 h-9 rounded-full border border-white/30 backdrop-blur-md bg-black/20 hover:bg-white/20 text-white flex items-center justify-center transition focus:outline-none"
                type="button"
              >
                &#8592;
              </button>
              <button
                onClick={nextSlide}
                aria-label={t("Selanjutnya")}
                className="w-9 h-9 rounded-full border border-white/30 backdrop-blur-md bg-black/20 hover:bg-white/20 text-white flex items-center justify-center transition focus:outline-none"
                type="button"
              >
                &#8594;
              </button>
            </div>
          </div>
        </section>

        {/* Form Section (Right Side) */}
        <section
          aria-label={t("Formulir Masuk")}
          className="w-full lg:w-[50%] flex flex-col justify-between px-3 sm:px-8 lg:px-10 py-4 lg:py-6"
        >
          {/* Top Bar: Logo & Language Selector */}
          <div className="flex items-center justify-between pb-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 relative flex items-center justify-center">
                <Image
                  src="/logo_simantri.png"
                  alt={t("Logo SIMANTRI")}
                  width={40}
                  height={40}
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-[var(--theme-ink)] leading-tight">
                  SIMANTRI
                </span>
                <span className="text-[10px] font-semibold text-simantri-700 dark:text-[var(--theme-green)] tracking-wider uppercase">
                  {t("Kab. Nganjuk")}</span>
              </div>
            </Link>

          </div>

          {/* Main Form Body */}
          <div className="max-w-[420px] w-full mx-auto my-auto py-4">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight mb-2 font-jakarta">
                {t("Sugeng Rawuh")}</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[var(--theme-muted)] font-medium leading-relaxed">
                {t("Akses portal manajemen pertanian bawang merah cerdas Kabupaten Nganjuk")}</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-[var(--theme-red-soft)] border border-red-200 dark:border-[var(--theme-red)] text-left flex items-start gap-2.5 text-red-800 dark:text-[var(--theme-red)] animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-[var(--theme-red)] shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-medium">{t(errorMessage)}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Field: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1.5"
                >
                  {t("Alamat Email Akun")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("nama@email.com")}
                  className="w-full h-12 px-4 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none"
                />
              </div>

              {/* Field: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)]"
                  >
                    {t("Kata Sandi")}</label>
                  <Link
                    href="/privacy"
                    className="text-xs font-semibold text-shallot-500 dark:text-[var(--theme-rose)] hover:text-shallot-600 dark:hover:text-[var(--theme-rose)] transition"
                  >
                    {t("Lupa kata sandi?")}</Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-4 pr-11 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-[var(--theme-muted)] hover:text-slate-600 dark:hover:text-[var(--theme-body)] focus:outline-none"
                    aria-label={showPassword ? t("Sembunyikan kata sandi") : t("Tampilkan kata sandi")}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-simantri-500 hover:bg-simantri-600 active:bg-simantri-700 text-white font-bold text-sm tracking-wide rounded-2xl shadow-lg shadow-simantri-500/25 transition duration-200 focus:outline-none focus:ring-4 focus:ring-simantri-500/30 dark:focus:ring-[var(--theme-green)]/30 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("Memverifikasi Akun...")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("Masuk ke Sistem")}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Register Prompt */}
              <p className="text-center text-xs text-slate-500 dark:text-[var(--theme-muted)] pt-2 font-medium">
                {t("Belum memiliki akun?")}{' '}
                <Link
                  href="/register"
                  className="text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-bold hover:underline transition"
                >
                  {t("Daftar Sekarang")}</Link>
              </p>
            </form>
          </div>

          {/* Form Footer */}
          <footer className="pt-4 border-t border-slate-100 dark:border-[var(--theme-line)] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-[var(--theme-muted)] gap-3">
            <span>{t("© 2026 Dinas Pertanian Kab. Nganjuk")}</span>
            <div className="flex items-center space-x-3 text-[11px]">
              <Link href="/terms" className="hover:text-simantri-600 dark:hover:text-[var(--theme-green)] transition">
                {t("Syarat & Ketentuan")}</Link>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-[var(--theme-raised)]" />
              <Link href="/privacy" className="hover:text-simantri-600 dark:hover:text-[var(--theme-green)] transition">
                {t("Privasi")}</Link>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-[var(--theme-raised)]" />
              <Link href="/" className="hover:text-simantri-600 dark:hover:text-[var(--theme-green)] transition">
                {t("Beranda")}</Link>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}
