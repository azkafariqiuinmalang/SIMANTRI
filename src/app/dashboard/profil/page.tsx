'use client'

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
          <Loader2 className="w-8 h-8 animate-spin text-simantri-600" />
          <p className="text-xs font-semibold text-slate-600">Memuat profil akun SIMANTRI...</p>
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
              <span>Manajemen Akun &amp; Kemitraan Agronomi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Kelola Profil Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Informasi identitas akun, rincian lokasi hamparan binaan, dan pengelolaan keamanan sesi SIMANTRI Kabupaten Nganjuk.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold text-white">Sinkronisasi Si-Petani Aktif</span>
            <span className="text-white/40">•</span>
            <span className="text-[11px] text-emerald-200 font-mono">v2.4 Nganjuk</span>
          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR TOASTS */}
      {successMessage && <Toast message={successMessage} onDismiss={() => setSuccessMessage(null)} />}

      {errorMessage && (
        <div role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Tindakan belum berhasil. Periksa isian dan koneksi, lalu coba kembali.</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-700 hover:bg-rose-100 rounded-lg transition"
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
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-simantri-700 via-simantri-800 to-slate-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                {profile?.is_verified_contributor && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-md border-2 border-white flex items-center justify-center" title="Kontributor Terverifikasi">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-simantri-800 font-bold text-[11px] border border-emerald-200/80 mb-1.5">
                  <Sprout className="w-3.5 h-3.5 text-simantri-600" />
                  <span>{roleLabel}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 truncate">
                  {fullName || 'Pengguna SIMANTRI'}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  UID: {profile?.id?.slice(0, 13)}...
                </p>
              </div>
            </div>

            {/* Role Lock Notice */}
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
              <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Otoritas Akses Terproteksi</span>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Hak akses dikelola sesuai peran terdaftar di Supabase RLS. Penyesuaian peran memerlukan validasi Administrator / Dinas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold pt-1">
              <MapPin className="w-4 h-4 text-simantri-600 shrink-0" />
              <span>{village || 'Kecamatan Sukomoro'}, Kab. Nganjuk, Jawa Timur</span>
            </div>

            {/* Metric Telemetry Micro-Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Deteksi CV</span>
                <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{detectionsCount}</span>
                <span className="text-[10px] font-semibold text-simantri-700">Riwayat Foto</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pengetahuan</span>
                <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{suggestionsCount}</span>
                <span className="text-[10px] font-semibold text-shallot-700">Usulan Tani</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Bergabung</span>
                <span className="text-sm font-extrabold text-slate-900 mt-1 block">{joinDate}</span>
                <span className="text-[10px] font-semibold text-slate-500">Musim Tanam</span>
              </div>
            </div>
          </div>

          {/* SIMA Quick Helper Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-xs border border-emerald-200 shrink-0 overflow-hidden">
              <Image src="/sima.jpg" alt="SIMA" width={48} height={48} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-slate-900">Butuh Bantuan Profil?</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Tanyakan kepada SIMA mengenai prosedur pembaruan status kelompok tani atau KTA.
              </p>
            </div>
            <Link
              href="/dashboard/chat"
              className="px-3 py-1.5 rounded-xl bg-simantri-700 hover:bg-simantri-800 text-white text-xs font-bold shrink-0 transition"
            >
              Tanya
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT FORM & SECURITY SETTINGS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Informasi Akun Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-simantri-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Informasi Pribadi &amp; Wilayah</h3>
                  <p className="text-xs text-slate-400">Data registrasi resmi pada ekosistem SIMANTRI</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    aria-label="Nama lengkap"
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Pak Sutrisno"
                    className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-simantri-600 focus:ring-2 focus:ring-simantri-600/10 text-slate-900 transition font-medium"
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Alamat Email (Akun Login)
                  </label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Aktif</span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    aria-label="Alamat email akun"
                    className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-slate-200 bg-slate-100/80 text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Email terikat dengan otentikasi akun dan diamankan dengan Supabase Auth.
                </p>
              </div>

              {/* Role (Read only) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Peran Aktor Sistem
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-simantri-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled
                    value={roleLabel}
                    aria-label="Peran aktor sistem"
                    className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl border border-slate-200 bg-slate-100/80 text-slate-700 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Village / District */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Kecamatan / Wilayah Budidaya Bawang Merah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    aria-label="Kecamatan budidaya"
                    value={
                      NGANJUK_KECAMATAN.find((k) =>
                        village.toLowerCase().includes(k.toLowerCase())
                      ) || ''
                    }
                    onChange={(e) => {
                      const kec = e.target.value
                      setVillage(kec ? `Kecamatan ${kec}` : '')
                    }}
                    className="h-11 px-3.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-simantri-600 text-slate-900 transition font-medium"
                  >
                    <option value="">-- Pilih Kecamatan di Nganjuk --</option>
                    {NGANJUK_KECAMATAN.map((k) => (
                      <option key={k} value={k}>
                        Kecamatan {k}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={village}
                    aria-label="Desa atau hamparan budidaya"
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Atau tulis nama Desa / Hamparan..."
                    className="h-11 px-3.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-simantri-600 text-slate-900 transition font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Lokasi hamparan menentukan kalibrasi prediksi harga, peringatan OPT cuaca, dan rujukan PPL kecamatan.
                </p>
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
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card Keamanan & Sesi Akun */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-simantri-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Keamanan &amp; Sesi Akun</h3>
                  <p className="text-xs text-slate-400">Proteksi akses berbasis enkripsi Row-Level Security</p>
                </div>
              </div>
            </div>

            {/* Status Autentikasi Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-simantri-800 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Sesi Terenkripsi Supabase Auth</span>
                  <span className="text-[11px] text-slate-500">Data lahan &amp; riwayat deteksi terlindungi secara aman.</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase shrink-0">
                Sesi Valid
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetPasswordLoading}
                className="h-11 px-5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {resetPasswordLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5 text-simantri-700" />
                )}
                <span>Kirim Reset Kata Sandi</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="h-11 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
