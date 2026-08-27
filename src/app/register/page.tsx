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
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Upload,
  X,
  BadgeCheck,
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

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
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
          msg = 'Batas pengiriman email sistem pendaftaran sementara telah tercapai (Supabase Rate Limit). Silakan gunakan Akun Demo di halaman Masuk.'
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
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FBF4EE]">
      {/* Tombol Kembali ke Landing Page */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#E5DFD6] bg-white/85 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm font-semibold text-[#4A3A32] shadow-sm transition-all duration-200 hover:bg-white hover:border-[#A6304F]/40 hover:text-[#A6304F] hover:-translate-x-0.5 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 text-[#A6304F]" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 shadow-lg border border-[#E5DFD6] flex items-center justify-center group-hover:scale-105 transition-transform">
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
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E080A] tracking-tight">
          Daftar Akun SIMANTRI
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#4A3A32]">
          Ekosistem terpercaya data pertanian bawang merah Nganjuk
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card-standard p-6 sm:p-8 shadow-lg border border-[#E5DFD6]">
          {errorMessage && (
            <div className="mb-5 p-4 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#8C3A3A] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#8C3A3A] font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-4 rounded-xl bg-[#3A5A40]/10 border border-[#3A5A40]/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3A5A40] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-[#3A5A40] font-medium leading-relaxed">
                  {successMessage}
                </p>
                <Link
                  href="/login"
                  className="mt-2 inline-block text-xs font-semibold text-[#C4487A] hover:underline"
                >
                  Lanjut ke Halaman Masuk &rarr;
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs sm:text-sm font-medium text-[#4A3A32] mb-1"
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
                className="w-full input-standard text-xs sm:text-sm placeholder-[#8A8580]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-[#4A3A32] mb-1"
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
                className="w-full input-standard text-xs sm:text-sm placeholder-[#8A8580]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-[#4A3A32] mb-1"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full input-standard text-xs sm:text-sm placeholder-[#8A8580]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  htmlFor="role"
                  className="block text-xs sm:text-sm font-medium text-[#4A3A32] mb-1"
                >
                  Peran / Profesi
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'petani' | 'penyuluh')}
                  className="w-full input-standard text-xs sm:text-sm bg-white font-medium"
                >
                  <option value="petani">🌾 Petani Bawang</option>
                  <option value="penyuluh">📋 Penyuluh Pertanian (Resmi)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="village"
                  className="block text-xs sm:text-sm font-medium text-[#4A3A32] mb-1"
                >
                  Kecamatan / Wilayah
                </label>
                <select
                  id="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full input-standard text-xs sm:text-sm bg-white"
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
              <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#2A5A70]/10 via-[#FBF4EE] to-[#2A5A70]/5 border border-[#2A5A70]/30 space-y-3.5 animate-fadeIn">
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
                      className="w-full input-standard text-xs placeholder-[#8A8580] bg-white"
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
                      className="w-full input-standard text-xs bg-white"
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
                className="w-full btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm font-semibold transition-all active:scale-95"
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

          <div className="mt-6 pt-4 border-t border-[#E5DFD6] text-center text-xs sm:text-sm text-[#4A3A32]">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#C4487A] hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
