'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  BadgeCheck,
  FileText,
  Clock,
  MapPin,
  Building,
  RefreshCw,
  Loader2,
  Check,
  X,
  Eye,
  AlertTriangle,
  ArrowLeft,
  Search,
  Users,
  Award,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react'

export default function AdminVerifikasiPenyuluhPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [penyuluhList, setPenyuluhList] = useState<Profile[]>([])
  const [filterStatus, setFilterStatus] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [previewDoc, setPreviewDoc] = useState<{ name: string; nip?: string | null; institution?: string | null; url: string; id: string } | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
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

    // Fetch all penyuluh profiles
    const { data: penyuluhs, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'penyuluh')
      .order('created_at', { ascending: false })

    if (!error && penyuluhs) {
      setPenyuluhList(penyuluhs as Profile[])
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpdateStatus = async (
    targetId: string,
    newStatus: 'verified' | 'rejected',
    targetName: string
  ) => {
    setActionLoading(targetId)
    setSuccessToast(null)
    const supabase = createClient()

    try {
      const isVerified = newStatus === 'verified'
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: newStatus,
          is_verified_contributor: isVerified,
          verified_at: isVerified ? new Date().toISOString() : null,
          verified_by: profile?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)

      if (error) throw error

      setSuccessToast(
        newStatus === 'verified'
          ? `Akun Penyuluh ${targetName} berhasil disetujui & diverifikasi!`
          : `Kredensial Penyuluh ${targetName} telah ditolak.`
      )

      // Optimistic update
      setPenyuluhList((prev) =>
        prev.map((p) =>
          p.id === targetId
            ? {
                ...p,
                verification_status: newStatus,
                is_verified_contributor: isVerified,
                verified_at: isVerified ? new Date().toISOString() : null,
              }
            : p
        )
      )

      if (previewDoc && previewDoc.id === targetId) {
        setPreviewDoc(null)
      }
    } catch (err) {
      console.error('Error updating verification status:', err)
      alert('Gagal memperbarui status verifikasi penyuluh.')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredList = penyuluhList.filter((item) => {
    const status = item.verification_status || 'unverified'
    const matchesStatus = filterStatus === 'all' ? true : status === filterStatus
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nip?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.village?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const pendingCount = penyuluhList.filter(
    (p) => (p.verification_status || 'unverified') === 'pending'
  ).length
  const verifiedCount = penyuluhList.filter(
    (p) => (p.verification_status || 'unverified') === 'verified'
  ).length
  const rejectedCount = penyuluhList.filter(
    (p) => (p.verification_status || 'unverified') === 'rejected'
  ).length

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-simantri-600 dark:text-[var(--theme-green)]" />
          <p className="text-sm font-semibold text-slate-600 dark:text-[var(--theme-body)]">
            Memuat data verifikasi penyuluh...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-jakarta">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-simantri-900 via-simantri-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-simantri-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 -mb-12 h-48 w-48 rounded-full bg-shallot-500/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-simantri-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Governance & Credential Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Verifikasi Kredensial Penyuluh Pertanian
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Validasi keabsahan dokumen SK Dinas &amp; KTA Petugas Lapangan (PPL) Kabupaten Nganjuk untuk memberikan wewenang kurasi sinyal penyakit &amp; validasi SOP budidaya.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition backdrop-blur-md active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sinkronisasi Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOAST SUCCESS ALERT */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] border border-emerald-200 dark:border-[var(--theme-green)] text-emerald-900 dark:text-[var(--theme-green)] text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-semibold">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="p-1 text-emerald-600 dark:text-[var(--theme-green)] hover:bg-emerald-100 dark:hover:bg-[var(--theme-green-soft)] rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-700 dark:text-[var(--theme-body)] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[var(--theme-muted)]">Total Penyuluh</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-[var(--theme-ink)] mt-0.5">{penyuluhList.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-amber-100 dark:border-[var(--theme-amber)] bg-amber-50/20 dark:bg-[var(--theme-amber-soft)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-[var(--theme-amber-soft)] text-amber-700 dark:text-[var(--theme-amber)] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-[var(--theme-amber)]">Menunggu Review</p>
            <p className="text-2xl font-extrabold text-amber-900 dark:text-[var(--theme-amber)] mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-emerald-100 dark:border-[var(--theme-green)] bg-emerald-50/20 dark:bg-[var(--theme-green-soft)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-[var(--theme-green-soft)] text-emerald-700 dark:text-[var(--theme-green)] flex items-center justify-center shrink-0">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-[var(--theme-green)]">Terverifikasi</p>
            <p className="text-2xl font-extrabold text-emerald-900 dark:text-[var(--theme-green)] mt-0.5">{verifiedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-rose-100 dark:border-[var(--theme-rose)] bg-rose-50/20 dark:bg-[var(--theme-rose-soft)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-[var(--theme-rose-soft)] text-rose-700 dark:text-[var(--theme-rose)] flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-[var(--theme-rose)]">Kredensial Ditolak</p>
            <p className="text-2xl font-extrabold text-rose-900 dark:text-[var(--theme-rose)] mt-0.5">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* CONTROLS & FILTER BAR */}
      <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-600 dark:text-[var(--theme-body)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)]'
            }`}
          >
            <span>Menunggu Review</span>
            {pendingCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  filterStatus === 'pending'
                    ? 'bg-white dark:bg-[var(--theme-surface)] text-amber-700 dark:text-[var(--theme-amber)]'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'verified'
                ? 'bg-simantri-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-600 dark:text-[var(--theme-body)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)]'
            }`}
          >
            Terverifikasi ({verifiedCount})
          </button>

          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-600 dark:text-[var(--theme-body)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)]'
            }`}
          >
            Ditolak ({rejectedCount})
          </button>

          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-600 dark:text-[var(--theme-body)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)]'
            }`}
          >
            Semua ({penyuluhList.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[var(--theme-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIP, BPP..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-[var(--theme-line)] bg-slate-50/50 dark:bg-[var(--theme-canvas)]/50 text-xs text-slate-800 dark:text-[var(--theme-ink)] placeholder-slate-400 dark:placeholder-[var(--theme-muted)] focus:outline-hidden focus:border-simantri-600 dark:focus:border-[var(--theme-green)] focus:bg-white dark:focus:bg-[var(--theme-surface)] transition"
          />
        </div>
      </div>

      {/* PENYULUH LIST CARDS */}
      {filteredList.length === 0 ? (
        <div className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-12 text-center border border-slate-100 dark:border-[var(--theme-line)] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-[var(--theme-green-soft)] text-simantri-600 dark:text-[var(--theme-green)] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-[var(--theme-ink)]">
              Tidak Ada Antrean Verifikasi
            </h3>
            <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] mt-1 max-w-sm mx-auto">
              Tidak ditemukan data penyuluh pada filter dan kata kunci ini. Semua kredensial telah terproses.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const status = item.verification_status || 'unverified'

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl p-5 border border-slate-100 dark:border-[var(--theme-line)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar Card */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[var(--theme-line)]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-simantri-700 to-simantri-900 text-white flex items-center justify-center font-extrabold text-base shadow-xs shrink-0">
                        {item.full_name?.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-[var(--theme-ink)] truncate">
                          {item.full_name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-[var(--theme-muted)] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-500 dark:text-[var(--theme-amber)] shrink-0" />
                          <span className="truncate">{item.village || 'Kab. Nganjuk'}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 border ${
                        status === 'verified'
                          ? 'bg-emerald-50 dark:bg-[var(--theme-green-soft)] border-emerald-200 dark:border-[var(--theme-green)] text-emerald-700 dark:text-[var(--theme-green)]'
                          : status === 'pending'
                          ? 'bg-amber-50 dark:bg-[var(--theme-amber-soft)] border-amber-200 dark:border-[var(--theme-amber)] text-amber-700 dark:text-[var(--theme-amber)]'
                          : 'bg-rose-50 dark:bg-[var(--theme-rose-soft)] border-rose-200 dark:border-[var(--theme-rose)] text-rose-700 dark:text-[var(--theme-rose)]'
                      }`}
                    >
                      {status === 'verified'
                        ? 'Terverifikasi'
                        : status === 'pending'
                        ? 'Menunggu Review'
                        : 'Ditolak'}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)]">
                      <span className="text-slate-500 dark:text-[var(--theme-muted)]">NIP / KTA:</span>
                      <strong className="font-mono text-slate-800 dark:text-[var(--theme-ink)] font-bold">
                        {item.nip || 'Belum diisi'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)]">
                      <span className="text-slate-500 dark:text-[var(--theme-muted)]">Instansi / BPP:</span>
                      <strong className="text-slate-800 dark:text-[var(--theme-ink)] text-right truncate max-w-[170px] font-semibold">
                        {item.institution || 'BPP Nganjuk'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[var(--theme-canvas)]">
                      <span className="text-slate-500 dark:text-[var(--theme-muted)]">Tanggal Daftar:</span>
                      <span className="text-slate-700 dark:text-[var(--theme-body)] font-mono text-[11px] font-semibold">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Document Button */}
                    <div className="pt-1">
                      {item.verification_doc_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              id: item.id,
                              name: item.full_name,
                              nip: item.nip,
                              institution: item.institution,
                              url: item.verification_doc_url!,
                            })
                          }
                          className="w-full py-2.5 px-3 rounded-2xl border border-simantri-200 dark:border-[var(--theme-green)] bg-simantri-50 dark:bg-[var(--theme-green-soft)] hover:bg-simantri-100 dark:hover:bg-[var(--theme-green-soft)] text-simantri-800 dark:text-[var(--theme-green)] font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
                        >
                          <Eye className="w-3.5 h-3.5 text-simantri-700 dark:text-[var(--theme-green)]" />
                          <span>Buka Lampiran KTA / SK</span>
                        </button>
                      ) : (
                        <div className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-[var(--theme-raised)] text-slate-400 dark:text-[var(--theme-muted)] text-xs text-center border border-dashed border-slate-200 dark:border-[var(--theme-line)] font-medium">
                          Tidak ada lampiran dokumen
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[var(--theme-line)] flex items-center gap-2">
                  {status !== 'verified' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(item.id, 'verified', item.full_name)
                      }
                      disabled={actionLoading === item.id}
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-simantri-700 hover:bg-simantri-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs active:scale-95 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Setujui</span>
                    </button>
                  )}

                  {status !== 'rejected' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(item.id, 'rejected', item.full_name)
                      }
                      disabled={actionLoading === item.id}
                      className="py-2.5 px-3 rounded-2xl bg-white dark:bg-[var(--theme-surface)] border border-rose-200 dark:border-[var(--theme-rose)] text-rose-600 dark:text-[var(--theme-rose)] hover:bg-rose-50 dark:hover:bg-[var(--theme-rose-soft)] text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* DOCUMENT PREVIEW LIGHTBOX / MODAL */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white dark:bg-[var(--theme-surface)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100 dark:border-[var(--theme-line)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[var(--theme-line)] flex items-center justify-between bg-slate-50/80 dark:bg-[var(--theme-canvas)]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-simantri-100 dark:bg-[var(--theme-green-soft)] text-simantri-700 dark:text-[var(--theme-green)] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-[var(--theme-ink)]">
                    Dokumen Kredensial SK / KTA
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[var(--theme-muted)] font-medium">
                    {previewDoc.name} • {previewDoc.nip ? `NIP: ${previewDoc.nip}` : 'NIP belum ada'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 dark:text-[var(--theme-muted)] hover:text-slate-800 dark:hover:text-[var(--theme-ink)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Render Area */}
            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-950/5 min-h-[360px]">
              {previewDoc.url.startsWith('data:image') || previewDoc.url.startsWith('http') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDoc.url}
                  alt="Dokumen KTA"
                  className="max-h-[60vh] max-w-full rounded-2xl object-contain border border-slate-200 dark:border-[var(--theme-line)] shadow-md bg-white dark:bg-[var(--theme-surface)]"
                />
              ) : (
                <iframe
                  src={previewDoc.url}
                  title="Preview Dokumen"
                  className="w-full h-[60vh] border rounded-2xl"
                />
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] flex items-center justify-between gap-3">
              <button
                onClick={() => setPreviewDoc(null)}
                className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-[var(--theme-raised)] hover:bg-slate-200 dark:hover:bg-[var(--theme-raised)] text-slate-700 dark:text-[var(--theme-body)] text-xs font-bold transition"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(previewDoc.id, 'rejected', previewDoc.name)}
                  disabled={actionLoading === previewDoc.id}
                  className="py-2.5 px-4 rounded-2xl border border-rose-200 dark:border-[var(--theme-rose)] text-rose-600 dark:text-[var(--theme-rose)] hover:bg-rose-50 dark:hover:bg-[var(--theme-rose-soft)] text-xs font-bold transition active:scale-95"
                >
                  Tolak Kredensial
                </button>
                <button
                  onClick={() => handleUpdateStatus(previewDoc.id, 'verified', previewDoc.name)}
                  disabled={actionLoading === previewDoc.id}
                  className="py-2.5 px-4 rounded-2xl bg-simantri-700 hover:bg-simantri-800 text-white text-xs font-bold transition shadow-xs active:scale-95"
                >
                  Setujui &amp; Verifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
