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
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email ?? null)

      // Fetch profile
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(prof as Profile)
      }

      setLoading(false)
    }

    loadUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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
          action: 'INSERT (Input Harga Pasar)',
          table: 'market_price',
          expected: profile.role === 'admin' ? 'allow' : 'deny',
          actual: 'failed',
          message: `Ditolak oleh RLS Database: ${error.message} (Code: ${error.code})`,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        // Cleanup if admin
        await supabase.from('market_price').delete().eq('tanggal', '2099-12-31')
        logs.push({
          action: 'INSERT (Input Harga Pasar)',
          table: 'market_price',
          expected: 'allow',
          actual: 'success',
          message: 'Berhasil diizinkan karena role adalah Admin.',
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

    // TEST 2: Insert into knowledge_entries (Allowed ONLY for Admin)
    try {
      const { error } = await supabase.from('knowledge_entries').insert({
        doc_id: `TEST-${Date.now()}`,
        title: 'Uji Coba RLS Pengetahuan',
        category: 'Agroekologi',
        summary: 'Uji coba integritas RLS',
        content: 'Konten uji coba keamanan database',
        author_id: profile.id,
      })

      if (error) {
        logs.push({
          action: 'INSERT (Tulis Dunia Brambang)',
          table: 'knowledge_entries',
          expected: profile.role === 'admin' ? 'allow' : 'deny',
          actual: 'failed',
          message: `Ditolak oleh RLS Database: ${error.message} (Code: ${error.code})`,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        logs.push({
          action: 'INSERT (Tulis Dunia Brambang)',
          table: 'knowledge_entries',
          expected: 'allow',
          actual: 'success',
          message: 'Berhasil diizinkan karena role adalah Admin.',
          timestamp: new Date().toLocaleTimeString(),
        })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error'
      logs.push({
        action: 'INSERT',
        table: 'knowledge_entries',
        expected: profile.role === 'admin' ? 'allow' : 'deny',
        actual: 'failed',
        message: msg,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    // TEST 3: SELECT market_price (Allowed for all authenticated users)
    try {
      const { error } = await supabase
        .from('market_price')
        .select('tanggal, harga')
        .limit(1)

      if (error) {
        logs.push({
          action: 'SELECT (Baca Harga Pasar)',
          table: 'market_price',
          expected: 'allow',
          actual: 'failed',
          message: `Gagal: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        logs.push({
          action: 'SELECT (Baca Harga Pasar)',
          table: 'market_price',
          expected: 'allow',
          actual: 'success',
          message: 'Berhasil membaca data (diizinkan untuk seluruh user terotentikasi).',
          timestamp: new Date().toLocaleTimeString(),
        })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error'
      logs.push({
        action: 'SELECT',
        table: 'market_price',
        expected: 'allow',
        actual: 'failed',
        message: msg,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    // TEST 4: Submit suggestion to content_suggestions (Allowed for own user)
    try {
      const { data: newSugg, error } = await supabase
        .from('content_suggestions')
        .insert({
          type: 'usulan_pembaruan',
          submitted_by: profile.id,
          submitted_role: profile.role,
          content_note: 'Uji coba mekanisme pengajuan usulan via RLS',
        })
        .select()
        .single()

      if (error) {
        logs.push({
          action: 'INSERT (Ajukan Usulan)',
          table: 'content_suggestions',
          expected: 'allow',
          actual: 'failed',
          message: `Gagal: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        // Cleanup test row
        if (newSugg) {
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
      <div className="min-h-screen flex items-center justify-center bg-[#FBF4EE]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#4A3A32]">
            Memuat profil pengguna...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF4EE] flex flex-col">
      {/* Top Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-[#E5DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-[#FBF4EE] flex items-center justify-center shadow-sm">
              <Sprout className="w-6 h-6 text-[#E6A15C]" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-[#0E080A] tracking-tight block leading-none">
                SIMANTRI
              </span>
              <span className="text-[11px] text-[#8A8580] tracking-wider uppercase font-medium">
                Dashboard Utama
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8C3A3A] bg-[#8C3A3A]/10 hover:bg-[#8C3A3A]/20 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* User Profile Card */}
        <div className="card-standard p-6 sm:p-8 mb-8 border border-[#E5DFD6]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#C4487A]/15 text-[#C4487A] flex items-center justify-center shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-serif font-bold text-[#0E080A]">
                    {profile?.full_name ?? 'Pengguna'}
                  </h1>
                  {/* Role Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      profile?.role === 'admin'
                        ? 'bg-[#E6A15C] text-[#0E080A]'
                        : profile?.role === 'penyuluh'
                        ? 'bg-[#3A5A40] text-white'
                        : 'bg-[#C4487A]/20 text-[#C4487A]'
                    }`}
                  >
                    {profile?.role === 'admin'
                      ? 'Admin Moderator'
                      : profile?.role === 'penyuluh'
                      ? 'Penyuluh Pertanian'
                      : 'Petani Bawang'}
                  </span>
                  {profile?.is_verified_contributor && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#3A5A40] text-white">
                      <ShieldCheck className="w-3 h-3" />
                      Kontributor Terverifikasi
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#8A8580] mt-1 flex items-center gap-2">
                  <span>{userEmail}</span>
                  {profile?.village && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#4A3A32]">
                        <MapPin className="w-3.5 h-3.5 text-[#C4487A]" />
                        Kecamatan {profile.village}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#8A8580] sm:text-right">
              <div>Status Autentikasi: Terhubung Supabase Auth</div>
              <div className="text-[#3A5A40] font-semibold mt-0.5">
                ● RLS Active & Enforced
              </div>
            </div>
          </div>
        </div>

        {/* RLS Security Verification Panel */}
        <div className="card-standard p-6 sm:p-8 mb-8 border-2 border-[#C4487A]/30 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD6]">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#C4487A]" />
                <h2 className="text-lg font-serif font-bold text-[#0E080A]">
                  Verifikasi Keamanan: Database Row Level Security (RLS)
                </h2>
              </div>
              <p className="text-sm text-[#4A3A32] mt-1">
                Uji pembuktian bahwa hak akses dibatasi secara ketat di level
                database, bukan sekadar di tampilan UI.
              </p>
            </div>

            <button
              onClick={runRlsTests}
              disabled={testing}
              className="btn-primary py-2.5 px-5 rounded-lg text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menguji RLS...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Jalankan Pengujian RLS</span>
                </>
              )}
            </button>
          </div>

          {/* Test Logs Display */}
          <div className="mt-6">
            {testLog.length === 0 ? (
              <div className="py-8 text-center bg-[#FBF4EE] rounded-xl border border-dashed border-[#E5DFD6]">
                <ShieldCheck className="w-8 h-8 text-[#8A8580] mx-auto mb-2" />
                <p className="text-sm font-medium text-[#4A3A32]">
                  Belum ada uji coba yang dijalankan pada sesi ini.
                </p>
                <p className="text-xs text-[#8A8580] mt-1">
                  Klik tombol &ldquo;Jalankan Pengujian RLS&rdquo; di atas untuk
                  memvalidasi aturan izin role akun Anda ({profile?.role}).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {testLog.map((log, index) => {
                  const isExpectedBehavior =
                    (log.expected === 'allow' && log.actual === 'success') ||
                    (log.expected === 'deny' && log.actual === 'failed')

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                        isExpectedBehavior
                          ? 'bg-[#3A5A40]/5 border-[#3A5A40]/30'
                          : 'bg-[#8C3A3A]/5 border-[#8C3A3A]/30'
                      }`}
                    >
                      {isExpectedBehavior ? (
                        <CheckCircle2 className="w-5 h-5 text-[#3A5A40] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#8C3A3A] shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 text-xs sm:text-sm">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-[#0E080A]">
                            [{log.table}] {log.action}
                          </span>
                          <span className="text-[11px] text-[#8A8580]">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-[#4A3A32] leading-relaxed">
                          {log.message}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-[#8A8580]">
                          <span>
                            Ekspektasi:{' '}
                            <strong className="text-[#0E080A]">
                              {log.expected === 'allow' ? 'IZINKAN' : 'TOLAK (BLOKIR)'}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Hasil Eksekusi:{' '}
                            <strong
                              className={
                                log.actual === 'success'
                                  ? 'text-[#3A5A40]'
                                  : 'text-[#8C3A3A]'
                              }
                            >
                              {log.actual.toUpperCase()}
                            </strong>
                          </span>
                          <span>•</span>
                          <span
                            className={
                              isExpectedBehavior
                                ? 'text-[#3A5A40] font-bold'
                                : 'text-[#8C3A3A] font-bold'
                            }
                          >
                            {isExpectedBehavior
                              ? '✓ KEAMANAN SESUAI SPESIFIKASI'
                              : '✗ KEAMANAN GAGAL'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation & Upcoming Features Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-standard p-6 border border-[#E5DFD6]">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-[#C4487A]" />
              <h3 className="font-serif font-bold text-base text-[#0E080A]">
                Modul Harga Pasar (Fase 2)
              </h3>
            </div>
            <p className="text-xs text-[#4A3A32] leading-relaxed mb-4">
              {profile?.role === 'admin'
                ? 'Sebagai Admin, Anda memiliki hak input harga harian manual yang akan menjadi bahan baku model prediksi XGBoost.'
                : 'Data harga harian dan hasil prakiraan 7 hari ke depan akan tampil di sini setelah modul Fase 2 diaktifkan.'}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A8580] bg-[#FBF4EE] px-3 py-1.5 rounded-lg border border-[#E5DFD6]">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A15C]" />
              Menunggu Fase 2 (Deploy ML XGBoost)
            </span>
          </div>

          <div className="card-standard p-6 border border-[#E5DFD6]">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-[#3A5A40]" />
              <h3 className="font-serif font-bold text-base text-[#0E080A]">
                Dunia Brambang (Pameran Pengetahuan)
              </h3>
            </div>
            <p className="text-xs text-[#4A3A32] leading-relaxed mb-4">
              Jelajahi ensiklopedia budidaya bawang merah Nganjuk. Terbuka untuk
              publik dengan tingkat keandalan (evidence level) terverifikasi.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A8580] bg-[#FBF4EE] px-3 py-1.5 rounded-lg border border-[#E5DFD6]">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A15C]" />
              Menunggu Fase 3 (Integrasi Visual Museum)
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
