'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileCheck,
  Upload,
  X,
  BadgeCheck,
  Eye,
  EyeOff,
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
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'petani' | 'penyuluh'>('petani')
  const [village, setVillage] = useState('Sukomoro')

  // Penyuluh Verification Extra Fields
  const [nip, setNip] = useState('')
  const [institution, setInstitution] = useState('BPP Wilayah Sukomoro')
  const [docBase64, setDocBase64] = useState<string | null>(null)
  const [docFileName, setDocFileName] = useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false)
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
            ? 'Pendaftaran Penyuluh berhasil dikirim! Dokumen KTA/SK Anda sedang dalam antrean verifikasi Admin Dinas Pertanian.'
            : 'Pendaftaran berhasil! Akun Anda telah dibuat. Silakan masuk.'
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
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* BACKGROUND IMAGE WITH SUBTLE DARK SHADOW OVERLAY */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/bg_tugu_bawang.jpg"
          alt="Tugu Bawang Merah Nganjuk"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Soft black shadow layer to reduce brightness without drowning out the image */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>

      {/* TOMBOL KEMBALI KE BERANDA */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/25 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-black/45 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 text-[#E6A15C]" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* FROSTED GLASS CONTAINER (MODERATE BLUR & REFINED CONTRAST) */}
      <div className="w-full max-w-lg my-auto z-10">
        <div className="relative rounded-3xl border border-white/30 bg-white/18 backdrop-blur-md shadow-[0_16px_45px_rgba(0,0,0,0.4)] p-6 sm:p-9 flex flex-col items-center text-center">
          {/* LOGO */}
          <Link href="/" className="mb-2.5 group">
            <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-2xl bg-white/95 backdrop-blur-sm p-2 shadow-lg border border-white/50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/logo_simantri.png"
                alt="Logo SIMANTRI"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>

          {/* TITLE & SUBTITLE */}
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
            Daftar Akun SIMANTRI
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/90 drop-shadow max-w-xs leading-relaxed font-medium">
            Ekosistem terpercaya data pertanian bawang merah Nganjuk
          </p>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="w-full mt-4 p-3 rounded-xl bg-red-600/35 backdrop-blur-sm border border-red-300/40 text-left flex items-start gap-2.5 text-white">
              <AlertCircle className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">{errorMessage}</p>
            </div>
          )}

          {/* SUCCESS ALERT */}
          {successMessage && (
            <div className="w-full mt-4 p-3.5 rounded-xl bg-emerald-600/35 backdrop-blur-sm border border-emerald-300/40 text-left flex items-start gap-2.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs leading-relaxed font-medium">{successMessage}</p>
                <Link
                  href="/login"
                  className="mt-1.5 inline-block text-xs font-bold text-white underline hover:text-emerald-100"
                >
                  Lanjut ke Halaman Masuk &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className="w-full mt-5 space-y-3.5 text-left">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-white mb-1 drop-shadow-sm"
              >
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.P."
                className="w-full p-2.5 sm:p-3 rounded-xl border border-white/40 bg-white/90 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C4487A] transition-all shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-white mb-1 drop-shadow-sm"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full p-2.5 sm:p-3 rounded-xl border border-white/40 bg-white/90 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C4487A] transition-all shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-white mb-1 drop-shadow-sm"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-white/40 bg-white/90 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C4487A] transition-all shadow-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 focus:outline-none transition-colors"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              <div>
                <label
                  htmlFor="role"
                  className="block text-xs font-semibold text-white mb-1 drop-shadow-sm"
                >
                  Peran / Profesi
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'petani' | 'penyuluh')}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-white/40 bg-white/90 text-xs sm:text-sm text-[#0E080A] font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4487A] shadow-sm"
                >
                  <option value="petani">🌾 Petani Bawang</option>
                  <option value="penyuluh">📋 Penyuluh Pertanian (Resmi)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="village"
                  className="block text-xs font-semibold text-white mb-1 drop-shadow-sm"
                >
                  Kecamatan / Wilayah
                </label>
                <select
                  id="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-white/40 bg-white/90 text-xs sm:text-sm text-[#0E080A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4487A] shadow-sm"
                >
                  {NGANJUK_VILLAGES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* EXTRA VERIFICATION SECTION FOR PENYULUH */}
            {role === 'penyuluh' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/35 space-y-3 text-white">
                <div className="flex items-start gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white drop-shadow-sm">
                      Verifikasi Identitas Penyuluh Pertanian
                    </h4>
                    <p className="text-[11px] text-white/90 leading-relaxed font-medium">
                      Akun Penyuluh memerlukan validasi dokumen resmi KTA/SK sebelum hak verifikasi diberikan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="nip"
                      className="block text-[11px] font-semibold text-white mb-1"
                    >
                      NIP / No. Registrasi KTA <span className="text-[#FFD0E0]">*</span>
                    </label>
                    <input
                      id="nip"
                      type="text"
                      required
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="Contoh: 198503152010011002"
                      className="w-full p-2 rounded-xl border border-white/40 bg-white/90 text-xs text-[#0E080A] placeholder-gray-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="institution"
                      className="block text-[11px] font-semibold text-white mb-1"
                    >
                      Instansi Penugasan <span className="text-[#FFD0E0]">*</span>
                    </label>
                    <select
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full p-2 rounded-xl border border-white/40 bg-white/90 text-xs text-[#0E080A] focus:bg-white focus:outline-none"
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
                  <label className="block text-[11px] font-semibold text-white mb-1">
                    Unggah Dokumen Bukti (KTA / SK Dinas) <span className="text-[#FFD0E0]">*</span>
                  </label>
                  <div className="p-2.5 border-2 border-dashed border-white/50 rounded-xl bg-white/15 text-center hover:bg-white/25 transition-colors relative">
                    <input
                      type="file"
                      id="docUpload"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      required={!docBase64}
                    />

                    {docFileName ? (
                      <div className="flex items-center justify-between gap-2 text-xs text-white font-medium px-1">
                        <span className="flex items-center gap-1.5 truncate">
                          <FileCheck className="w-4 h-4 text-emerald-300" />
                          {docFileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDocBase64(null)
                            setDocFileName(null)
                          }}
                          className="p-1 text-red-200 hover:text-white"
                          title="Hapus Dokumen"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="docUpload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1 py-1 text-white"
                      >
                        <Upload className="w-4 h-4 text-white" />
                        <span className="text-xs font-semibold">
                          Pilih Foto KTA / Dokumen SK
                        </span>
                        <span className="text-[10px] text-white/80">
                          JPG, PNG, atau PDF (Maks 5MB)
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8A2D50] via-[#A83A68] to-[#C4487A] hover:brightness-110 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun {role === 'penyuluh' ? 'Penyuluh' : 'Petani'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-5 pt-3.5 border-t border-white/20 w-full text-center text-xs text-white/90 drop-shadow-sm font-medium">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-bold text-white underline underline-offset-2 hover:text-[#FFD0E0] transition-colors"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
