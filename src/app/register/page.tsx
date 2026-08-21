'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Sprout, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

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

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'petani' | 'penyuluh'>('petani')
  const [village, setVillage] = useState('Sukomoro')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
          },
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setLoading(false)
        return
      }

      if (data.session) {
        // Otomatis login jika email confirmation dimatikan di Supabase
        router.push('/dashboard')
        router.refresh()
      } else {
        setSuccessMessage(
          'Pendaftaran berhasil! Akun Anda telah dibuat. Silakan masuk.'
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FBF4EE]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-xl bg-[#4A1F2B] text-[#FBF4EE] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sprout className="w-7 h-7 text-[#E6A15C]" />
          </div>
        </Link>
        <h2 className="text-3xl font-serif font-bold text-[#0E080A] tracking-tight">
          Daftar Akun SIMANTRI
        </h2>
        <p className="mt-2 text-sm text-[#4A3A32]">
          Bergabung dengan ekosistem pertanian bawang merah Nganjuk berbasis data
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="card-standard p-8 sm:p-10 shadow-lg border border-[#E5DFD6]">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-[#8C3A3A]/10 border border-[#8C3A3A]/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#8C3A3A] shrink-0 mt-0.5" />
              <p className="text-sm text-[#8C3A3A] font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-[#3A5A40]/10 border border-[#3A5A40]/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3A5A40] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#3A5A40] font-medium leading-relaxed">
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
                className="block text-sm font-medium text-[#4A3A32] mb-1"
              >
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Pak Budi Santoso"
                className="w-full input-standard text-sm placeholder-[#8A8580]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#4A3A32] mb-1"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full input-standard text-sm placeholder-[#8A8580]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#4A3A32] mb-1"
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
                className="w-full input-standard text-sm placeholder-[#8A8580]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-[#4A3A32] mb-1"
                >
                  Peran / Profesi
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'petani' | 'penyuluh')}
                  className="w-full input-standard text-sm bg-white"
                >
                  <option value="petani">Petani Bawang</option>
                  <option value="penyuluh">Penyuluh Pertanian</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="village"
                  className="block text-sm font-medium text-[#4A3A32] mb-1"
                >
                  Kecamatan / Wilayah
                </label>
                <select
                  id="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full input-standard text-sm bg-white"
                >
                  {NGANJUK_VILLAGES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5DFD6] text-center text-sm text-[#4A3A32]">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-medium text-[#C4487A] hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
