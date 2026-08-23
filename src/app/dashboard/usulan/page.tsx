'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  FileText,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Sparkles,
  RefreshCw,
  Loader2,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

interface KnowledgeEntryOption {
  id: string
  title: string
  category: string
}

interface SuggestionItem {
  id: string
  type: 'laporan_keliru' | 'usulan_pembaruan'
  related_entry_id: string | null
  content_note: string
  status: 'diterima_menunggu_tinjauan' | 'digunakan_dalam_pembaruan' | 'tidak_digunakan'
  review_note: string | null
  reviewed_at: string | null
  created_at: string
  related_entry?: {
    title: string
  } | null
}

export default function UsulanPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [kbEntries, setKbEntries] = useState<KnowledgeEntryOption[]>([])

  // Form State
  const [type, setType] = useState<'usulan_pembaruan' | 'laporan_keliru'>('usulan_pembaruan')
  const [relatedEntryId, setRelatedEntryId] = useState<string>('')
  const [contentNote, setContentNote] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // List State
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [loadingList, setLoadingList] = useState(true)

  const loadData = useCallback(async () => {
    setLoadingList(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Load Profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (prof) setProfile(prof as Profile)

    // Load KB Options for Reference Dropdown
    const { data: entries } = await supabase
      .from('knowledge_entries')
      .select('id, title, category')
      .eq('status', 'published')
      .order('title', { ascending: true })
    if (entries) setKbEntries(entries as KnowledgeEntryOption[])

    // Load My Suggestions
    const { data: suggList, error } = await supabase
      .from('content_suggestions')
      .select(`
        id,
        type,
        related_entry_id,
        content_note,
        status,
        review_note,
        reviewed_at,
        created_at,
        related_entry:knowledge_entries!content_suggestions_related_entry_id_fkey(title)
      `)
      .eq('submitted_by', user.id)
      .order('created_at', { ascending: false })

    if (!error && suggList) {
      setSuggestions(suggList as unknown as SuggestionItem[])
    }
    setLoadingList(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contentNote.trim()) {
      setErrorMessage('Mohon tuliskan isi usulan atau koreksi Anda.')
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    setSubmitSuccess(false)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setErrorMessage('Sesi login telah kedaluwarsa. Silakan muat ulang halaman.')
        return
      }

      const { error } = await supabase.from('content_suggestions').insert({
        type,
        related_entry_id: relatedEntryId || null,
        submitted_by: user.id,
        submitted_role: profile?.role || 'petani',
        content_note: contentNote.trim(),
        status: 'diterima_menunggu_tinjauan',
      })

      if (error) {
        console.error('Error inserting suggestion:', error)
        setErrorMessage(error.message || 'Gagal mengirim usulan.')
      } else {
        setSubmitSuccess(true)
        setContentNote('')
        setRelatedEntryId('')
        loadData()
      }
    } catch (err: unknown) {
      console.error('Submit suggestion exception:', err)
      setErrorMessage('Terjadi kesalahan jaringan.')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: SuggestionItem['status']) => {
    switch (status) {
      case 'digunakan_dalam_pembaruan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#3A5A40]/15 text-[#3A5A40] border border-[#3A5A40]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Diterima & Digunakan
          </span>
        )
      case 'tidak_digunakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#8C3A3A]/15 text-[#8C3A3A] border border-[#8C3A3A]/30">
            <XCircle className="w-3.5 h-3.5" />
            Tidak Digunakan
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#E6A15C]/20 text-[#A6611A] border border-[#E6A15C]/40">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Tinjauan Admin
          </span>
        )
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-6xl w-full mx-auto text-[#0E080A]">
      {/* HEADER SECTION */}
      <div className="card-standard p-6 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#C4487A] tracking-wider">
              Partisipasi Lapangan &bull; Use Case Pelaporan
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#0E080A] mt-1">
              Usulan & Koreksi Pengetahuan
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3A32] mt-1 max-w-2xl leading-relaxed">
              Ajukan pengalaman praktis di sawah, varietas unggulan lokal, atau koreksi jika menemukan informasi yang keliru pada materi SIMANTRI. Setiap usulan akan ditinjau langsung oleh Admin & Penyuluh.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loadingList}
            className="self-start md:self-auto p-2 text-xs font-semibold text-[#4A3A32] bg-white border border-[#E5DFD6] hover:bg-[#FBF4EE] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
            <span>Segarkan Status</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMNS: FORM (LEFT) & MY SUGGESTIONS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: FORM SUBMIT USULAN (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-standard p-6 border border-[#E5DFD6] bg-white shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5DFD6]">
              <div className="w-8 h-8 rounded-lg bg-[#C4487A]/10 text-[#C4487A] flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-[#0E080A]">
                  Formulir Pengajuan Usulan
                </h2>
                <p className="text-[11px] text-[#8A8580]">
                  Kirim catatan langsung ke pengelola sistem
                </p>
              </div>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-[#3A5A40]/10 border border-[#3A5A40]/30 text-[#3A5A40] text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Usulan Berhasil Dikirim!</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Terima kasih atas kontribusi Anda. Usulan Anda sekarang tercatat dan menunggu tinjauan dari Admin.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/30 text-[#8C3A3A] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipe Usulan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0E080A]">
                  Jenis Pengajuan <span className="text-[#8C3A3A]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('usulan_pembaruan')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      type === 'usulan_pembaruan'
                        ? 'bg-[#C4487A] text-white border-[#C4487A] shadow-sm'
                        : 'bg-[#FBF4EE] border-[#E5DFD6] text-[#4A3A32] hover:bg-white'
                    }`}
                  >
                    Usulan Baru / Tips
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('laporan_keliru')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      type === 'laporan_keliru'
                        ? 'bg-[#8C3A3A] text-white border-[#8C3A3A] shadow-sm'
                        : 'bg-[#FBF4EE] border-[#E5DFD6] text-[#4A3A32] hover:bg-white'
                    }`}
                  >
                    Lapor Info Keliru
                  </button>
                </div>
              </div>

              {/* Artikel Rujukan (Opsional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0E080A]">
                  Rujukan Dokumen Knowledge Base (Opsional)
                </label>
                <select
                  value={relatedEntryId}
                  onChange={(e) => setRelatedEntryId(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A] text-[#0E080A]"
                >
                  <option value="">-- Tidak Terkait Entri Tertentu --</option>
                  {kbEntries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      [{entry.category.toUpperCase()}] {entry.title}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#8A8580]">
                  Pilih jika usulan Anda mengoreksi salah satu dari 39 artikel resmi SIMANTRI.
                </p>
              </div>

              {/* Isi Catatan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0E080A]">
                  Catatan Usulan / Penjelasan <span className="text-[#8C3A3A]">*</span>
                </label>
                <textarea
                  rows={5}
                  value={contentNote}
                  onChange={(e) => setContentNote(e.target.value)}
                  placeholder="Contoh: Menurut pengalaman kelompok tani kami di Rejoso, penggunaan mulsa perak-hitam di musim hujan efektif mengurangi trotol..."
                  className="w-full p-3 text-xs rounded-xl border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A] leading-relaxed text-[#0E080A]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-[#C4487A] hover:bg-[#A83A68] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirimkan Usulan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#E6A15C]" />
                    <span>Kirim Usulan ke Admin &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: MY SUGGESTIONS LIST (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#0E080A]">
              Riwayat Status Usulan Saya ({suggestions.length})
            </h3>
            <span className="text-[11px] text-[#8A8580]">
              Terhubung langsung ke Supabase RLS
            </span>
          </div>

          {loadingList ? (
            <div className="card-standard p-8 text-center bg-white border border-[#E5DFD6]">
              <Loader2 className="w-6 h-6 animate-spin text-[#C4487A] mx-auto mb-2" />
              <p className="text-xs text-[#8A8580]">Memuat daftar usulan...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="card-standard p-8 text-center bg-white border border-[#E5DFD6] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FBF4EE] text-[#8A8580] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0E080A]">
                  Belum ada usulan atau laporan yang diajukan.
                </p>
                <p className="text-[11px] text-[#8A8580] mt-1 max-w-sm mx-auto">
                  Gunakan formulir di sebelah kiri untuk berbagi pengetahuan atau mengoreksi materi budidaya.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="card-standard p-4 sm:p-5 bg-white border border-[#E5DFD6] space-y-3 hover:shadow-md transition-shadow"
                >
                  {/* Header & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          item.type === 'laporan_keliru'
                            ? 'bg-[#8C3A3A]/10 text-[#8C3A3A] border border-[#8C3A3A]/20'
                            : 'bg-[#C4487A]/10 text-[#C4487A] border border-[#C4487A]/20'
                        }`}
                      >
                        {item.type === 'laporan_keliru' ? 'Laporan Kesalahan' : 'Usulan Baru'}
                      </span>
                      <span className="text-[11px] text-[#8A8580] font-mono">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {getStatusBadge(item.status)}
                  </div>

                  {/* Related Article (if any) */}
                  {item.related_entry?.title && (
                    <div className="p-2 rounded-lg bg-[#FBF4EE] border border-[#E5DFD6] text-xs flex items-center gap-2 text-[#4A3A32]">
                      <BookOpen className="w-3.5 h-3.5 text-[#C4487A] shrink-0" />
                      <span className="truncate">
                        Rujukan KB: <strong className="text-[#0E080A]">{item.related_entry.title}</strong>
                      </span>
                    </div>
                  )}

                  {/* Farmer Content Note */}
                  <div className="text-xs text-[#0E080A] bg-[#FAFAF8] p-3 rounded-xl border border-[#E5DFD6]/60 leading-relaxed">
                    &ldquo;{item.content_note}&rdquo;
                  </div>

                  {/* Admin Review Note (If reviewed) */}
                  {item.review_note && (
                    <div className="p-3 rounded-xl bg-[#3A5A40]/5 border-l-4 border-l-[#3A5A40] border border-[#3A5A40]/20 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#3A5A40]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Tanggapan Tim Admin / Penyuluh:</span>
                      </div>
                      <p className="text-[#4A3A32] leading-relaxed">
                        {item.review_note}
                      </p>
                      {item.reviewed_at && (
                        <p className="text-[10px] text-[#8A8580] font-mono">
                          Ditinjau pada:{' '}
                          {new Date(item.reviewed_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
