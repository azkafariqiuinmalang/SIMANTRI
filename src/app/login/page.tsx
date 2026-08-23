'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(
          error.message === 'Invalid login credentials'
            ? 'Email atau kata sandi tidak cocok. Silakan coba lagi.'
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

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FBF4EE]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg border border-[#E5DFD6] flex items-center justify-center group-hover:scale-105 transition-transform">
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
        <h2 className="text-3xl font-serif font-bold text-[#0E080A] tracking-tight">
          Masuk ke SIMANTRI
        </h2>
        <p className="mt-2 text-sm text-[#4A3A32]">
          Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#4A3A32] mb-1.5"
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
                className="w-full input-standard text-sm placeholder-[#8A8580]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#4A3A32]"
                >
                  Kata Sandi
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full input-standard text-sm placeholder-[#8A8580]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-[#E5DFD6]">
            <p className="text-xs font-semibold text-[#8A8580] uppercase tracking-wider mb-2 text-center">
              Pilih Akun Demo untuk Pengujian Cepat:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin.simantri@gmail.com')
                  setPassword('Simantri123!')
                }}
                className="py-1.5 px-2 rounded-lg bg-[#E6A15C]/15 hover:bg-[#E6A15C]/30 text-[#0E080A] text-xs font-semibold border border-[#E6A15C]/40 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('penyuluh.simantri@gmail.com')
                  setPassword('Simantri123!')
                }}
                className="py-1.5 px-2 rounded-lg bg-[#3A5A40]/15 hover:bg-[#3A5A40]/30 text-[#3A5A40] text-xs font-semibold border border-[#3A5A40]/30 transition-colors"
              >
                Penyuluh
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('petani.simantri@gmail.com')
                  setPassword('Simantri123!')
                }}
                className="py-1.5 px-2 rounded-lg bg-[#C4487A]/15 hover:bg-[#C4487A]/30 text-[#C4487A] text-xs font-semibold border border-[#C4487A]/30 transition-colors"
              >
                Petani
              </button>
            </div>
            <p className="text-[11px] text-[#8A8580] text-center mt-2">
              Kata sandi semua akun demo: <code className="font-mono bg-[#FBF4EE] px-1 py-0.5 rounded text-[#0E080A]">Simantri123!</code>
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E5DFD6] text-center text-sm text-[#4A3A32]">
            Belum memiliki akun?{' '}
            <Link
              href="/register"
              className="font-medium text-[#C4487A] hover:underline"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#8A8580]">
          Kompetisi Web Development — &ldquo;NextGen Secure: Building the Future of Trusted Web Ecosystems&rdquo;
        </div>
      </div>
    </div>
  )
}
