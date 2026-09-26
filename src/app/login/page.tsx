'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react'

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
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-3.5 group">
          <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-md p-2 shadow-2xl border border-white/50 flex items-center justify-center group-hover:scale-105 transition-transform">
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
          Masuk ke SIMANTRI
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#F5F0EB]/85 drop-shadow-sm font-medium">
          Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk
        </p>
      </div>

      {/* FROSTED GLASS CONTAINER */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl rounded-3xl border border-white/60">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/25 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#8C3A3A] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#8C3A3A] font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-[#4A3A32] mb-1.5"
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
                className="w-full p-3 rounded-xl border border-[#E5DFD6] bg-white/80 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-[#8A8580] focus:outline-none focus:border-[#C4487A] focus:ring-2 focus:ring-[#C4487A]/20 transition-all shadow-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-semibold text-[#4A3A32]"
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
                  className="w-full p-3 rounded-xl border border-[#E5DFD6] bg-white/80 focus:bg-white text-xs sm:text-sm text-[#0E080A] placeholder-[#8A8580] focus:outline-none focus:border-[#C4487A] focus:ring-2 focus:ring-[#C4487A]/20 transition-all shadow-xs pr-10"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A1F2B] via-[#8A2D50] to-[#C4487A] hover:from-[#3D1823] hover:to-[#A83A68] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C4487A]/25 transition-all active:scale-95 disabled:opacity-50"
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

          <div className="mt-6 pt-5 border-t border-[#E5DFD6]/80 text-center text-xs sm:text-sm text-[#4A3A32]">
            Belum memiliki akun?{' '}
            <Link
              href="/register"
              className="font-bold text-[#C4487A] hover:text-[#A83A68] hover:underline"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
