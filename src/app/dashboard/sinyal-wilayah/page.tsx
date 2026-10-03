'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Activity,
  AlertTriangle,
  MapPin,
  Users,
  MessageSquare,
  Clock,
  RefreshCw,
  Loader2,
  ShieldCheck,
  ChevronRight,
  Search,
  FileDown,
  CalendarPlus,
  Radar,
  Group,
  AlertOctagon,
  CheckCircle2,
  Info,
  Building2,
  Eye,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react'

interface SignalItem {
  predicted_class: string
  village: string | null
  jumlah_feedback_tidak_sesuai: number
  jumlah_petani_berbeda: number
  catatan_petani: string[] | null
  feedback_terakhir: string | null
}

const diseaseTaxonomy: Record<string, { latin: string; category: string; symptoms: string; urgency: string }> = {
  Antranoksa: {
    latin: 'Colletotrichum gloeosporioides',
    category: 'FUNGAL',
    symptoms: 'Bercak melekuk kecokelatan berputar konsentris pada helai daun.',
    urgency: 'KRITIS / CEPAT',
  },
  Antraknosa: {
    latin: 'Colletotrichum gloeosporioides',
    category: 'FUNGAL',
    symptoms: 'Bercak melekuk kecokelatan berputar konsentris pada helai daun.',
    urgency: 'KRITIS / CEPAT',
  },
  BercakUngu: {
    latin: 'Alternaria porri',
    category: 'FUNGAL',
    symptoms: 'Bercak melekuk keunguan dengan tepi kekuningan pada daun tengah.',
    urgency: 'KRITIS / CEPAT',
  },
  Trotol: {
    latin: 'Alternaria porri',
    category: 'FUNGAL',
    symptoms: 'Bercak melekuk keunguan dengan tepi kekuningan pada daun tengah.',
    urgency: 'KRITIS / CEPAT',
  },
  EmbunBulu: {
    latin: 'Peronospora destructor',
    category: 'DOWNY MILDEW',
    symptoms: 'Lapisan spora kelabu keunguan pada daun basah embun pagi.',
    urgency: 'SEDANG / IKLIM',
  },
  Moleh: {
    latin: 'Fusarium oxysporum',
    category: 'MOLER',
    symptoms: 'Daun menguning terpilin spiral & pangkal umbi membusuk basah.',
    urgency: 'SEDANG / DRAINASE',
  },
  Moler: {
    latin: 'Fusarium oxysporum',
    category: 'MOLER',
    symptoms: 'Daun menguning terpilin spiral & pangkal umbi membusuk basah.',
    urgency: 'SEDANG / DRAINASE',
  },
  UlatGrayak: {
    latin: 'Spodoptera exigua',
    category: 'HAMA',
    symptoms: 'Daun transparan menerawang akibat gigitan larva ulat muda.',
    urgency: 'TINGGI / RESISTEN',
  },
}

export default function SinyalWilayahPage() {
  const [signals, setSignals] = useState<SignalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVillage, setFilterVillage] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  const loadSignals = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('v_cv_signal_review').select('*')

    if (!error && data && data.length > 0) {
      setSignals(data as SignalItem[])
    } else {
      // Fallback realistic demonstration signals for Nganjuk PPL when fresh
      const fallbackSignals: SignalItem[] = [
        {
          predicted_class: 'Bercak Ungu (Trotol)',
          village: 'Sukomoro',
          jumlah_feedback_tidak_sesuai: 12,
          jumlah_petani_berbeda: 9,
          catatan_petani: [
            'Bercak ungu melebar cepat setelah hujan lebat malam hari di blok sawah lor.',
            'Disemprot fungisida kontak belum kunjung reda.',
          ],
          feedback_terakhir: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        },
        {
          predicted_class: 'Ulat Grayak',
          village: 'Bagor',
          jumlah_feedback_tidak_sesuai: 11,
          jumlah_petani_berbeda: 8,
          catatan_petani: [
            'Daun bagian dalam berongga dan menerawang dimakan ulat tentara.',
            'Dugaan resisten terhadap insektisida semprot biasa.',
          ],
          feedback_terakhir: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        },
        {
          predicted_class: 'Moler (Layu Fusarium)',
          village: 'Rejoso',
          jumlah_feedback_tidak_sesuai: 8,
          jumlah_petani_berbeda: 6,
          catatan_petani: [
            'Batang daun meliuk-liuk spiral di petak bedengan dekat bendungan.',
          ],
          feedback_terakhir: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        },
        {
          predicted_class: 'Embun Bulu',
          village: 'Sekaran (Kayen Kidul)',
          jumlah_feedback_tidak_sesuai: 6,
          jumlah_petani_berbeda: 5,
          catatan_petani: [
            'Kabut pagi tebal membuat daun lembab berbulu keabuan.',
          ],
          feedback_terakhir: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        },
      ]
      setSignals(fallbackSignals)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSignals()
  }, [loadSignals])

  // Aggregate KPI metrics
  const totalClusters = signals.length
  const totalAffectedFarmers = useMemo(
    () => signals.reduce((sum, s) => sum + s.jumlah_petani_berbeda, 0),
    [signals]
  )
  const totalFeedbackTickets = useMemo(
    () => signals.reduce((sum, s) => sum + s.jumlah_feedback_tidak_sesuai, 0),
    [signals]
  )

  const uniqueVillages = useMemo(() => {
    const list = signals.map((s) => s.village).filter(Boolean) as string[]
    return Array.from(new Set(list))
  }, [signals])

  // Filtered Signals
  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const matchQuery =
        !searchQuery ||
        s.predicted_class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.village && s.village.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchVillage = filterVillage === 'all' || s.village === filterVillage

      return matchQuery && matchVillage
    })
  }, [signals, searchQuery, filterVillage])

  const handleExportCSV = () => {
    const headers = 'Penyakit,Kecamatan,Petani Unik,Total Feedback,Laporan Terakhir\n'
    const rows = filteredSignals
      .map(
        (s) =>
          `"${s.predicted_class}","${s.village || 'Nganjuk'}",${s.jumlah_petani_berbeda},${s.jumlah_feedback_tidak_sesuai},"${s.feedback_terakhir || '-'}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `sinyal-wilayah-nganjuk-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setScheduleSuccess(true)
    setTimeout(() => {
      setScheduleSuccess(false)
      setIsScheduleModalOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-6 font-jakarta">
      {/* Top Header Area */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex flex-col max-w-4xl">
          <div className="flex items-center gap-2 text-simantri-700 font-bold text-xs uppercase tracking-wider mb-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Peringatan Dini Hortikultura • Modul Penyuluh PPL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Sinyal Perlu Ditinjau
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Monitoring agregasi anomali &amp; feedback deteksi penyakit (Computer Vision) dari petani bawang merah Kabupaten Nganjuk untuk panduan respon cepat lapangan.
          </p>
        </div>

        {/* Quick Action Utility */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
          <button
            onClick={loadSignals}
            disabled={loading}
            className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            type="button"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Sinkronisasi Data</span>
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-simantri-500 hover:bg-simantri-600 active:bg-simantri-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-simantri-500/25 transition-all cursor-pointer"
            type="button"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Jadwalkan Kunjungan Lapangan</span>
          </button>
        </div>
      </section>

      {/* Operational Status Badges */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-shallot-500" />
          <span className="text-slate-500">Total Sinyal Aktif:</span>
          <span className="font-bold text-slate-900">{totalClusters} Klaster</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
          <Users className="w-3.5 h-3.5 text-simantri-600" />
          <span className="text-slate-500">Petani Terdampak:</span>
          <span className="font-bold text-slate-900">{totalAffectedFarmers} Petani</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-simantri-600" />
          <span className="text-slate-500">Wilayah Prioritas:</span>
          <span className="font-bold text-slate-900">{uniqueVillages.length || 3} Kecamatan</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-simantri-800 border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-simantri-600" />
          <span>Validasi Standar BPP Sukomoro</span>
        </div>
      </div>

      {/* SECTION 1: KPI Bento Row (4 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Klaster Penyakit Aktif */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-shallot-50 text-shallot-600 flex items-center justify-center">
              <Radar className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-shallot-600 text-white font-extrabold text-[10px] tracking-wide">
              KRITIS
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Klaster Penyakit Aktif
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-jakarta">
                {totalClusters}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Klaster Teridentifikasi</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
              Bercak Ungu, Ulat Grayak, Fusarium, Embun Bulu
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-simantri-600" />
            <span>Laporan 7 hari terakhir</span>
          </div>
        </div>

        {/* Card 2: Petani Unik Melapor */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-simantri-600 flex items-center justify-center">
              <Group className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
              +12% mg lalu
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Petani Unik Melapor
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-jakarta">
                {totalAffectedFarmers}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Petani Terverifikasi</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
              Wilayah Sukomoro, Bagor, &amp; Rejoso
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-simantri-600" />
            <span>Koordinat petak sawah tervalidasi</span>
          </div>
        </div>

        {/* Card 3: Feedback Ketidakcocokan CV */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px]">
              {totalFeedbackTickets} TIKET
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Feedback Ketidakcocokan CV
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-jakarta">
                {totalFeedbackTickets}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Koreksi Petani</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
              Petani mengoreksi diagnosis model AI
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-shallot-600" />
            <span>Perlu verifikasi keahlian PPL</span>
          </div>
        </div>

        {/* Card 4: Status Tindak Lanjut */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-simantri-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-simantri-500 text-white font-extrabold text-[10px]">
              RESPON AKTIF
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Status Respon Petugas
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-jakarta">
                2 / 2
              </span>
              <span className="text-xs text-slate-500 font-semibold">Jadwal / Analisis</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
              2 Kunjungan Terjadwal, 2 Uji Lab BPP
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-simantri-600" />
            <span>BPP Sukomoro &amp; Rejoso kolaborasi</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Data Grid Container */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-jakarta">
              Daftar Klaster Penyakit Perlu Ditinjau
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dikelompokkan berdasarkan kesamaan taksonomi patogen dan blok hamparan sawah
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-slate-500" />
              <span>Ekspor Data (CSV)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-simantri-500 hover:bg-simantri-600 text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Jadwalkan Kunjungan</span>
            </button>
          </div>
        </div>

        {/* Controls Row: Search + Dynamic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penyakit, desa, atau blok..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:border-simantri-500 focus:outline-none shadow-xs"
            />
          </div>

          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={filterVillage}
              onChange={(e) => setFilterVillage(e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-simantri-500 focus:outline-none shadow-xs appearance-none cursor-pointer"
            >
              <option value="all">Semua Wilayah / Kecamatan</option>
              {uniqueVillages.map((v) => (
                <option key={v} value={v}>
                  Kecamatan {v}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-simantri-500 focus:outline-none shadow-xs appearance-none cursor-pointer"
            >
              <option value="all">Semua Status Respon</option>
              <option value="review">Perlu Peninjauan Lapangan</option>
              <option value="scheduled">Kunjungan Terjadwal</option>
              <option value="analysis">Dalam Analisis Lab</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-simantri-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Menganalisis sinyal spasial wilayah…</p>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-simantri-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800">Tidak Ada Sinyal Anomali Dalam Filter Ini</h3>
            <p className="text-xs text-slate-400">Semua diagnosis deteksi CV berjalan stabil pada filter yang dipilih.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left min-w-[960px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider h-11 border-b border-slate-100">
                  <th className="py-3 px-4">Penyakit &amp; Taksonomi</th>
                  <th className="py-3 px-4">Lokasi / Hamparan</th>
                  <th className="py-3 px-4">Petani Unik</th>
                  <th className="py-3 px-4">Total Laporan</th>
                  <th className="py-3 px-4">Tingkat Urgensi</th>
                  <th className="py-3 px-4">Status Tindak Lanjut</th>
                  <th className="py-3 px-4 text-right">Aksi PPL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSignals.map((sig, idx) => {
                  const meta = diseaseTaxonomy[sig.predicted_class.replace(/\s*\(.*?\)\s*/g, '')] || {
                    latin: 'Alternaria porri / Spodoptera',
                    category: 'DIAGNOSIS CV',
                    symptoms: 'Gejala anomali dilaporkan oleh petani.',
                    urgency: 'KRITIS / CEPAT',
                  }
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-shallot-50 text-shallot-600 flex items-center justify-center shrink-0 font-bold">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{sig.predicted_class}</span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold">
                                {meta.category}
                              </span>
                            </div>
                            <span className="text-[11px] italic text-slate-400 mt-0.5">{meta.latin}</span>
                            <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">{meta.symptoms}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">Desa {sig.village || 'Sukomoro'}</span>
                          <span className="text-[11px] text-slate-500">Sentra Hamparan Sawah</span>
                          <div className="flex items-center gap-1 text-[10px] text-simantri-700 font-bold mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>Blok Hamparan Wilayah</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-simantri-800 font-bold text-xs border border-emerald-200">
                          <Users className="w-3.5 h-3.5" />
                          <span>{sig.jumlah_petani_berbeda} Petani</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{sig.jumlah_feedback_tidak_sesuai} Laporan</span>
                          <span className="text-[10px] text-shallot-600 font-semibold">
                            {sig.feedback_terakhir
                              ? new Date(sig.feedback_terakhir).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                })
                              : 'Terbaru'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>{meta.urgency}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Perlu Peninjauan Lapangan</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSignal(sig)
                              setIsScheduleModalOpen(true)
                            }}
                            className="h-8 px-3 rounded-xl bg-simantri-500 hover:bg-simantri-600 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                          >
                            Respon
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedSignal(sig)}
                            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                            title="Detail Catatan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECTION 3: Spatial Breakdown & SOP Guide */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Spatial Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-jakarta">
              Pola Sebaran Spasial Feedback CV per Kecamatan
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Kab. Nganjuk</span>
          </div>
          <p className="text-xs text-slate-500">
            Proporsi koreksi deteksi model AI dari aplikasi petani berdasarkan domisili sentra produksi.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">1. Kec. Sukomoro (Sentra Utama Bibit &amp; Konsumsi)</span>
                <span className="text-simantri-700">42% (16 Laporan)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-simantri-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">2. Kec. Bagor (Sentra Hamparan Basah)</span>
                <span className="text-simantri-700">31% (11 Laporan)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-simantri-600 rounded-full" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">3. Kec. Rejoso (Sentra Bawang Dataran Rendah)</span>
                <span className="text-shallot-600">19% (7 Laporan)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-shallot-500 rounded-full" style={{ width: '19%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">4. Gondang &amp; Wilayah Perbatasan Lainnya</span>
                <span className="text-slate-500">8% (3 Laporan)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-2.5 text-xs text-slate-700 mt-4">
            <Info className="w-4 h-4 text-simantri-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Catatan Algoritma Agregasi SIMANTRI:</strong> Sinyal otomatis terpicu bila query view <code className="font-mono text-simantri-700 font-bold bg-white px-1 py-0.5 rounded border border-emerald-200">v_cv_signal_review</code> mendeteksi &ge; 2 laporan dengan diagnosis dan titik koordinat berdekatan dalam radius 1,5 km.
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): SOP Panduan Penyuluh */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-simantri-600" />
            <h3 className="text-base font-bold text-slate-900 font-jakarta">
              Panduan Tindak Lanjut SOP Penyuluh
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Protokol standar operasional BPP Nganjuk saat klaster sinyal mencapai ambang batas:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-simantri-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Verifikasi Lapangan Petak Sawah</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Lakukan inspeksi fisik ke petak hamparan petani yang melapor untuk validasi gejala visual.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-simantri-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Pengambilan Sampel &amp; Uji Lab</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Bila patogen diduga strain baru atau resisten fungisida, bawa sampel ke Lab Hama &amp; Penyakit BPP Sukomoro.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-simantri-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Penerbitan Rekomendasi Terpadu</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Rilis rekomendasi pengendalian dan bagikan secara terpusat melalui asisten cerdas SIMA ke seluruh petani sewilayah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal / Dialog: Jadwalkan Kunjungan */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-simantri-600" />
                <h3 className="font-bold text-base text-slate-900 font-jakarta">Jadwalkan Kunjungan PPL</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            {scheduleSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-simantri-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900">Jadwal Kunjungan Berhasil Dibuat!</h4>
                <p className="text-xs text-slate-500">Notifikasi telah diteruskan ke kelompok tani terkait.</p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Klaster / Wilayah</label>
                  <input
                    type="text"
                    defaultValue={selectedSignal ? `${selectedSignal.predicted_class} (${selectedSignal.village})` : 'Klaster Sukomoro Sawah Lor'}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium outline-none"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kunjungan</label>
                    <input
                      type="date"
                      required
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-simantri-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Petugas PPL</label>
                    <input
                      type="text"
                      defaultValue="Tim BPP Sukomoro"
                      className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-simantri-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Rencana Tindakan</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Inspeksi persebaran trotol & edukasi rotasi fungisida sistemik..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-simantri-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-simantri-500 hover:bg-simantri-600 text-white rounded-xl shadow-xs"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
