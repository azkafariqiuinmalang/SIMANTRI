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
  RefreshCw,
  Cpu,
  Globe,
  Database,
  Radio,
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
  const [syncingToday, setSyncingToday] = useState(false)
  const [syncingBackfill, setSyncingBackfill] = useState(false)
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

  // Handle Manual Price Submission
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

  // Handle Triggering PIHPS Scraper (Today)
  const handleSyncToday = async () => {
    setSyncingToday(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/market/sync-pihps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'today' }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        setErrorMessage(json.error?.message || 'Gagal sinkronisasi data dari PIHPS.')
        return
      }

      const syncedItem = json.data?.results?.[0]
      const pred = json.data?.prediction

      setSuccessMessage(
        `Sinkronisasi PIHPS Hari Ini Berhasil! Harga Jatim/Nganjuk: Rp ${Number(
          syncedItem?.jatim_price || 0
        ).toLocaleString('id-ID')} (${syncedItem?.regional_count || 0} provinsi). ${
          pred ? `Prakiraan XGBoost besok: Rp ${Number(pred.predicted_price).toLocaleString('id-ID')}` : ''
        }`
      )
      await fetchPriceHistory()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan'
      setErrorMessage(msg)
    } finally {
      setSyncingToday(false)
    }
  }

  // Handle Triggering PIHPS Scraper (30 Days Backfill)
  const handleSyncBackfill = async () => {
    if (!confirm('Apakah Anda yakin ingin menyinkronkan 30 hari data historis dari PIHPS? Proses ini membutuhkan waktu beberapa detik.')) {
      return
    }

    setSyncingBackfill(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/market/sync-pihps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'backfill', days: 30 }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        setErrorMessage(json.error?.message || 'Gagal backfill data PIHPS.')
        return
      }

      setSuccessMessage(
        `Berhasil menyinkronkan ${json.data?.synced_count || 0} hari data historis dari PIHPS dan memperbarui prediksi XGBoost!`
      )
      await fetchPriceHistory()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan'
      setErrorMessage(msg)
    } finally {
      setSyncingBackfill(false)
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
                Pusat Integrasi Harga Pasar & Scraper
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
        {/* Global Notifications */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#8C3A3A] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#8C3A3A] font-medium leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#3A5A40]/10 border border-[#3A5A40]/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#3A5A40] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#3A5A40] font-medium leading-relaxed">
              {successMessage}
            </p>
          </div>
        )}

        {/* TOP BANNER: AUTOMATED SCRAPER & XGBOOST PIPELINE */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#4A1F2B] to-[#2D131B] text-white shadow-md border border-[#E5DFD6]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#3A5A40] text-emerald-100 mb-1">
                <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                Pipeline Scraper PIHPS Bank Indonesia Aktif
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#FBF4EE]">
                Sinkronisasi Otomatis & XGBoost Forecasting
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Sistem secara otomatis mengambil harga Bawang Merah Produsen dari PIHPS BI setiap pukul 00:00 WIB, mencatat data cuaca Open-Meteo, dan memicu kalkulasi 23 fitur XGBoost untuk memprediksi harga besok.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSyncToday}
                disabled={syncingToday || syncingBackfill}
                className="px-4 py-2.5 rounded-xl bg-[#E6A15C] text-[#0E080A] hover:bg-[#d69049] transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {syncingToday ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sinkronisasi...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Scrape PIHPS Hari Ini</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSyncBackfill}
                disabled={syncingToday || syncingBackfill}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all text-xs sm:text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {syncingBackfill ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Backfill 30 Hari...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-[#E6A15C]" />
                    <span>Backfill 30 Hari</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Manual Input Fallback */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-standard p-6 sm:p-7 shadow-sm border border-[#E5DFD6]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#C4487A]/15 text-[#C4487A] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#0E080A]">
                  Override / Input Manual
                </h3>
              </div>
              <p className="text-xs text-[#4A3A32] leading-relaxed mb-5">
                Gunakan form ini hanya jika ada koreksi manual atau data pasar lokal khusus yang ingin diinput oleh Admin.
              </p>

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
                </div>

                <div>
                  <label
                    htmlFor="harga"
                    className="block text-xs font-semibold text-[#4A3A32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-[#C4487A]" />
                    Harga Produsen (IDR / Kg)
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
                      placeholder="Contoh: 15700"
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
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <CloudSun className="w-4 h-4 text-[#E6A15C]" />
                        <span>Simpan Manual</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Pipeline Info Card */}
            <div className="card-standard p-5 border border-[#E5DFD6] space-y-3 bg-white/70">
              <h4 className="text-xs font-bold text-[#0E080A] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#C4487A]" />
                Parameter Ingestion PIHPS
              </h4>
              <div className="space-y-1.5 text-xs text-[#4A3A32]">
                <div className="flex justify-between py-1 border-b border-[#E5DFD6]">
                  <span className="text-[#8A8580]">Komoditas</span>
                  <span className="font-medium">Bawang Merah Sedang (5_11)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5DFD6]">
                  <span className="text-[#8A8580]">Tipe Pasar</span>
                  <span className="font-medium">Produsen (Type 4)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5DFD6]">
                  <span className="text-[#8A8580]">Basis Prediksi</span>
                  <span className="font-medium">Jawa Timur & Nganjuk</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8A8580]">Engine Prediksi</span>
                  <span className="font-medium text-[#C4487A]">XGBoost v1 (MAPE 3.0%)</span>
                </div>
              </div>
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
                    <h3 className="text-base font-serif font-bold text-[#0E080A]">
                      Riwayat Harga Pasar di Database
                    </h3>
                    <p className="text-xs text-[#8A8580]">
                      Tabel <code className="font-mono">market_price</code> & integrasi otomatis PIHPS
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 bg-[#FBF4EE] rounded-lg border border-[#E5DFD6] text-[#4A3A32]">
                  Total: {prices.length} data
                </span>
              </div>

              {prices.length === 0 ? (
                <div className="text-center py-12 text-[#8A8580] bg-[#FBF4EE] rounded-xl border border-dashed border-[#E5DFD6]">
                  Belum ada data harga yang tersimpan. Klik tombol Scrape PIHPS di atas untuk mulai sinkronisasi.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#E5DFD6] text-[#8A8580] uppercase tracking-wider text-[11px] bg-[#FBF4EE]">
                        <th className="py-3 px-4 rounded-l-lg">Tanggal</th>
                        <th className="py-3 px-4">Harga / Kg</th>
                        <th className="py-3 px-4">Metode Sumber</th>
                        <th className="py-3 px-4 rounded-r-lg">Waktu Sync</th>
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
                            {p.source === 'scraping' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2A5A70]/10 text-[#2A5A70]">
                                <Globe className="w-3 h-3" />
                                Scraper PIHPS
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#3A5A40]/10 text-[#3A5A40]">
                                Manual Admin
                              </span>
                            )}
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
