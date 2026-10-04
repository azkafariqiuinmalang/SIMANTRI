'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Toast } from '@/components/ui/Experience'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  User,
  ShieldCheck,
  MapPin,
  Save,
  AlertCircle,
  Loader2,
  Sparkles,
  Sprout,
  Mail,
  Shield,
  Lock,
  LogOut,
  KeyRound,
  X,
} from 'lucide-react'

const NGANJUK_KECAMATAN = [
  'Bagor',
  'Baron',
  'Berbek',
  'Gondang',
  'Jatikalen',
  'Kertosono',
  'Lengkong',
  'Loceret',
  'Nganjuk',
  'Ngetos',
  'Ngluyu',
  'Ngronggot',
  'Pace',
  'Patianrowo',
  'Prambon',
  'Rejoso',
  'Sawahan',
  'Sukomoro',
  'Tanjunganom',
  'Wilangan',
]

export default function ProfilPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')
  const [fullName, setFullName] = useState('')
  const [village, setVillage] = useState('')
  const [detectionsCount, setDetectionsCount] = useState<number>(0)
  const [suggestionsCount, setSuggestionsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      const [profResult, detResult, sugResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('cv_detections').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('content_suggestions').select('id', { count: 'exact', head: true }).eq('submitted_by', user.id),
      ])

      if (profResult.data) {
        const prof = profResult.data as Profile
        setProfile(prof)
        setFullName(prof.full_name || '')
        setVillage(prof.village || '')
      }

      setDetectionsCount(detResult.count ?? 0)
      setSuggestionsCount(sugResult.count ?? 0)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          village: village.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) {
        setErrorMessage(error.message || 'Gagal memperbarui profil.')
      } else {
        setProfile({ ...profile, full_name: fullName.trim(), village: village.trim() })
        setSuccessMessage('Data profil dan lokasi budidaya Anda berhasil diperbarui!')
      }
    } catch {
      setErrorMessage('Terjadi kesalahan koneksi saat menyimpan profil.')
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) return
    setResetPasswordLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard/profil`,
      })

      if (error) throw error
      setSuccessMessage(`Tautan keamanan reset kata sandi telah dikirimkan ke email ${email}.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim email reset password.'
      setErrorMessage(msg)
    } finally {
      setResetPasswordLoading(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sesi akun SIMANTRI?')) {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center p-8 font-jakarta">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-simantri-600 dark:text-[var(--theme-green)]" />
          <p className="text-xs font-semibold text-slate-600 dark:text-[var(--theme-body)]">{t("Memuat profil akun SIMANTRI...")}</p>
        </div>
      </div>
    )
  }

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    : 'Aktif'

  const roleLabel =
    profile?.role === 'admin'
      ? 'Administrator Sistem'
      : profile?.role === 'penyuluh'
      ? 'Penyuluh Pertanian (PPL)'
      : 'Petani Bawang Merah'

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-jakarta">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-simantri-900 via-simantri-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-simantri-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 h-48 w-48 rounded-full bg-shallot-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-simantri-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("Manajemen Akun & Kemitraan Agronomi")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t("Kelola Profil Akun")}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t("Informasi identitas akun, rincian lokasi hamparan binaan, dan pengelolaan keamanan sesi SIMANTRI Kabupaten Nganjuk.")}</p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold text-white">{t("Sinkronisasi Si-Petani Aktif")}</span>
            <span className="text-white/40">•</span>
            <span className="text-[11px] text-emerald-200 font-mono">{t("v2.4 Nganjuk")}</span>
          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR TOASTS */}
      {successMessage && <Toast message={successMessage} onDismiss={() => setSuccessMessage(null)} />}

      {errorMessage && (
        <div role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-[var(--theme-rose-soft)] border border-rose-200 dark:border-[var(--theme-rose)] text-rose-900 dark:text-[var(--theme-rose)] text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-[var(--theme-rose)] shrink-0" />
            <span>{t("Tindakan belum berhasil. Periksa isian dan koneksi, lalu coba kembali.")}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-700 dark:text-[var(--theme-rose)] hover:bg-rose-100 dark:hover:bg-[var(--theme-rose-soft)] rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-COLUMN WORKSTATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
        {/* LEFT COLUMN: IDENTITY & TELEMETRY SUMMARY (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Profil Utama */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-6 border border-slate-100 dark:border-[var(--theme-line)] shadow-xs relative overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-simantri-700 via-simantri-800 to-slate-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white dark:border-[var(--theme-line)]">
                  {fullName ? fullName.charAt(0).toUpperCase() : t("U")}
                </div>
                {profile?.is_verified_contributor && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-md border-2 border-white dark:border-[var(--theme-line)] flex items-center justify-center" title={t("Kontributor Terverifikasi")}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] font-bold text-[11px] border border-emerald-200/80 dark:border-[var(--theme-green)]/80 mb-1.5">
                  <Sprout className="w-3.5 h-3.5 text-simantri-600 dark:text-[var(--theme-green)]" />
                  <span>{t(roleLabel)}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] truncate">
                  {fullName || t("Pengguna SIMANTRI")}
                </h2>
                <p className="text-xs text-slate-400 dark:text-[var(--theme-muted)] font-mono mt-0.5">
                  {t("UID:")} {profile?.id?.slice(0, 13)}...
                </p>
              </div>
            </div>

            {/* Role Lock Notice */}
            <div className="p-3.5 bg-slate-50 dark:bg-[var(--theme-canvas)] rounded-2xl flex items-start gap-3 border border-slate-100 dark:border-[var(--theme-line)]">
              <Lock className="w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)] block">{t("Otoritas Akses Terproteksi")}</span>
                <p className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)] leading-relaxed mt-0.5">
                  {t("Hak akses dikelola sesuai peran terdaftar di Supabase RLS. Penyesuaian peran memerlukan validasi Administrator / Dinas.")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-[var(--theme-body)] text-xs font-semibold pt-1">
              <MapPin className="w-4 h-4 text-simantri-600 dark:text-[var(--theme-green)] shrink-0" />
              <span>{village || t("Kecamatan Sukomoro")}{t(", Kab. Nganjuk, Jawa Timur")}</span>
            </div>

            {/* Metric Telemetry Micro-Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-50 dark:bg-[var(--theme-canvas)] p-3 rounded-2xl text-center border border-slate-100 dark:border-[var(--theme-line)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[var(--theme-muted)] block">{t("Deteksi CV")}</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] mt-0.5 block">{detectionsCount}</span>
                <span className="text-[10px] font-semibold text-simantri-700 dark:text-[var(--theme-green)]">{t("Riwayat Foto")}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[var(--theme-canvas)] p-3 rounded-2xl text-center border border-slate-100 dark:border-[var(--theme-line)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[var(--theme-muted)] block">{t("Pengetahuan")}</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] mt-0.5 block">{suggestionsCount}</span>
                <span className="text-[10px] font-semibold text-shallot-700 dark:text-[var(--theme-rose)]">{t("Usulan Tani")}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[var(--theme-canvas)] p-3 rounded-2xl text-center border border-slate-100 dark:border-[var(--theme-line)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[var(--theme-muted)] block">{t("Bergabung")}</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-[var(--theme-ink)] mt-1 block">{joinDate}</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-[var(--theme-muted)]">{t("Musim Tanam")}</span>
              </div>
            </div>
          </div>

          {/* SIMA Quick Helper Card */}
          <div className="bg-emerald-50/70 dark:bg-[var(--theme-green-soft)] border border-emerald-200/60 dark:border-[var(--theme-green)]/60 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[var(--theme-surface)] p-1 shadow-xs border border-emerald-200 dark:border-[var(--theme-green)] shrink-0 overflow-hidden">
              <Image src="/sima.jpg" alt="SIMA" width={48} height={48} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-[var(--theme-ink)]">{t("Butuh Bantuan Profil?")}</h4>
              <p className="text-[11px] text-slate-600 dark:text-[var(--theme-body)] mt-0.5">
                {t("Tanyakan kepada SIMA mengenai prosedur pembaruan status kelompok tani atau KTA.")}</p>
            </div>
            <Link
              href="/dashboard/chat"
              className="px-3 py-1.5 rounded-xl bg-simantri-700 hover:bg-simantri-800 text-white text-xs font-bold shrink-0 transition"
            >
              {t("Tanya")}</Link>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT FORM & SECURITY SETTINGS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Informasi Akun Form */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[var(--theme-line)] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[var(--theme-line)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-700 dark:text-[var(--theme-green)] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-[var(--theme-ink)]">{t("Informasi Pribadi & Wilayah")}</h3>
                  <p className="text-xs text-slate-400 dark:text-[var(--theme-muted)]">{t("Data registrasi resmi pada ekosistem SIMANTRI")}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)]">
                  {t("Nama Lengkap")}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    aria-label={t("Nama lengkap")}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("Contoh: Pak Sutrisno")}
                    className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] bg-slate-50/50 dark:bg-[var(--theme-canvas)]/50 focus:bg-white dark:focus:bg-[var(--theme-surface)] focus:outline-hidden focus:border-simantri-600 dark:focus:border-[var(--theme-green)] focus:ring-2 focus:ring-simantri-600/10 dark:focus:ring-[var(--theme-green)]/10 text-slate-900 dark:text-[var(--theme-ink)] transition font-medium"
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)]">
                    {t("Alamat Email (Akun Login)")}</label>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-[var(--theme-muted)] uppercase">{t("Aktif")}</span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    aria-label={t("Alamat email akun")}
                    className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] bg-slate-100/80 dark:bg-[var(--theme-raised)]/80 text-slate-500 dark:text-[var(--theme-muted)] font-mono cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-[var(--theme-muted)]">
                  {t("Email terikat dengan otentikasi akun dan diamankan dengan Supabase Auth.")}</p>
              </div>

              {/* Role (Read only) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)]">
                  {t("Peran Aktor Sistem")}</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-simantri-600 dark:text-[var(--theme-green)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={t(roleLabel)}
                    aria-label={t("Peran aktor sistem")}
                    className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] bg-slate-100/80 dark:bg-[var(--theme-raised)]/80 text-slate-700 dark:text-[var(--theme-body)] font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Village / District */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)]">
                  {t("Kecamatan / Wilayah Budidaya Bawang Merah")}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    aria-label={t("Kecamatan budidaya")}
                    value={
                      NGANJUK_KECAMATAN.find((k) =>
                        village.toLowerCase().includes(k.toLowerCase())
                      ) || ''
                    }
                    onChange={(e) => {
                      const kec = e.target.value
                      setVillage(kec ? `Kecamatan ${kec}` : '')
                    }}
                    className="h-11 px-3.5 text-xs rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] bg-slate-50/50 dark:bg-[var(--theme-canvas)]/50 focus:bg-white dark:focus:bg-[var(--theme-surface)] focus:outline-hidden focus:border-simantri-600 dark:focus:border-[var(--theme-green)] text-slate-900 dark:text-[var(--theme-ink)] transition font-medium"
                  >
                    <option value="">{t("-- Pilih Kecamatan di Nganjuk --")}</option>
                    {NGANJUK_KECAMATAN.map((k) => (
                      <option key={k} value={k}>
                        {t("Kecamatan")} {k}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={village}
                    aria-label={t("Desa atau hamparan budidaya")}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={t("Atau tulis nama Desa / Hamparan...")}
                    className="h-11 px-3.5 text-xs rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] bg-slate-50/50 dark:bg-[var(--theme-canvas)]/50 focus:bg-white dark:focus:bg-[var(--theme-surface)] focus:outline-hidden focus:border-simantri-600 dark:focus:border-[var(--theme-green)] text-slate-900 dark:text-[var(--theme-ink)] transition font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-[var(--theme-muted)]">
                  {t("Lokasi hamparan menentukan kalibrasi prediksi harga, peringatan OPT cuaca, dan rujukan PPL kecamatan.")}</p>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 px-6 rounded-2xl bg-simantri-700 hover:bg-simantri-800 active:bg-simantri-900 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("Menyimpan...")}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t("Simpan Perubahan Profil")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card Keamanan & Sesi Akun */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-[var(--theme-line)] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[var(--theme-line)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-700 dark:text-[var(--theme-green)] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-[var(--theme-ink)]">{t("Keamanan & Sesi Akun")}</h3>
                  <p className="text-xs text-slate-400 dark:text-[var(--theme-muted)]">{t("Proteksi akses berbasis enkripsi Row-Level Security")}</p>
                </div>
              </div>
            </div>

            {/* Status Autentikasi Box */}
            <div className="p-4 bg-slate-50 dark:bg-[var(--theme-canvas)] rounded-2xl border border-slate-100 dark:border-[var(--theme-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-[var(--theme-ink)] block">{t("Sesi Terenkripsi Supabase Auth")}</span>
                  <span className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)]">{t("Data lahan & riwayat deteksi terlindungi secara aman.")}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-[var(--theme-green-soft)] text-emerald-800 dark:text-[var(--theme-green)] text-[10px] font-extrabold uppercase shrink-0">
                {t("Sesi Valid")}</span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetPasswordLoading}
                className="h-11 px-5 rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] hover:bg-slate-100 dark:hover:bg-[var(--theme-raised)] text-slate-700 dark:text-[var(--theme-body)] font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {resetPasswordLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5 text-simantri-700 dark:text-[var(--theme-green)]" />
                )}
                <span>{t("Kirim Reset Kata Sandi")}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="h-11 px-5 rounded-2xl bg-rose-50 dark:bg-[var(--theme-rose-soft)] hover:bg-rose-100 dark:hover:bg-[var(--theme-rose-soft)] border border-rose-200 dark:border-[var(--theme-rose)] text-rose-700 dark:text-[var(--theme-rose)] font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("Keluar dari Akun")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
