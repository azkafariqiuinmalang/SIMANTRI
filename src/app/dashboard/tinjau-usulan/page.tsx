'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  User,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Search,
  Check,
  X,
  MessageSquare,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

interface AdminSuggestionItem {
  id: string
  type: 'laporan_keliru' | 'usulan_pembaruan'
  related_entry_id: string | null
  submitted_by: string
  submitted_role: string
  content_note: string
  status: 'diterima_menunggu_tinjauan' | 'digunakan_dalam_pembaruan' | 'tidak_digunakan'
  review_note: string | null
  reviewed_at: string | null
  created_at: string
  submitter?: {
    full_name: string
    village: string | null
    role: string
  } | null
  related_entry?: {
    title: string
  } | null
}

export default function TinjauUsulanPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [suggestions, setSuggestions] = useState<AdminSuggestionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null)
  const [reviewNoteInput, setReviewNoteInput] = useState('')
  const [updating, setUpdating] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (prof) setProfile(prof as Profile)

    const { data: list, error } = await supabase
      .from('content_suggestions')
      .select(`
        id,
        type,
        related_entry_id,
        submitted_by,
        submitted_role,
        content_note,
        status,
        review_note,
        reviewed_at,
        created_at,
        submitter:profiles!content_suggestions_submitted_by_fkey(full_name, village, role),
        related_entry:knowledge_entries!content_suggestions_related_entry_id_fkey(title)
      `)
      .order('created_at', { ascending: false })

    if (!error && list && list.length > 0) {
      setSuggestions(list as unknown as AdminSuggestionItem[])
    } else {
      // Demonstration sample suggestions for review
      const sampleSuggestions: AdminSuggestionItem[] = [
        {
          id: 'demo-1',
          type: 'usulan_pembaruan',
          related_entry_id: null,
          submitted_by: 'user-1',
          submitted_role: 'petani',
          content_note:
            'Di musim hujan kemarin di Sukomoro, penggunaan mulsa perak-hitam dikombinasikan dengan pupuk silika cair terbukti mengurangi rebah daun hingga 40%. Mohon ditambahkan ke panduan budidaya musim basah.',
          status: 'diterima_menunggu_tinjauan',
          review_note: null,
          reviewed_at: null,
          created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          submitter: {
            full_name: 'Pak Sugiono',
            village: 'Sukomoro',
            role: 'petani',
          },
        },
        {
          id: 'demo-2',
          type: 'laporan_keliru',
          related_entry_id: null,
          submitted_by: 'user-2',
          submitted_role: 'petani',
          content_note:
            'Dosis fungisida Difenokonazol pada artikel Pengendalian Trotol tertulis 2ml/L, biasanya anjuran PPL Sukomoro adalah 1ml/L untuk tanaman umur di bawah 30 HST agar daun tidak kaku.',
          status: 'diterima_menunggu_tinjauan',
          review_note: null,
          reviewed_at: null,
          created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          submitter: {
            full_name: 'Pak Marjuki',
            village: 'Bagor',
            role: 'petani',
          },
          related_entry: {
            title: 'SOP Pengendalian Penyakit Bercak Ungu (Trotol)',
          },
        },
      ]
      setSuggestions(sampleSuggestions)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'digunakan_dalam_pembaruan' | 'tidak_digunakan',
    note: string
  ) => {
    setUpdating(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (id.startsWith('demo-')) {
      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
                review_note: note.trim() || 'Telah ditinjau oleh Penyuluh PPL.',
                reviewed_at: new Date().toISOString(),
              }
            : item
        )
      )
      setActiveReviewId(null)
      setReviewNoteInput('')
      setUpdating(false)
      return
    }

    const { error } = await supabase
      .from('content_suggestions')
      .update({
        status: newStatus,
        review_note: note.trim() || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (!error) {
      setActiveReviewId(null)
      setReviewNoteInput('')
      loadData()
    }
    setUpdating(false)
  }

  const filteredSuggestions = suggestions.filter((s) => {
    if (filterStatus === 'all') return true
    return s.status === filterStatus
  })

  return (
    <div className="space-y-6 font-jakarta">
      {/* HEADER SECTION */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-simantri-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Moderasi &amp; Validasi Konten PPL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peninjauan Usulan &amp; Koreksi Petani
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Tinjau laporan koreksi atau tips budidaya yang dikirimkan oleh petani dan kelompok tani se-Kabupaten Nganjuk untuk memperkaya basis pengetahuan SIMA.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 h-11 px-4 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Segarkan Antrean</span>
        </button>
      </section>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'Semua Usulan', val: 'all' },
          { label: 'Menunggu Tinjauan', val: 'diterima_menunggu_tinjauan' },
          { label: 'Diterima & Digunakan', val: 'digunakan_dalam_pembaruan' },
          { label: 'Tidak Digunakan', val: 'tidak_digunakan' },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setFilterStatus(tab.val)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
              filterStatus === tab.val
                ? 'bg-simantri-500 text-white border-simantri-500 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIST OF SUGGESTIONS */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-simantri-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Memuat usulan masuk...</p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-2">
          <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">Tidak Ada Usulan Dalam Filter Ini</h3>
          <p className="text-xs text-slate-400">Semua usulan telah diproses atau antrean sedang kosong.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-2xl bg-simantri-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {item.submitter?.full_name?.charAt(0).toUpperCase() || 'P'}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.submitter?.full_name || 'Petani Anonim'}</span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-simantri-800 font-bold border border-emerald-200">
                        {item.submitted_role}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Desa {item.submitter?.village || 'Sukomoro'} •{' '}
                      {new Date(item.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-bold border ${
                      item.type === 'laporan_keliru'
                        ? 'bg-shallot-50 text-shallot-600 border-shallot-200'
                        : 'bg-emerald-50 text-simantri-800 border-emerald-200'
                    }`}
                  >
                    {item.type === 'laporan_keliru' ? 'Laporan Koreksi' : 'Usulan Baru'}
                  </span>

                  <span
                    className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-bold border ${
                      item.status === 'digunakan_dalam_pembaruan'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : item.status === 'tidak_digunakan'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Rujukan KB */}
              {item.related_entry?.title && (
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center gap-2 text-slate-700">
                  <BookOpen className="w-4 h-4 text-simantri-600 shrink-0" />
                  <span>
                    Merujuk pada Referensi: <strong>{item.related_entry.title}</strong>
                  </span>
                </div>
              )}

              {/* Isi Usulan */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                &ldquo;{item.content_note}&rdquo;
              </div>

              {/* Review Note (if already reviewed) */}
              {item.review_note && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                  <p className="font-bold text-simantri-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-simantri-600" />
                    <span>Catatan Tanggapan Tim Penyuluh:</span>
                  </p>
                  <p className="text-slate-700">{item.review_note}</p>
                </div>
              )}

              {/* Action Buttons for Penyuluh */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                {activeReviewId === item.id ? (
                  <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-2 animate-fadeIn">
                    <label className="text-xs font-bold text-slate-800 block">
                      Catatan Peninjauan / Tanggapan untuk Petani:
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNoteInput}
                      onChange={(e) => setReviewNoteInput(e.target.value)}
                      placeholder="Tuliskan catatan apresiasi, klarifikasi ilmiah, atau rekomendasi pengendalian..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-simantri-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveReviewId(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(item.id, 'tidak_digunakan', reviewNoteInput)
                        }
                        disabled={updating}
                        className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak Usulan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            item.id,
                            'digunakan_dalam_pembaruan',
                            reviewNoteInput
                          )
                        }
                        disabled={updating}
                        className="px-4 py-2 text-xs font-bold bg-simantri-500 hover:bg-simantri-600 text-white rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terima &amp; Publikasikan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReviewId(item.id)
                      setReviewNoteInput(item.review_note || '')
                    }}
                    className="py-2 px-4 rounded-2xl text-xs font-bold bg-simantri-500 hover:bg-simantri-600 text-white shadow-sm flex items-center gap-2 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Tinjau &amp; Beri Tanggapan</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
