'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Globe2,
  Info,
  Loader2,
  MapPin,
  Minus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { MetricCard, PageHeading, PriceLineChart } from '@/components/dashboard/DashboardUI'
import { createClient } from '@/lib/supabase/client'
import type { MarketPrice } from '@/types/database'

interface RegionalPriceItem {
  id: string
  tanggal: string
  prov_id: number
  provinsi: string
  komoditas: string
  harga: number
  harga_diff: string
  semua_provinsi: number
  percentage: number
}

interface Forecast {
  prediction_date: string
  predicted_price: number
  latest_market_price: number
  mape_at_training: number
  model_version: string
}

export default function PriceForecastPage() {
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [selectedHorizon, setSelectedHorizon] = useState(1)
  const [activeTab, setActiveTab] = useState<'forecast' | 'radar'>('forecast')
  const [history, setHistory] = useState<MarketPrice[]>([])
  const [regionalPrices, setRegionalPrices] = useState<RegionalPriceItem[]>([])
  const [loadingRegional, setLoadingRegional] = useState(false)
  const [forecast, setForecast] = useState<Forecast | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('market_price')
      .select('id, tanggal, harga, source, created_at')
      .order('tanggal', { ascending: false })
      .limit(30)

    if (!error && data) setHistory([...data].reverse() as MarketPrice[])
    setLoading(false)
  }, [])

  const loadRegionalPrices = useCallback(async () => {
    setLoadingRegional(true)
    try {
      const response = await fetch('/api/market/regional')
      const json = await response.json()
      if (json.data) setRegionalPrices(json.data)
    } catch (error) {
      console.error('Error fetching regional prices:', error)
    } finally {
      setLoadingRegional(false)
    }
  }, [])

  const handlePredict = async (daysAhead = 1) => {
    setSelectedHorizon(daysAhead)
    setPredicting(true)
    try {
      const targetDate = new Date(Date.now() + daysAhead * 86400000).toISOString().split('T')[0]
      const response = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_date: targetDate }),
      })
      const json = await response.json()
      if (json.data) setForecast(json.data)
    } catch (error) {
      console.error('Error generating forecast:', error)
    } finally {
      setPredicting(false)
    }
  }

  useEffect(() => {
    void (async () => {
      await loadData()
      await handlePredict(1)
      await loadRegionalPrices()
    })()
  }, [loadData, loadRegionalPrices])

  const latestPrice = history.at(-1)?.harga ? Number(history.at(-1)?.harga) : forecast?.latest_market_price ?? null
  const pricePoints = useMemo(() => history.map((item) => ({
    label: new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    value: Number(item.harga),
    source: item.source,
  })), [history])
  const stats = useMemo(() => {
    const prices = history.map((item) => Number(item.harga))
    if (prices.length === 0) return null
    return { min: Math.min(...prices), max: Math.max(...prices), average: Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length) }
  }, [history])
  const change = latestPrice && forecast ? ((forecast.predicted_price - latestPrice) / latestPrice) * 100 : null

  const refreshAll = () => {
    void loadData()
    void loadRegionalPrices()
    void handlePredict(selectedHorizon)
  }

  return (
    <main className="sim-page mx-auto w-full max-w-[1440px] space-y-6">
      <PageHeading
        title="Prediksi Harga"
        description="Pantau tren harga bawang merah dan jalankan prakiraan pada target tanggal yang tersedia."
        icon={TrendingUp}
        action={<div className="flex flex-wrap gap-2"><Link href="/dashboard/chat" className="sim-button-secondary"><Sparkles className="h-4 w-4" aria-hidden="true" />Tanya SIMA</Link><button type="button" onClick={refreshAll} disabled={loading || predicting} className="sim-button-secondary"><RefreshCw className={`h-4 w-4 ${loading || predicting ? 'animate-spin' : ''}`} aria-hidden="true" />Segarkan</button></div>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Harga terbaru" value={latestPrice ? `Rp ${latestPrice.toLocaleString('id-ID')}/kg` : 'Belum tersedia'} hint="Catatan pasar terbaru yang tersedia" icon={BarChart3} tone="green" />
        <MetricCard label={`Prediksi H+${selectedHorizon}`} value={forecast ? `Rp ${forecast.predicted_price.toLocaleString('id-ID')}/kg` : 'Belum tersedia'} hint={forecast ? new Date(forecast.prediction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Jalankan prediksi'} icon={Calendar} tone="green" />
        <MetricCard label="Perubahan target" value={change === null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`} hint="Dibanding harga terbaru" icon={change !== null && change < 0 ? ArrowDownRight : ArrowUpRight} tone={change !== null && change < 0 ? 'rose' : 'green'} />
        <MetricCard label="MAPE saat training" value={forecast && Number.isFinite(forecast.mape_at_training) ? `${forecast.mape_at_training.toFixed(1)}%` : '—'} hint={forecast?.model_version ? `Model ${forecast.model_version}` : 'Dikirim oleh endpoint prediksi'} icon={Award} tone="amber" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border border-[var(--sim-color-border)] bg-white p-1 shadow-sm" role="tablist" aria-label="Tampilan harga">
          <button type="button" role="tab" aria-selected={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')} className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition ${activeTab === 'forecast' ? 'bg-[var(--sim-color-primary)] text-white' : 'text-[var(--sim-color-body)] hover:bg-[var(--sim-green-50)]'}`}><Sparkles className="mr-2 inline h-4 w-4" aria-hidden="true" />Prediksi Nganjuk</button>
          <button type="button" role="tab" aria-selected={activeTab === 'radar'} onClick={() => setActiveTab('radar')} className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition ${activeTab === 'radar' ? 'bg-[var(--sim-green-900)] text-white' : 'text-[var(--sim-color-body)] hover:bg-[var(--sim-green-50)]'}`}><Globe2 className="mr-2 inline h-4 w-4" aria-hidden="true" />Radar wilayah</button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--sim-color-muted)]"><span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sim-green-100)] bg-[var(--sim-green-50)] px-3 py-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--sim-color-primary)]" aria-hidden="true" />Data produsen PIHPS</span><span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sim-amber-500)]/30 bg-[var(--sim-amber-50)] px-3 py-1.5"><Info className="h-3.5 w-3.5 text-[var(--sim-amber-500)]" aria-hidden="true" />Prediksi satu target tanggal</span></div>
      </div>

      {activeTab === 'forecast' ? (
        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <section className="sim-card p-5 sm:p-6" aria-labelledby="forecast-settings">
            <div className="flex items-center gap-3"><div className="sim-icon-tile"><Activity className="h-5 w-5" aria-hidden="true" /></div><div><h2 id="forecast-settings" className="font-bold text-[var(--sim-color-foreground)]">Pengaturan prediksi</h2><p className="text-xs text-[var(--sim-color-muted)]">Pilih satu target yang ingin dihitung.</p></div></div>
            <div className="mt-6 space-y-3"><p className="text-sm font-semibold text-[var(--sim-color-body)]">Target periode</p><div className="grid gap-2">{[1, 3, 7].map((days) => <button key={days} type="button" onClick={() => handlePredict(days)} disabled={predicting} className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-sm font-semibold transition ${selectedHorizon === days ? 'border-[var(--sim-color-primary)] bg-[var(--sim-green-50)] text-[var(--sim-color-primary)]' : 'border-[var(--sim-color-border)] text-[var(--sim-color-body)] hover:bg-[var(--sim-canvas)]'}`}><span>H+{days}</span><span className="text-xs font-normal text-[var(--sim-color-muted)]">{days === 1 ? 'Besok' : `${days} hari`}</span></button>)}</div></div>
            {predicting && <div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--sim-green-50)] p-3 text-xs text-[var(--sim-color-body)]" role="status"><Loader2 className="h-4 w-4 animate-spin text-[var(--sim-color-primary)]" aria-hidden="true" />Menghitung prediksi...</div>}
            <div className="mt-6 rounded-xl border border-[var(--sim-color-border)] bg-[var(--sim-canvas)] p-4 text-xs leading-5 text-[var(--sim-color-muted)]"><p className="font-semibold text-[var(--sim-color-body)]">Catatan kemampuan</p><p className="mt-1">Endpoint saat ini mengembalikan satu target tanggal per permintaan. Tidak ada seri 30/90 hari yang dibuat di frontend.</p></div>
          </section>

          <section className="sim-card min-w-0 p-5 sm:p-6" aria-labelledby="price-trend">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 id="price-trend" className="flex items-center gap-2 text-lg font-bold text-[var(--sim-color-foreground)]"><TrendingUp className="h-5 w-5 text-[var(--sim-color-primary)]" aria-hidden="true" />Tren harga historis</h2><p className="mt-1 text-sm text-[var(--sim-color-muted)]">Harga riil yang tersedia dari 30 catatan terakhir.</p></div><span className="rounded-full bg-[var(--sim-green-50)] px-3 py-1.5 text-xs font-semibold text-[var(--sim-color-primary)]">{history.length} catatan</span></div>
            <div className="mt-5"><PriceLineChart points={pricePoints} height={280} /></div>
            {stats && <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--sim-color-border)] pt-4 text-center text-xs"><div><p className="text-[var(--sim-color-muted)]">Terendah</p><p className="mt-1 font-bold text-[var(--sim-color-foreground)]">Rp {stats.min.toLocaleString('id-ID')}</p></div><div><p className="text-[var(--sim-color-muted)]">Rata-rata</p><p className="mt-1 font-bold text-[var(--sim-color-foreground)]">Rp {stats.average.toLocaleString('id-ID')}</p></div><div><p className="text-[var(--sim-color-muted)]">Tertinggi</p><p className="mt-1 font-bold text-[var(--sim-color-foreground)]">Rp {stats.max.toLocaleString('id-ID')}</p></div></div>}
          </section>

          <section className="sim-card p-5 sm:p-6 xl:col-span-2" aria-labelledby="forecast-summary"><div className="flex items-center gap-3"><div className="sim-icon-tile"><Calendar className="h-5 w-5" aria-hidden="true" /></div><div><h2 id="forecast-summary" className="font-bold text-[var(--sim-color-foreground)]">Ringkasan target</h2><p className="text-xs text-[var(--sim-color-muted)]">Hasil dari permintaan prediksi terakhir.</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-3">{[['Harga terbaru', latestPrice ? `Rp ${latestPrice.toLocaleString('id-ID')}/kg` : 'Belum tersedia'], ['Target tanggal', forecast ? new Date(forecast.prediction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum tersedia'], ['Harga target', forecast ? `Rp ${forecast.predicted_price.toLocaleString('id-ID')}/kg` : 'Belum tersedia']].map(([label, value]) => <div key={label} className="rounded-2xl bg-[var(--sim-canvas)] p-4"><p className="text-xs text-[var(--sim-color-muted)]">{label}</p><p className="mt-1 text-lg font-bold text-[var(--sim-color-foreground)]">{value}</p></div>)}</div></section>
        </div>
      ) : (
        <section className="space-y-4" aria-labelledby="regional-title">
          <div className="sim-card flex flex-col gap-3 bg-[var(--sim-green-50)] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 id="regional-title" className="flex items-center gap-2 font-bold text-[var(--sim-green-900)]"><Globe2 className="h-5 w-5" aria-hidden="true" />Radar harga wilayah</h2><p className="mt-1 text-sm text-[var(--sim-color-body)]">Bandingkan data produsen wilayah yang dikembalikan endpoint regional.</p></div>{latestPrice && <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[var(--sim-color-primary)]">Basis Nganjuk: Rp {latestPrice.toLocaleString('id-ID')}/kg</span>}</div>
          {loadingRegional ? <div className="sim-card flex min-h-56 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[var(--sim-color-primary)]" aria-label="Memuat radar" /></div> : regionalPrices.length === 0 ? <div className="sim-card flex min-h-56 flex-col items-center justify-center text-center"><Info className="h-7 w-7 text-[var(--sim-color-muted)]" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-[var(--sim-color-body)]">Data harga regional belum tersedia.</p></div> : <div className="sim-card overflow-hidden p-0"><div className="overflow-x-auto"><table className="min-w-[720px] w-full text-left text-sm"><thead className="bg-[var(--sim-canvas)] text-xs uppercase tracking-wide text-[var(--sim-color-muted)]"><tr><th className="px-5 py-4">Provinsi / wilayah</th><th className="px-5 py-4">Harga produsen</th><th className="px-5 py-4">Selisih vs Nganjuk</th><th className="px-5 py-4">Perubahan</th><th className="px-5 py-4">Observasi</th></tr></thead><tbody className="divide-y divide-[var(--sim-color-border)]">{regionalPrices.map((item) => { const diff = Number(item.harga) - (latestPrice ?? 0); const isJatim = item.prov_id === 16 || item.provinsi.toLowerCase().includes('jawa timur'); return <tr key={item.id} className="transition hover:bg-[var(--sim-green-50)]/50"><td className="px-5 py-4 font-semibold text-[var(--sim-color-foreground)]"><span className="inline-flex items-center gap-2"><MapPin className={`h-4 w-4 ${isJatim ? 'text-[var(--sim-color-primary)]' : 'text-[var(--sim-color-muted)]'}`} aria-hidden="true" />{item.provinsi}{isJatim && <span className="rounded-full bg-[var(--sim-green-100)] px-2 py-0.5 text-[10px] text-[var(--sim-color-primary)]">Basis</span>}</span></td><td className="px-5 py-4 font-bold text-[var(--sim-color-foreground)]">Rp {Number(item.harga).toLocaleString('id-ID')}</td><td className="px-5 py-4 text-xs">{isJatim ? <span className="text-[var(--sim-color-muted)]">—</span> : diff > 0 ? <span className="inline-flex items-center gap-1 font-semibold text-[var(--sim-color-primary)]"><ArrowUpRight className="h-4 w-4" aria-hidden="true" />+Rp {diff.toLocaleString('id-ID')}</span> : diff < 0 ? <span className="inline-flex items-center gap-1 font-semibold text-red-700"><ArrowDownRight className="h-4 w-4" aria-hidden="true" />-Rp {Math.abs(diff).toLocaleString('id-ID')}</span> : <span className="inline-flex items-center gap-1 text-[var(--sim-color-muted)]"><Minus className="h-4 w-4" aria-hidden="true" />Setara</span>}</td><td className="px-5 py-4 text-xs font-semibold text-[var(--sim-color-body)]">{item.harga_diff || 'Rp0'} ({item.percentage || 0}%)</td><td className="px-5 py-4 text-xs text-[var(--sim-color-muted)]">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td></tr> })}</tbody></table></div></div>}
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2"><div className="sim-card flex items-start gap-3 bg-[var(--sim-green-50)]"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sim-color-primary)]" aria-hidden="true" /><div><h2 className="font-bold text-[var(--sim-green-900)]">Cara membaca hasil</h2><p className="mt-1 text-sm leading-6 text-[var(--sim-color-body)]">Gunakan harga target dan perubahan sebagai bahan perencanaan. Kondisi pasar, cuaca, dan pasokan dapat mengubah hasil aktual.</p></div></div><div className="sim-card flex items-start gap-3 bg-[var(--sim-blue-50)]"><Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sim-blue-600)]" aria-hidden="true" /><div><h2 className="font-bold text-[var(--sim-color-foreground)]">Transparansi model</h2><p className="mt-1 text-sm leading-6 text-[var(--sim-color-body)]">Model dan MAPE hanya ditampilkan ketika dikembalikan oleh endpoint prediksi yang sedang digunakan.</p></div></div></div>
    </main>
  )
}
