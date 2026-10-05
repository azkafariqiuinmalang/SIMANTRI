'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileCheck,
  Upload,
  X,
  BadgeCheck,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

const NGANJUK_VILLAGES = [
  'Sukomoro',
  'Bagor',
  'Rejoso',
  'Wilangan',
  'Gondang',
  'Baron',
  'Tanjunganom',
  'Prambon',
  'Pacet',
  'Nganjuk Kota',
  'Loceret',
  'Berbek',
  'Ngetos',
  'Sawahan',
  'Lengkong',
  'Jatikalen',
  'Patianrowo',
  'Kertosono',
  'Ngronggot',
]

const BPP_INSTITUTIONS = [
  'BPP Wilayah Sukomoro',
  'BPP Wilayah Bagor',
  'BPP Wilayah Rejoso',
  'BPP Wilayah Gondang',
  'BPP Wilayah Tanjunganom',
  'BPP Wilayah Kertosono',
  'Dinas Pertanian Kabupaten Nganjuk',
  'Penyuluh Swadaya / Mandiri',
]

export default function RegisterPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'petani' | 'penyuluh'>('petani')
  const [village, setVillage] = useState('Sukomoro')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Penyuluh Verification Extra Fields
  const [nip, setNip] = useState('')
  const [institution, setInstitution] = useState('BPP Wilayah Sukomoro')
  const [docBase64, setDocBase64] = useState<string | null>(null)
  const [docFileName, setDocFileName] = useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file dokumen maksimal 5MB.')
        return
      }
      setDocFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setDocBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.')
      setLoading(false)
      return
    }

    if (!agreeTerms) {
      setErrorMessage('Anda wajib menyetujui Ketentuan Layanan & Kebijakan Privasi.')
      setLoading(false)
      return
    }

    if (role === 'penyuluh' && (!nip.trim() || !docBase64)) {
      setErrorMessage('Penyuluh wajib mengisi NIP/No. Registrasi dan mengunggah dokumen bukti KTA/SK.')
      setLoading(false)
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            village: village,
            nip: role === 'penyuluh' ? nip.trim() : null,
            institution: role === 'penyuluh' ? institution : null,
            verification_doc_url: role === 'penyuluh' ? docBase64 : null,
          },
        },
      })

      if (error) {
        let msg = error.message
        if (msg.toLowerCase().includes('rate limit')) {
          msg = 'Batas pengiriman email sistem pendaftaran sementara telah tercapai (Supabase Rate Limit). Silakan coba lagi beberapa saat kemudian atau hubungi administrator.'
        } else if (msg.toLowerCase().includes('already registered')) {
          msg = 'Alamat email ini sudah terdaftar di SIMANTRI. Silakan masuk menggunakan akun Anda.'
        }
        setErrorMessage(msg)
        setLoading(false)
        return
      }

      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setSuccessMessage(
          role === 'penyuluh'
            ? 'Pendaftaran Akun Penyuluh berhasil! Dokumen KTA/SK Anda sedang dalam antrean verifikasi Admin Dinas Pertanian.'
            : 'Pendaftaran berhasil! Akun Anda telah siap digunakan. Silakan masuk ke sistem.'
        )
        setLoading(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      setErrorMessage(message)
      setLoading(false)
    }
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
      <main className="w-full max-w-[1360px] min-h-[820px] bg-white dark:bg-[var(--theme-surface)] rounded-[32px] shadow-2xl shadow-emerald-950/5 border border-slate-100 dark:border-[var(--theme-line)] p-3.5 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Showcase Section (Left Side) */}
        <section
          aria-label={t("Informasi Wilayah Pertanian")}
          className="relative w-full lg:w-[45%] min-h-[460px] lg:min-h-[780px] rounded-[28px] overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white shadow-inner bg-slate-900"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/jayastamba.jpg"
              alt={t("Monumen Jayastamba Nganjuk")}
              fill
              priority
              className="object-cover object-center filter brightness-[0.88] contrast-[1.08]"
            />
          </div>

          {/* Atmospheric Ambient Gradient Overlay */}
          <div className="absolute inset-0 hero-mask z-0" />

          {/* Showcase Header */}
          <header className="relative z-10 flex items-center justify-end gap-4">

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium">
              <Link
                href="/login"
                className="border border-white/40 hover:border-white dark:hover:border-[var(--theme-line)] text-white backdrop-blur-md bg-white/10 hover:bg-white/20 transition duration-200 px-4 py-1.5 rounded-full font-semibold"
              >
                {t("Sudah Ada Akun? Masuk")}</Link>
            </div>
          </header>

          {/* Middle Showcase Information */}
          <div className="relative z-10 my-auto py-6 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
              {t("Tingkatkan Hasil Panen Bawang Merah Bersama SIMANTRI")}</h2>
            <p className="mt-3 text-xs sm:text-sm text-emerald-50/85 leading-relaxed font-normal">
              {t("Dapatkan data real-time harga pasar di 19 kecamatan, akses diagnosa AI penyakit daun, dan konsultasi interaktif bersama SIMA AI.")}</p>

            {/* Benefit Items */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{t("Pemantauan harga harian bawang merah akurat")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{t("Pendeteksi gejala penyakit (Purple Blotch, Antraknosa, dll)")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{t("Rekomendasi tindakan budidaya spesifik wilayah Nganjuk")}</span>
              </div>
            </div>
          </div>

          {/* Showcase Footer */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/15 text-xs text-emerald-100/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t("Data aman terintegrasi Dinas Pertanian Nganjuk")}</span>
            </div>
          </div>
        </section>

        {/* Form Section (Right Side) */}
        <section
          aria-label={t("Formulir Pendaftaran")}
          className="w-full lg:w-[55%] flex flex-col justify-between px-3 sm:px-8 lg:px-10 py-3 lg:py-5 overflow-y-auto"
        >
          {/* Top Bar: Logo & Language Selector */}
          <div className="flex items-center justify-between pb-3">
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
          <div className="max-w-[500px] w-full mx-auto my-auto py-2">
            <div className="text-center mb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight mb-1.5 font-jakarta">
                {t("Buat Akun Baru")}</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[var(--theme-muted)] font-medium">
                {t("Bergabung bersama ekosistem cerdas bawang merah Nganjuk")}</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3.5 p-3 rounded-2xl bg-red-50 dark:bg-[var(--theme-red-soft)] border border-red-200 dark:border-[var(--theme-red)] text-left flex items-start gap-2.5 text-red-800 dark:text-[var(--theme-red)] animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-[var(--theme-red)] shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-medium">{t(errorMessage)}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] border border-emerald-200 dark:border-[var(--theme-green)] text-left flex items-start gap-2.5 text-emerald-800 dark:text-[var(--theme-green)] animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[var(--theme-green)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs leading-relaxed font-medium">{t(successMessage)}</p>
                  <Link
                    href="/login"
                    className="mt-1.5 inline-block text-xs font-bold text-simantri-700 dark:text-[var(--theme-green)] underline hover:text-simantri-800 dark:hover:text-[var(--theme-green)]"
                  >
                    {t("Lanjut ke Halaman Masuk →")}</Link>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              {/* Field: Nama Lengkap */}
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                >
                  {t("Nama Lengkap")}</label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("Contoh: Budi Santoso, S.P.")}
                  className="w-full h-11 px-3.5 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none"
                />
              </div>

              {/* Field: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                >
                  {t("Alamat Email Aktif")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("nama@email.com")}
                  className="w-full h-11 px-3.5 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none"
                />
              </div>

              {/* Grid: Role & Kecamatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="role"
                    className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                  >
                    {t("Peran Pengguna")}</label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'petani' | 'penyuluh')}
                      className="w-full h-11 px-3.5 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none appearance-none cursor-pointer pr-9"
                    >
                      <option value="petani">{t("Petani Bawang")}</option>
                      <option value="penyuluh">{t("PPL / Penyuluh Resmi")}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[var(--theme-muted)]">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="village"
                    className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                  >
                    {t("Kecamatan / Wilayah")}</label>
                  <div className="relative">
                    <select
                      id="village"
                      name="village"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none appearance-none cursor-pointer pr-9"
                    >
                      {NGANJUK_VILLAGES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[var(--theme-muted)]">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg_password"
                    className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                  >
                    {t("Kata Sandi")}</label>
                  <div className="relative">
                    <input
                      id="reg_password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("Min. 6 karakter")}
                      className="w-full h-11 pl-3.5 pr-10 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-[var(--theme-muted)] hover:text-slate-600 dark:hover:text-[var(--theme-body)] focus:outline-none"
                      aria-label={t("Toggle password")}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-xs font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                  >
                    {t("Konfirmasi Sandi")}</label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("Ulangi sandi")}
                      className="w-full h-11 pl-3.5 pr-10 text-sm font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] bg-white dark:bg-[var(--theme-surface)] border border-slate-300 dark:border-[var(--theme-line)] rounded-2xl focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:ring-4 focus:ring-simantri-500/15 dark:focus:ring-[var(--theme-green)]/15 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-[var(--theme-muted)] hover:text-slate-600 dark:hover:text-[var(--theme-body)] focus:outline-none"
                      aria-label={t("Toggle confirm password")}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Verification Section for Penyuluh */}
              {role === 'penyuluh' && (
                <div className="p-3.5 rounded-2xl bg-simantri-50 dark:bg-[var(--theme-green-soft)] border border-simantri-200 dark:border-[var(--theme-green)] space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="w-5 h-5 text-simantri-600 dark:text-[var(--theme-green)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-simantri-900 dark:text-[var(--theme-green)]">
                        {t("Verifikasi Identitas Penyuluh Pertanian")}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-[var(--theme-body)] leading-relaxed font-medium">
                        {t("Akun Penyuluh memerlukan validasi dokumen resmi KTA/SK sebelum hak verifikasi diberikan.")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label
                        htmlFor="nip"
                        className="block text-[11px] font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                      >
                        {t("NIP / No. Registrasi KTA")} <span className="text-shallot-600 dark:text-[var(--theme-rose)]">*</span>
                      </label>
                      <input
                        id="nip"
                        name="nip"
                        type="text"
                        required
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        placeholder="198503152010011002"
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] text-xs font-medium text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="institution"
                        className="block text-[11px] font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1"
                      >
                        {t("Instansi Penugasan")} <span className="text-shallot-600 dark:text-[var(--theme-rose)]">*</span>
                      </label>
                      <select
                        id="institution"
                        name="institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] text-xs font-medium text-slate-800 dark:text-[var(--theme-ink)] focus:border-simantri-500 dark:focus:border-[var(--theme-green)] focus:outline-none"
                      >
                        {BPP_INSTITUTIONS.map((inst) => (
                          <option key={inst} value={inst}>
                            {inst}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-[var(--theme-body)] mb-1">
                      {t("Unggah Dokumen Bukti (KTA / SK Dinas)")} <span className="text-shallot-600 dark:text-[var(--theme-rose)]">*</span>
                    </label>
                    <div className="p-2.5 border-2 border-dashed border-simantri-300 dark:border-[var(--theme-green)] rounded-xl bg-white dark:bg-[var(--theme-surface)] text-center hover:bg-simantri-50/50 dark:hover:bg-[var(--theme-green-soft)] transition-colors relative">
                      <input
                        type="file"
                        id="docUpload"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        required={!docBase64}
                      />

                      {docFileName ? (
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-800 dark:text-[var(--theme-ink)] font-medium px-1">
                          <span className="flex items-center gap-1.5 truncate">
                            <FileCheck className="w-4 h-4 text-simantri-600 dark:text-[var(--theme-green)]" />
                            {docFileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDocBase64(null)
                              setDocFileName(null)
                            }}
                            className="p-1 text-red-500 dark:text-[var(--theme-red)] hover:text-red-700 dark:hover:text-[var(--theme-red)]"
                            title={t("Hapus Dokumen")}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="docUpload"
                          className="cursor-pointer flex flex-col items-center justify-center gap-1 py-1 text-slate-600 dark:text-[var(--theme-body)]"
                        >
                          <Upload className="w-4 h-4 text-simantri-600 dark:text-[var(--theme-green)]" />
                          <span className="text-xs font-semibold text-simantri-700 dark:text-[var(--theme-green)]">
                            {t("Pilih Foto KTA / Dokumen SK")}</span>
                          <span className="text-[10px] text-slate-400 dark:text-[var(--theme-muted)]">
                            {t("JPG, PNG, atau PDF (Maks 5MB)")}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 rounded text-simantri-600 dark:text-[var(--theme-green)] focus:ring-simantri-500 dark:focus:ring-[var(--theme-green)] border-slate-300 dark:border-[var(--theme-line)] cursor-pointer accent-simantri-600"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-slate-600 dark:text-[var(--theme-body)] leading-snug cursor-pointer select-none"
                >
                  {t("Saya menyetujui")}{' '}
                  <Link
                    href="/terms"
                    className="text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-semibold hover:underline"
                  >
                    {t("Ketentuan Layanan")}</Link>{' '}
                  &amp;{' '}
                  <Link
                    href="/privacy"
                    className="text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-semibold hover:underline"
                  >
                    {t("Kebijakan Privasi")}</Link>{' '}
                  {t("SIMANTRI Nganjuk.")}</label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-simantri-500 hover:bg-simantri-600 active:bg-simantri-700 text-white font-bold text-sm tracking-wide rounded-2xl shadow-lg shadow-simantri-500/25 transition duration-200 focus:outline-none focus:ring-4 focus:ring-simantri-500/30 dark:focus:ring-[var(--theme-green)]/30 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("Mendaftarkan Akun...")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("Daftar Akun")} {role === 'penyuluh' ? t("Penyuluh") : t("Petani")}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Login Prompt */}
              <p className="text-center text-xs text-slate-500 dark:text-[var(--theme-muted)] pt-1 font-medium">
                {t("Sudah memiliki akun SIMANTRI?")}{' '}
                <Link
                  href="/login"
                  className="text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-bold hover:underline transition"
                >
                  {t("Masuk di sini")}</Link>
              </p>
            </form>
          </div>

          {/* Form Footer */}
          <footer className="pt-3 border-t border-slate-100 dark:border-[var(--theme-line)] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-[var(--theme-muted)] gap-2">
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
