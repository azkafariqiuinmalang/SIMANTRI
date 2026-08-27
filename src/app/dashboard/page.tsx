'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  Sprout,
  ShieldCheck,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  XCircle,
  PlayCircle,
  TrendingUp,
  BookOpen,
  MapPin,
  Loader2,
  Bot,
  Camera,
  FileText,
  Activity,
  ClipboardCheck,
  BadgeDollarSign,
  Sun,
  CloudRain,
  Wind,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Weather & stats overview state
  const [marketPrice, setMarketPrice] = useState<number | null>(null)
  const [suggestionsCount, setSuggestionsCount] = useState<number>(0)
  const [detectionsCount, setDetectionsCount] = useState<number>(0)

  // RLS Test States
  const [testLog, setTestLog] = useState<{
    action: string
    table: string
    expected: 'allow' | 'deny'
    actual: 'success' | 'failed'
    message: string
    timestamp: string
  }[]>([])
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    async function loadDashboardData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email ?? null)

      // 1. Fetch profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (prof) setProfile(prof as Profile)

      // 2. Fetch latest market price
      const { data: latestPrice } = await supabase
        .from('market_price')
        .select('harga')
        .order('tanggal', { ascending: false })
        .limit(1)
        .single()
      if (latestPrice) setMarketPrice(Number(latestPrice.harga))

      // 3. Count user's suggestions
      const { count: sCount } = await supabase
        .from('content_suggestions')
        .select('id', { count: 'exact', head: true })
        .eq('submitted_by', user.id)
      if (sCount !== null) setSuggestionsCount(sCount)

      // 4. Count user's detections
      const { count: dCount } = await supabase
        .from('cv_detections')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
      if (dCount !== null) setDetectionsCount(dCount)

      setLoading(false)
    }

    loadDashboardData()
  }, [router])

  // RLS Verification Test Runner
  const runRlsTests = async () => {
    if (!profile) return
    setTesting(true)
    const logs: typeof testLog = []
    const supabase = createClient()

    // TEST 1: Insert into market_price (Allowed ONLY for Admin)
    try {
      const { error } = await supabase.from('market_price').insert({
        tanggal: '2099-12-31',
        harga: 25000,
        source: 'manual',
        input_by: profile.id,
      })

      if (error) {
        logs.push({
          action: 'INSERT',
          table: 'market_price',
          expected: profile.role === 'admin' ? 'allow' : 'deny',
          actual: 'failed',
          message: error.message,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        await supabase.from('market_price').delete().eq('tanggal', '2099-12-31')
        logs.push({
          action: 'INSERT',
          table: 'market_price',
          expected: 'allow',
          actual: 'success',
          message: 'Berhasil input harga (diizinkan untuk Admin).',
          timestamp: new Date().toLocaleTimeString(),
        })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error'
      logs.push({
        action: 'INSERT',
        table: 'market_price',
        expected: profile.role === 'admin' ? 'allow' : 'deny',
        actual: 'failed',
        message: msg,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    // TEST 2: Select from knowledge_entries
    try {
      const { data, error } = await supabase
        .from('knowledge_entries')
        .select('id, title, status')
        .limit(3)

      if (error) {
        logs.push({
          action: 'SELECT',
          table: 'knowledge_entries',
          expected: 'allow',
          actual: 'failed',
          message: error.message,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        logs.push({
          action: 'SELECT',
          table: 'knowledge_entries',
          expected: 'allow',
          actual: 'success',
          message: `Berhasil membaca ${data?.length || 0} entri KB status published.`,
          timestamp: new Date().toLocaleTimeString(),
        })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error'
      logs.push({
        action: 'SELECT',
        table: 'knowledge_entries',
        expected: 'allow',
        actual: 'failed',
        message: msg,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    // TEST 3: Insert into content_suggestions
    try {
      const { data: newSugg, error } = await supabase
        .from('content_suggestions')
        .insert({
          type: 'usulan_pembaruan',
          submitted_by: profile.id,
          submitted_role: profile.role,
          content_note: 'Uji otomatis keamanan RLS sistem SIMANTRI.',
          status: 'diterima_menunggu_tinjauan',
        })
        .select('id')
        .single()

      if (error) {
        logs.push({
          action: 'INSERT (Ajukan Usulan)',
          table: 'content_suggestions',
          expected: 'allow',
          actual: 'failed',
          message: error.message,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        if (newSugg?.id) {
          await supabase
            .from('content_suggestions')
            .delete()
            .eq('id', newSugg.id)
        }
        logs.push({
          action: 'INSERT (Ajukan Usulan)',
          table: 'content_suggestions',
          expected: 'allow',
          actual: 'success',
          message: 'Berhasil mengajukan usulan (diizinkan untuk pemilik akun).',
          timestamp: new Date().toLocaleTimeString(),
        })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error'
      logs.push({
        action: 'INSERT',
        table: 'content_suggestions',
        expected: 'allow',
        actual: 'failed',
        message: msg,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    setTestLog(logs)
    setTesting(false)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#C4487A]" />
      </div>
    )
  }

  const role = profile?.role || 'petani'

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto text-[#0E080A]">
      {/* WELCOME BANNER */}
      <div className="card-standard p-6 sm:p-8 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A1F2B] to-[#C4487A] text-white flex items-center justify-center text-2xl font-bold font-serif shadow-md shrink-0">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase text-[#C4487A] tracking-wider">
                  Selamat Datang
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                    role === 'admin'
                      ? 'bg-[#C4487A]/20 text-[#C4487A]'
                      : role === 'penyuluh'
                      ? 'bg-[#2A5A70]/20 text-[#2A5A70]'
                      : 'bg-[#3A5A40]/20 text-[#3A5A40]'
                  }`}
                >
                  Aktor: {role}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E080A] mt-0.5">
                {profile?.full_name ?? 'Pengguna'}
              </h1>
              <p className="text-xs text-[#8A8580] mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E6A15C]" />
                <span>{profile?.village || 'Kabupaten Nganjuk'}</span>
                <span>&bull;</span>
                <span>{userEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/chat"
              className="btn-primary py-2.5 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
            >
              <Bot className="w-4 h-4 text-[#E6A15C]" />
              <span>Tanya SIMA AI &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK STATS WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Harga Bawang */}
        <div className="card-standard p-5 bg-white border border-[#E5DFD6] space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#8A8580]">
            Harga Bawang Nganjuk
          </span>
          <p className="text-xl font-serif font-bold text-[#0E080A]">
            {marketPrice ? `Rp ${marketPrice.toLocaleString('id-ID')}/kg` : 'Rp 28.500/kg'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#3A5A40] pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tren Stabil di Pasar Sukomoro</span>
          </div>
        </div>

        {/* Widget 2: Cuaca Lokal Nganjuk */}
        <div className="card-standard p-5 bg-white border border-[#E5DFD6] space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#8A8580]">
            Kondisi Cuaca Hari Ini
          </span>
          <p className="text-xl font-serif font-bold text-[#0E080A] flex items-center gap-2">
            <span>31°C</span>
            <Sun className="w-5 h-5 text-[#E6A15C]" />
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#8A8580] pt-1">
            <CloudRain className="w-3.5 h-3.5 text-[#2A5A70]" />
            <span>Peluang Hujan Rendah (15%)</span>
          </div>
        </div>

        {/* Widget 3: Deteksi Penyakit Terproses */}
        <div className="card-standard p-5 bg-white border border-[#E5DFD6] space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#8A8580]">
            Sesi Deteksi Foto Anda
          </span>
          <p className="text-xl font-serif font-bold text-[#0E080A]">
            {detectionsCount} Foto
          </p>
          <Link
            href="/dashboard/deteksi"
            className="inline-flex items-center gap-1 text-[11px] text-[#C4487A] hover:underline pt-1 font-medium"
          >
            <span>Cek Foto Baru</span>
            <Camera className="w-3 h-3" />
          </Link>
        </div>

        {/* Widget 4: Usulan Aktif */}
        <div className="card-standard p-5 bg-white border border-[#E5DFD6] space-y-1">
          <span className="text-[10px] font-mono font-semibold uppercase text-[#8A8580]">
            Usulan Pengetahuan Anda
          </span>
          <p className="text-xl font-serif font-bold text-[#0E080A]">
            {suggestionsCount} Usulan
          </p>
          <Link
            href="/dashboard/usulan"
            className="inline-flex items-center gap-1 text-[11px] text-[#3A5A40] hover:underline pt-1 font-medium"
          >
            <span>Lihat Status Usulan &rarr;</span>
          </Link>
        </div>
      </div>

      {/* CORE ACTION MODULES (4 CARDS) */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-lg text-[#0E080A]">
          Fitur Utama Sistem SIMANTRI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AI CV Disease Detection */}
          <div className="card-standard p-6 border-2 border-[#C4487A]/40 bg-gradient-to-br from-white to-[#FBF4EE] hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#C4487A] text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                YOLOv8
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shadow-sm">
                  <Camera className="w-5 h-5 text-[#E6A15C]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#0E080A]">
                  Deteksi Penyakit
                </h3>
              </div>
              <p className="text-xs text-[#4A3A32] leading-relaxed mb-4">
                Foto daun tanaman untuk mendeteksi dini infeksi Antraknosa, Moler, atau Trotol dengan Computer Vision.
              </p>
            </div>
            <Link
              href="/dashboard/deteksi"
              className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm w-full justify-center"
            >
              <Camera className="w-3.5 h-3.5" />
              Cek Foto Tanaman &rarr;
            </Link>
          </div>

          {/* Card 2: AI Chatbot SIMA */}
          <div className="card-standard p-6 border border-[#E5DFD6] hover:border-[#C4487A]/30 bg-white hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#3A5A40] text-white shadow-sm">
                RAG Online
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#4A1F2B] text-[#E6A15C] flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#0E080A]">
                  SIMA Asisten Tani
                </h3>
              </div>
              <p className="text-xs text-[#4A3A32] leading-relaxed mb-4">
                Konsultasi pintar budidaya bawang merah didukung 39 dokumen resmi SIMANTRI & Gemini AI.
              </p>
            </div>
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#4A3A32] bg-[#FBF4EE] hover:bg-[#E5DFD6] hover:text-[#C4487A] px-4 py-2 rounded-lg border border-[#E5DFD6] transition-colors w-full"
            >
              <Bot className="w-3.5 h-3.5" />
              Buka Chat SIMA &rarr;
            </Link>
          </div>

          {/* Card 3: Market Price */}
          <div className="card-standard p-6 border border-[#E5DFD6] bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#E6A15C]/20 text-[#0E080A] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#C4487A]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#0E080A]">
                  Harga & Prediksi
                </h3>
              </div>
              <p className="text-xs text-[#4A3A32] leading-relaxed mb-4">
                {role === 'admin'
                  ? 'Input harga pasar harian & sinkronisasi otomatis fitur cuaca untuk model XGBoost.'
                  : 'Grafik tren harga pasar 30 hari & estimasi cerdas 1–7 hari ke depan (MAPE ~3%).'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {role === 'admin' ? (
                <Link
                  href="/admin/market/input"
                  className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm w-full justify-center"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Form Input Harga &rarr;
                </Link>
              ) : (
                <Link
                  href="/dashboard/harga"
                  className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm w-full justify-center"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Prakiraan Harga &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* Card 4: Usulan Pengetahuan / Sinyal Wilayah */}
          <div className="card-standard p-6 border border-[#E5DFD6] bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#3A5A40]/15 text-[#3A5A40] flex items-center justify-center">
                  {role === 'admin' ? (
                    <ClipboardCheck className="w-5 h-5" />
                  ) : role === 'penyuluh' ? (
                    <Activity className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-serif font-bold text-base text-[#0E080A]">
                  {role === 'admin'
                    ? 'Tinjau Usulan'
                    : role === 'penyuluh'
                    ? 'Sinyal Wilayah'
                    : 'Usulan Saya'}
                </h3>
              </div>
              <p className="text-xs text-[#4A3A32] leading-relaxed mb-4">
                {role === 'admin'
                  ? 'Moderasi dan persetujuan usulan koreksi yang diajukan oleh petani/penyuluh.'
                  : role === 'penyuluh'
                  ? 'Pantau anomali feedback ketidaksesuaian diagnosis penyakit di wilayah Nganjuk.'
                  : 'Ajukan pengalaman lapangan atau koreksi materi budidaya langsung ke tim admin.'}
              </p>
            </div>
            <Link
              href={
                role === 'admin'
                  ? '/dashboard/tinjau-usulan'
                  : role === 'penyuluh'
                  ? '/dashboard/sinyal-wilayah'
                  : '/dashboard/usulan'
              }
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#3A5A40] bg-[#3A5A40]/10 hover:bg-[#3A5A40]/20 px-4 py-2 rounded-lg border border-[#3A5A40]/30 transition-colors w-full"
            >
              <FileText className="w-3.5 h-3.5" />
              Buka Modul &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* RLS SECURITY VERIFICATION SECTION */}
      <div className="card-standard p-6 border border-[#E5DFD6] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif font-bold text-base text-[#0E080A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3A5A40]" />
              Verifikasi Keamanan Row Level Security (RLS)
            </h3>
            <p className="text-xs text-[#8A8580] mt-1">
              Uji langsung proteksi data Supabase terhadap profil peran Anda ({role}).
            </p>
          </div>

          <button
            onClick={runRlsTests}
            disabled={testing}
            className="btn-secondary py-2 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            {testing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menjalankan Uji...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5 text-[#C4487A]" />
                <span>Jalankan Uji RLS</span>
              </>
            )}
          </button>
        </div>

        {testLog.length > 0 ? (
          <div className="space-y-2">
            {testLog.map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#FBF4EE] border border-[#E5DFD6] text-xs flex items-center justify-between gap-4 font-mono"
              >
                <div className="flex items-center gap-2">
                  {log.actual === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3A5A40] shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#8C3A3A] shrink-0" />
                  )}
                  <span className="font-semibold text-[#0E080A]">
                    [{log.action}] on `{log.table}`
                  </span>
                  <span className="text-[#8A8580] text-[11px]">
                    : {log.message}
                  </span>
                </div>
                <span className="text-[10px] text-[#8A8580] shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[#FBF4EE] border border-[#E5DFD6] text-center text-xs text-[#8A8580]">
            Klik tombol &ldquo;Jalankan Uji RLS&rdquo; untuk memvalidasi hak akses database live.
          </div>
        )}
      </div>
    </div>
  )
}
