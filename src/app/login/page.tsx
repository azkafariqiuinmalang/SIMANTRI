'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

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
    <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FBF4EE]">
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
          Kompetisi Web Development: &ldquo;NextGen Secure: Building the Future of Trusted Web Ecosystems&rdquo;
        </div>
      </div>
    </div>
  )
}
