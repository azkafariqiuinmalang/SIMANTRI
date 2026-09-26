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
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* BACKGROUND IMAGE WITH DARK DRAMATIC OVERLAY */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/bg_tugu_bawang.jpg"
          alt="Tugu Bawang Merah Nganjuk"
          fill
          priority
          className="object-cover object-center scale-105 filter brightness-[0.75] contrast-[1.05]"
        />
        {/* Darkening & Rich Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#180A10]/85 via-[#1E0E15]/75 to-[#0F0508]/90 backdrop-blur-[2px]" />
        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Tombol Kembali ke Landing Page */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-semibold text-[#FFFDF8] shadow-lg transition-all duration-200 hover:bg-black/60 hover:border-[#C4487A] hover:text-[#FFFDF8] hover:-translate-x-0.5 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 text-[#E6A15C]" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* HEADER LOGO & TITLE */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-3.5 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 backdrop-blur-md p-2 shadow-2xl border border-white/50 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo_simantri.png"
              alt="Logo SIMANTRI"
              width={54}
              height={54}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
          Daftar Akun SIMANTRI
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#F5F0EB]/85 drop-shadow-sm font-medium">
          Ekosistem terpercaya data pertanian bawang merah Nganjuk
        </p>
      </div>

      {/* FROSTED GLASS CONTAINER */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg z-10">
        <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-9 shadow-2xl rounded-3xl border border-white/60">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/25 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#8C3A3A] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#8C3A3A] font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-[#3A5A40]/10 border border-[#3A5A40]/25 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3A5A40] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-[#3A5A40] font-medium leading-relaxed">
                  {successMessage}
                </p>
                <Link
                  href="/login"
                  className="mt-2 inline-block text-xs font-bold text-[#C4487A] hover:underline"
                >
                  Lanjut ke Halaman Masuk &rarr;
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs sm:text-sm font-semibold text-[#4A3A32] mb-1"
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
                className="w-full p-2.5 sm:p-3 rounded-xl border border-[#E5DFD6] bg-white/80 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-[#8A8580] focus:outline-none focus:border-[#C4487A] focus:ring-2 focus:ring-[#C4487A]/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-[#4A3A32] mb-1"
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
                className="w-full p-2.5 sm:p-3 rounded-xl border border-[#E5DFD6] bg-white/80 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-[#8A8580] focus:outline-none focus:border-[#C4487A] focus:ring-2 focus:ring-[#C4487A]/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-[#4A3A32] mb-1"
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
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-[#E5DFD6] bg-white/80 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-[#8A8580] focus:outline-none focus:border-[#C4487A] focus:ring-2 focus:ring-[#C4487A]/20 transition-all shadow-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8580] hover:text-[#4A3A32] focus:outline-none transition-colors"
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
                  className="block text-xs sm:text-sm font-semibold text-[#4A3A32] mb-1"
                >
                  Peran / Profesi
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'petani' | 'penyuluh')}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-[#E5DFD6] bg-white/90 text-xs sm:text-sm font-semibold text-[#0E080A] focus:outline-none focus:border-[#C4487A] shadow-xs"
                >
                  <option value="petani">🌾 Petani Bawang</option>
                  <option value="penyuluh">📋 Penyuluh Pertanian (Resmi)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="village"
                  className="block text-xs sm:text-sm font-semibold text-[#4A3A32] mb-1"
                >
                  Kecamatan / Wilayah
                </label>
                <select
                  id="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-[#E5DFD6] bg-white/90 text-xs sm:text-sm text-[#0E080A] focus:outline-none focus:border-[#C4487A] shadow-xs"
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
              <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#2A5A70]/10 via-white/80 to-[#2A5A70]/5 border border-[#2A5A70]/30 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <BadgeCheck className="w-5 h-5 text-[#2A5A70] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0E080A]">
                      Verifikasi Identitas Penyuluh Pertanian
                    </h4>
                    <p className="text-[11px] text-[#4A3A32] leading-relaxed">
                      Sesuai standar ekosistem terpercaya (*Trusted Ecosystem*), akun Penyuluh memerlukan validasi dokumen resmi sebelum hak validasi lapangan diberikan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="nip"
                      className="block text-[11px] font-semibold text-[#4A3A32] mb-1"
                    >
                      NIP / No. Registrasi KTA <span className="text-[#A6304F]">*</span>
                    </label>
                    <input
                      id="nip"
                      type="text"
                      required
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="Contoh: 198503152010011002"
                      className="w-full p-2 rounded-xl border border-[#E5DFD6] bg-white text-xs placeholder-[#8A8580] focus:outline-none focus:border-[#2A5A70]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="institution"
                      className="block text-[11px] font-semibold text-[#4A3A32] mb-1"
                    >
                      Instansi / BPP Penugasan <span className="text-[#A6304F]">*</span>
                    </label>
                    <select
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#E5DFD6] bg-white text-xs text-[#0E080A] focus:outline-none focus:border-[#2A5A70]"
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
                  <label className="block text-[11px] font-semibold text-[#4A3A32] mb-1">
                    Unggah Dokumen Bukti (KTA / SK Dinas) <span className="text-[#A6304F]">*</span>
                  </label>
                  <div className="p-3 border-2 border-dashed border-[#2A5A70]/30 rounded-xl bg-white text-center hover:border-[#2A5A70] transition-colors relative">
                    <input
                      type="file"
                      id="docUpload"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      required={!docBase64}
                    />

                    {docFileName ? (
                      <div className="flex items-center justify-between gap-2 text-xs text-[#2A5A70] font-medium px-1">
                        <span className="flex items-center gap-1.5 truncate">
                          <FileCheck className="w-4 h-4 text-[#3A5A40]" />
                          {docFileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDocBase64(null)
                            setDocFileName(null)
                          }}
                          className="p-1 text-[#8C3A3A] hover:bg-[#8C3A3A]/10 rounded-full"
                          title="Hapus Dokumen"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="docUpload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1 py-1"
                      >
                        <Upload className="w-5 h-5 text-[#2A5A70]" />
                        <span className="text-xs font-semibold text-[#2A5A70]">
                          Pilih Foto KTA / Dokumen SK
                        </span>
                        <span className="text-[10px] text-[#8A8580]">
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
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A1F2B] via-[#8A2D50] to-[#C4487A] hover:from-[#3D1823] hover:to-[#A83A68] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C4487A]/25 transition-all active:scale-95 disabled:opacity-50"
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

          <div className="mt-6 pt-4 border-t border-[#E5DFD6]/80 text-center text-xs sm:text-sm text-[#4A3A32]">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-bold text-[#C4487A] hover:text-[#A83A68] hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
