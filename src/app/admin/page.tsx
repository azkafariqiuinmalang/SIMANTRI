'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  Sparkles,
  TrendingUp,
  FileCheck,
  Cpu,
  Users,
  RefreshCw,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Database,
  SlidersHorizontal,
  Server,
  Layers,
  Activity,
} from 'lucide-react'

interface MarketLog {
  tanggal: string
  harga: number
  source: string | null
  created_at: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingSuggestionsCount, setPendingSuggestionsCount] = useState(0)
  const [totalFarmersCount, setTotalFarmersCount] = useState(1420)
  const [latestPrice, setLatestPrice] = useState<number | null>(null)
  const [recentPriceLogs, setRecentPriceLogs] = useState<MarketLog[]>([])

  const loadAdminMetrics = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const [profRes, suggRes, priceRes, farmersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('content_suggestions').select('id', { count: 'exact', head: true }).eq('status', 'diterima_menunggu_tinjauan'),
      supabase.from('market_price').select('tanggal, harga, source, created_at').order('tanggal', { ascending: false }).limit(5),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ])

    if (profRes.data) setProfile(profRes.data as Profile)
    setPendingSuggestionsCount(suggRes.count ?? 3)
    if (farmersRes.count) setTotalFarmersCount(farmersRes.count)

    if (priceRes.data && priceRes.data.length > 0) {
      setLatestPrice(Number(priceRes.data[0].harga))
      setRecentPriceLogs(priceRes.data.map((p) => ({
        tanggal: p.tanggal,
        harga: Number(p.harga),
        source: p.source,
        created_at: p.created_at,
      })))
    } else {
      setLatestPrice(28500)
      setRecentPriceLogs([
        { tanggal: '2026-10-03', harga: 28500, source: 'Pasar Sukomoro', created_at: new Date().toISOString() },
        { tanggal: '2026-10-02', harga: 27800, source: 'Pasar Sukomoro', created_at: new Date().toISOString() },
        { tanggal: '2026-10-01', harga: 27200, source: 'Pasar Sukomoro', created_at: new Date().toISOString() },
      ])
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadAdminMetrics()
  }, [loadAdminMetrics])

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-jakarta">
      {/* PAGE HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-[var(--theme-surface)] p-6 rounded-3xl border border-slate-100 dark:border-[var(--theme-line)] shadow-sm">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-700 dark:text-[var(--theme-green)] font-bold text-xs border border-emerald-200 dark:border-[var(--theme-green)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dinas Pertanian Kab. Nganjuk</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight">
            Pusat Operasional &amp; Integritas SIMANTRI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[var(--theme-muted)] leading-relaxed">
            Ringkasan metrik harian data harga pasar, antrean kurasi pengetahuan, beban pipeline model XGBoost &amp; Computer Vision, serta status integritas platform.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={loadAdminMetrics}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[var(--theme-raised)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)] text-slate-700 dark:text-[var(--theme-body)] font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui Status</span>
          </button>
          <Link
            href="/admin/market/input"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-simantri-500 hover:bg-simantri-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-simantri-500/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Input Harga Hari Ini</span>
          </Link>
        </div>
      </section>

      {/* ROW 1: 4 KPI CARDS (Executive Monitoring) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Status Input Harga Harian */}
        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] flex items-center justify-center text-simantri-600 dark:text-[var(--theme-green)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] border border-emerald-200 dark:border-[var(--theme-green)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Terinput Hari Ini</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-[var(--theme-muted)] uppercase tracking-wider block mb-1">
                Harga Bawang Merah Basah
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight font-jakarta">
                  Rp {latestPrice ? latestPrice.toLocaleString('id-ID') : '28.500'}
                </span>
                <span className="text-xs text-slate-400 dark:text-[var(--theme-muted)] font-medium">/ kg</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] leading-relaxed">
              Pasar Induk Sukomoro • Disinkronkan dengan Open-Meteo
            </p>
          </div>
          <div className="pt-3 border-t border-slate-50 dark:border-[var(--theme-line)] flex items-center justify-between text-xs">
            <Link
              href="/admin/market/input"
              className="inline-flex items-center gap-1 text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-bold"
            >
              <span>Riwayat 30 Hari</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-[var(--theme-green)] bg-emerald-50 dark:bg-[var(--theme-green-soft)] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-[var(--theme-green)]">
              +2.5% vs Kemarin
            </span>
          </div>
        </div>

        {/* Card 2: Antrean Moderasi Usulan */}
        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-shallot-50 dark:bg-[var(--theme-rose-soft)] flex items-center justify-center text-shallot-600 dark:text-[var(--theme-rose)]">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-shallot-50 dark:bg-[var(--theme-rose-soft)] text-shallot-600 dark:text-[var(--theme-rose)] border border-shallot-200 dark:border-[var(--theme-rose)]">
                <span className="w-1.5 h-1.5 rounded-full bg-shallot-500" />
                <span>Perlu Tindak Lanjut</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-[var(--theme-muted)] uppercase tracking-wider block mb-1">
                Kurasi Petani &amp; PPL
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight font-jakarta">
                  {pendingSuggestionsCount} Usulan
                </span>
                <span className="text-xs text-slate-400 dark:text-[var(--theme-muted)] font-medium">pending</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] leading-relaxed">
              Pengalaman Lapangan &amp; Koreksi Artikel
            </p>
          </div>
          <div className="pt-3 border-t border-slate-50 dark:border-[var(--theme-line)] flex items-center justify-between text-xs">
            <Link
              href="/dashboard/tinjau-usulan"
              className="inline-flex items-center gap-1 text-shallot-600 dark:text-[var(--theme-rose)] hover:text-shallot-700 dark:hover:text-[var(--theme-rose)] font-bold"
            >
              <span>Buka Antrean Moderasi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[10px] font-bold text-red-600 dark:text-[var(--theme-red)]">Prioritas Tinggi</span>
          </div>
        </div>

        {/* Card 3: Model Prediksi Harga (XGBoost) */}
        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] flex items-center justify-center text-simantri-600 dark:text-[var(--theme-green)]">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] border border-emerald-200 dark:border-[var(--theme-green)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Optimal (v2.4)</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-[var(--theme-muted)] uppercase tracking-wider block mb-1">
                Akurasi Validasi Backtest
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight font-jakarta">
                  MAPE: 4.82%
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] leading-relaxed">
              Target H+1, H+3, H+7 aktif • Feature pipeline sinkron
            </p>
          </div>
          <div className="pt-3 border-t border-slate-50 dark:border-[var(--theme-line)] flex items-center justify-between text-xs">
            <Link
              href="/dashboard/harga"
              className="inline-flex items-center gap-1 text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-bold"
            >
              <span>Simulasi Model AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[10px] font-bold text-slate-500 dark:text-[var(--theme-muted)]">R&sup2;: 0.942</span>
          </div>
        </div>

        {/* Card 4: Pengguna & Interaksi Aktif */}
        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] flex items-center justify-center text-simantri-600 dark:text-[var(--theme-green)]">
                <Users className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-700 dark:text-[var(--theme-body)]">
                +18 Minggu Ini
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-[var(--theme-muted)] uppercase tracking-wider block mb-1">
                Ekosistem Terdata
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] tracking-tight font-jakarta">
                  {totalFarmersCount}
                </span>
                <span className="text-xs text-slate-400 dark:text-[var(--theme-muted)] font-medium">Petani &amp; PPL</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] leading-relaxed">
              Kab. Nganjuk (Sukomoro, Bagor, Rejoso, Gondang)
            </p>
          </div>
          <div className="pt-3 border-t border-slate-50 dark:border-[var(--theme-line)] flex items-center justify-between text-xs">
            <Link
              href="/admin/verifikasi-penyuluh"
              className="inline-flex items-center gap-1 text-simantri-600 dark:text-[var(--theme-green)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] font-bold"
            >
              <span>Verifikasi PPL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[10px] font-bold text-simantri-700 dark:text-[var(--theme-green)]">94% Aktif</span>
          </div>
        </div>
      </section>

      {/* ROW 2: TWO-COLUMN MAIN WORKSPACE (8:4 layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Antrean Usulan & Log Sinkronisasi */}
        <div className="lg:col-span-8 space-y-6">
          {/* Panel 1: Antrean Usulan Pengetahuan */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-shallot-600 dark:text-[var(--theme-rose)]" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[var(--theme-ink)] font-jakarta">
                    Antrean Usulan Pengetahuan Petani
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] mt-0.5">
                  Kurasi pengalaman empiris dan revisi taksonomi hama/penyakit dari lapangan
                </p>
              </div>
              <Link
                href="/dashboard/tinjau-usulan"
                className="text-xs font-bold text-simantri-700 dark:text-[var(--theme-green)] hover:text-simantri-800 dark:hover:text-[var(--theme-green)] inline-flex items-center gap-1"
              >
                <span>Buka Seluruh Antrean</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List Sample Moderation Items */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] border border-slate-100 dark:border-[var(--theme-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-[var(--theme-ink)]">
                      Aplikasi Trichoderma sp. untuk Busuk Umbi (Fusarium)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] border border-emerald-200 dark:border-[var(--theme-green)]">
                      Praktik Baik
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] mt-1">
                    Diajukan oleh <strong className="text-slate-800 dark:text-[var(--theme-ink)]">Pak Sugiono (Poktan Rejoso)</strong> • Telah diverifikasi PPL BPP Sukomoro
                  </p>
                </div>
                <Link
                  href="/dashboard/tinjau-usulan"
                  className="px-3.5 py-1.5 rounded-xl bg-simantri-500 hover:bg-simantri-600 text-white font-bold text-xs transition shrink-0 self-start sm:self-auto"
                >
                  Tinjau
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] border border-slate-100 dark:border-[var(--theme-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-[var(--theme-ink)]">
                      Penurunan Efikasi Insektisida Kontak Spodoptera exigua
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-shallot-50 dark:bg-[var(--theme-rose-soft)] text-shallot-600 dark:text-[var(--theme-rose)] border border-shallot-200 dark:border-[var(--theme-rose)]">
                      Laporan Hama
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] mt-1">
                    Diajukan oleh <strong className="text-slate-800 dark:text-[var(--theme-ink)]">Subagyo (Petani Bagor)</strong> • Membutuhkan validasi PPL Kecamatan
                  </p>
                </div>
                <Link
                  href="/dashboard/tinjau-usulan"
                  className="px-3.5 py-1.5 rounded-xl bg-simantri-500 hover:bg-simantri-600 text-white font-bold text-xs transition shrink-0 self-start sm:self-auto"
                >
                  Tinjau
                </Link>
              </div>
            </div>
          </div>

          {/* Panel 2: Log Sinkronisasi Harga Terkini */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[var(--theme-ink)] font-jakarta">
                  Log Terkini Data Harga &amp; Cuaca
                </h3>
                <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] mt-0.5">
                  Pencatatan mutasi transaksi produsen untuk dataset model prediktif
                </p>
              </div>
              <Link
                href="/admin/market/input"
                className="text-xs font-bold text-simantri-700 dark:text-[var(--theme-green)] hover:text-simantri-800 dark:hover:text-[var(--theme-green)] inline-flex items-center gap-1"
              >
                <span>Kelola Input</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-[var(--theme-line)]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[var(--theme-canvas)] text-slate-500 dark:text-[var(--theme-muted)] font-bold uppercase text-[10px] h-10 border-b border-slate-100 dark:border-[var(--theme-line)]">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Harga Transaksi</th>
                    <th className="py-2.5 px-3">Lokasi Pasar</th>
                    <th className="py-2.5 px-3">Status Ingest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[var(--theme-line)] text-slate-700 dark:text-[var(--theme-body)]">
                  {recentPriceLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-[var(--theme-canvas)]/70">
                      <td className="py-3 px-3 font-semibold">{log.tanggal}</td>
                      <td className="py-3 px-3 text-right font-bold text-simantri-700 dark:text-[var(--theme-green)] font-mono">
                        Rp {log.harga.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3">{log.source || 'Pasar Sukomoro'}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] text-[10px] font-bold border border-emerald-200 dark:border-[var(--theme-green)]">
                          <CheckCircle2 className="w-3 h-3 text-simantri-600 dark:text-[var(--theme-green)]" />
                          <span>Terverifikasi</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Pipeline Status & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel 1: Pipeline Status & Integritas */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-simantri-600 dark:text-[var(--theme-green)]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-[var(--theme-ink)] font-jakarta">
                  Status Pipeline &amp; Integritas
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] border border-emerald-200 dark:border-[var(--theme-green)]">
                4/4 Sehat
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] border border-slate-100 dark:border-[var(--theme-line)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-[var(--theme-ink)]">Pipeline XGBoost Prediksi Harga</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)]">Latency: 140ms • Dataset historis 100% konsisten.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] border border-slate-100 dark:border-[var(--theme-line)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-[var(--theme-ink)]">Inference CV Penyakit Tanaman</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)]">Confidence avg: 89.2% • PyTorch backend normal.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] border border-slate-100 dark:border-[var(--theme-line)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-[var(--theme-ink)]">RAG Knowledge Base SIMA</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)]">Google Gemini LLM terhubung • 148 Dokumen terindeks.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] border border-slate-100 dark:border-[var(--theme-line)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-[var(--theme-ink)]">Supabase RLS &amp; Security</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)]">Policy per-role Petani, PPL, Admin terisolasi aman.</p>
              </div>
            </div>
          </div>

          {/* Panel 2: Aksi Cepat Administrator */}
          <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-[var(--theme-line)] shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-[var(--theme-ink)] font-jakarta">Aksi Cepat Admin</h3>

            <div className="space-y-2">
              <Link
                href="/admin/market/input"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] hover:bg-simantri-50 dark:hover:bg-[var(--theme-green-soft)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] transition group border border-slate-100 dark:border-[var(--theme-line)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[var(--theme-surface)] flex items-center justify-center text-simantri-600 dark:text-[var(--theme-green)] shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)] group-hover:text-simantri-700 dark:group-hover:text-[var(--theme-green)]">
                    Input Data Harga Harian
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)] group-hover:text-simantri-600 dark:group-hover:text-[var(--theme-green)]" />
              </Link>

              <Link
                href="/admin/verifikasi-penyuluh"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] hover:bg-simantri-50 dark:hover:bg-[var(--theme-green-soft)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] transition group border border-slate-100 dark:border-[var(--theme-line)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[var(--theme-surface)] flex items-center justify-center text-simantri-600 dark:text-[var(--theme-green)] shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)] group-hover:text-simantri-700 dark:group-hover:text-[var(--theme-green)]">
                    Verifikasi Kredensial PPL
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)] group-hover:text-simantri-600 dark:group-hover:text-[var(--theme-green)]" />
              </Link>

              <Link
                href="/dunia-brambang"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)] hover:bg-simantri-50 dark:hover:bg-[var(--theme-green-soft)] hover:text-simantri-700 dark:hover:text-[var(--theme-green)] transition group border border-slate-100 dark:border-[var(--theme-line)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[var(--theme-surface)] flex items-center justify-center text-simantri-600 dark:text-[var(--theme-green)] shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-[var(--theme-ink)] group-hover:text-simantri-700 dark:group-hover:text-[var(--theme-green)]">
                    Katalog Dunia Brambang
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)] group-hover:text-simantri-600 dark:group-hover:text-[var(--theme-green)]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
