'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
            ? 'Email atau kata sandi tidak cocok. Silakan periksa kembali penulisan email dan kata sandi Anda.'
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
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* NATURAL BACKGROUND IMAGE (NO BLACK OVERLAY) */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/bg_tugu_bawang.jpg"
          alt="Tugu Bawang Merah Nganjuk"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* TOMBOL KEMBALI KE BERANDA (FROSTED PILL) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-white/35 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 text-white" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* FROSTED GLASS CONTAINER (MATCHING REFERENCE IMAGE) */}
      <div className="w-full max-w-md my-auto z-10">
        <div className="relative rounded-3xl border border-white/40 bg-white/20 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-7 sm:p-10 flex flex-col items-center text-center">
          {/* LOGO */}
          <Link href="/" className="mb-3 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 backdrop-blur-md p-2 shadow-lg border border-white/60 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/logo_simantri.png"
                alt="Logo SIMANTRI"
                width={50}
                height={50}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>

          {/* TITLE & SUBTITLE */}
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
            Masuk ke SIMANTRI
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-white/90 drop-shadow max-w-xs leading-relaxed font-medium">
            Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk
          </p>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="w-full mt-4 p-3 rounded-xl bg-red-600/30 backdrop-blur-md border border-red-300/40 text-left flex items-start gap-2.5 text-white">
              <AlertCircle className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">{errorMessage}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="w-full mt-6 space-y-4 text-left">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-white/95 mb-1 drop-shadow-sm"
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
                className="w-full p-3 rounded-xl border border-white/40 bg-white/85 backdrop-blur-md text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4487A] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-white/95 drop-shadow-sm"
                >
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl border border-white/40 bg-white/85 backdrop-blur-md text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4487A] focus:border-transparent transition-all shadow-sm pr-10"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8A2D50] via-[#A83A68] to-[#C4487A] hover:brightness-110 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-6 pt-4 border-t border-white/20 w-full text-center text-xs text-white/90 drop-shadow-sm font-medium">
            Belum memiliki akun?{' '}
            <Link
              href="/register"
              className="font-bold text-white underline underline-offset-2 hover:text-[#FFD0E0] transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
