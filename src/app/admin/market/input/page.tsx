'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { MarketPrice, Profile } from '@/types/database'
import {
  Sprout,
  ArrowLeft,
  Calendar,
  DollarSign,
  CloudSun,
  CheckCircle2,
  AlertCircle,
  Loader2,
  History,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react'

export default function AdminMarketInputPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [prices, setPrices] = useState<MarketPrice[]>([])

  // Form State
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [harga, setHarga] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchPriceHistory = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('market_price')
      .select('id, tanggal, harga, source, input_by, created_at')
      .order('tanggal', { ascending: false })
      .limit(30)

    if (!error && data) {
      setPrices(data as MarketPrice[])
    }
  }, [])

  useEffect(() => {
    async function checkAuthAndLoad() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!prof || prof.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setProfile(prof as Profile)
      await fetchPriceHistory()
      setLoading(false)
    }

    checkAuthAndLoad()
  }, [router, fetchPriceHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const numHarga = Number(harga)
    if (!numHarga || numHarga <= 0) {
      setErrorMessage('Masukkan nominal harga bawang merah yang valid.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/market/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tanggal,
          harga: numHarga,
        }),
      })

      const resJson = await res.json()

      if (!res.ok || resJson.error) {
        setErrorMessage(
          resJson.error?.message || 'Gagal menyimpan harga harian.'
        )
        setSubmitting(false)
        return
      }

      setSuccessMessage(
        `Harga Rp ${numHarga.toLocaleString('id-ID')} untuk tanggal ${tanggal} berhasil disimpan. ${
          resJson.data?.weather_cached
            ? 'Data cuaca harian Open-Meteo juga berhasil disinkronkan ke cache.'
            : ''
        }`
      )
      setHarga('')
      await fetchPriceHistory()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan'
      setErrorMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF4EE]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#4A3A32]">
            Memverifikasi hak akses Admin...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF4EE] flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-[#E5DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg text-[#4A3A32] hover:bg-[#FBF4EE] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-[#4A1F2B] text-[#FBF4EE] flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-[#E6A15C]" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-[#0E080A] tracking-tight block leading-none">
                SIMANTRI Admin
              </span>
              <span className="text-[11px] text-[#8A8580] tracking-wider uppercase font-medium">
                Input Harga Pasar Harian
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6A15C] text-[#0E080A]">
              <ShieldAlert className="w-3.5 h-3.5" />
              Role: Admin ({profile?.full_name})
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Input Section */}
          <div className="lg:col-span-1">
            <div className="card-standard p-6 sm:p-7 shadow-sm border border-[#E5DFD6]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#C4487A]/15 text-[#C4487A] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-serif font-bold text-[#0E080A]">
                  Input Harga Bawang
                </h2>
              </div>
              <p className="text-xs text-[#4A3A32] leading-relaxed mb-6">
                Data harga harian manual ini akan menjadi bahan baku fitur
                Lag/MA pada model Machine Learning XGBoost untuk menghasilkan
                prakiraan harga.
              </p>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-lg bg-[#8C3A3A]/10 border border-[#8C3A3A]/20 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#8C3A3A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#8C3A3A] font-medium leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 p-3.5 rounded-lg bg-[#3A5A40]/10 border border-[#3A5A40]/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3A5A40] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#3A5A40] font-medium leading-relaxed">
                    {successMessage}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="tanggal"
                    className="block text-xs font-semibold text-[#4A3A32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C4487A]" />
                    Tanggal Pencatatan
                  </label>
                  <input
                    id="tanggal"
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full input-standard text-sm bg-white"
                  />
                  <span className="text-[11px] text-[#8A8580] mt-1 block">
                    *Jika tanggal sudah ada, data akan di-overwrite otomatis.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="harga"
                    className="block text-xs font-semibold text-[#4A3A32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-[#C4487A]" />
                    Harga Bawang Merah (IDR / Kg)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-[#8A8580]">
                      Rp
                    </span>
                    <input
                      id="harga"
                      type="number"
                      required
                      min={1000}
                      step={100}
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      placeholder="Contoh: 28500"
                      className="w-full input-standard pl-10 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm text-sm font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan & Fetch Cuaca...</span>
                      </>
                    ) : (
                      <>
                        <CloudSun className="w-4 h-4 text-[#E6A15C]" />
                        <span>Simpan Harga & Cuaca</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* History Table Section */}
          <div className="lg:col-span-2">
            <div className="card-standard p-6 sm:p-7 shadow-sm border border-[#E5DFD6]">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3A5A40]/15 text-[#3A5A40] flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#0E080A]">
                      Riwayat Harga Pasar (30 Hari Terakhir)
                    </h2>
                    <p className="text-xs text-[#8A8580]">
                      Tersimpan di tabel database <code className="font-mono">market_price</code>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 bg-[#FBF4EE] rounded-lg border border-[#E5DFD6] text-[#4A3A32]">
                  Total: {prices.length} data
                </span>
              </div>

              {prices.length === 0 ? (
                <div className="text-center py-12 text-[#8A8580] bg-[#FBF4EE] rounded-xl border border-dashed border-[#E5DFD6]">
                  Belum ada data harga yang diinput.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#E5DFD6] text-[#8A8580] uppercase tracking-wider text-[11px] bg-[#FBF4EE]">
                        <th className="py-3 px-4 rounded-l-lg">Tanggal</th>
                        <th className="py-3 px-4">Harga / Kg</th>
                        <th className="py-3 px-4">Sumber</th>
                        <th className="py-3 px-4 rounded-r-lg">Waktu Input</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DFD6]">
                      {prices.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FBF4EE]/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#0E080A]">
                            {new Date(p.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#C4487A]">
                            Rp {Number(p.harga).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#3A5A40]/10 text-[#3A5A40]">
                              {p.source}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#8A8580] text-xs">
                            {new Date(p.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
