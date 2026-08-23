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
  ShieldAlert,
  Search,
  Check,
  X,
  MessageSquare,
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

    if (!error && list) {
      setSuggestions(list as unknown as AdminSuggestionItem[])
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
    <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-6xl w-full mx-auto text-[#0E080A]">
      {/* HEADER SECTION */}
      <div className="card-standard p-6 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#C4487A] tracking-wider">
              Moderasi & Validasi Konten
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#0E080A] mt-1">
              Peninjauan Usulan & Koreksi Petani
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3A32] mt-1 max-w-2xl leading-relaxed">
              Tinjau laporan koreksi atau tips budidaya yang dikirimkan oleh petani dan penyuluh lapangan. Anda dapat menyetujui untuk pembaruan basis pengetahuan atau menolak dengan catatan.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 text-xs font-semibold text-[#4A3A32] bg-white border border-[#E5DFD6] hover:bg-[#FBF4EE] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan Antrean</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {[
          { label: 'Semua Usulan', val: 'all' },
          { label: 'Menunggu Tinjauan', val: 'diterima_menunggu_tinjauan' },
          { label: 'Diterima', val: 'digunakan_dalam_pembaruan' },
          { label: 'Tidak Digunakan', val: 'tidak_digunakan' },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setFilterStatus(tab.val)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filterStatus === tab.val
                ? 'bg-[#C4487A] text-white border-[#C4487A] shadow-sm'
                : 'bg-white border-[#E5DFD6] text-[#4A3A32] hover:bg-[#FBF4EE]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIST OF SUGGESTIONS */}
      {loading ? (
        <div className="card-standard p-12 text-center bg-white border border-[#E5DFD6]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A] mx-auto mb-2" />
          <p className="text-xs text-[#8A8580]">Memuat usulan masuk...</p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="card-standard p-12 text-center bg-white border border-[#E5DFD6]">
          <ClipboardCheck className="w-8 h-8 text-[#8A8580] mx-auto mb-2" />
          <p className="text-xs text-[#8A8580]">Tidak ada usulan dalam filter ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((item) => (
            <div
              key={item.id}
              className="card-standard p-5 bg-white border border-[#E5DFD6] space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DFD6]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center font-bold text-xs">
                    {item.submitter?.full_name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0E080A]">
                      {item.submitter?.full_name || 'Petani Anonim'}
                      <span className="ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FBF4EE] border border-[#E5DFD6] text-[#8A8580]">
                        {item.submitted_role}
                      </span>
                    </p>
                    <p className="text-[10px] text-[#8A8580]">
                      {item.submitter?.village || 'Kabupaten Nganjuk'} &bull;{' '}
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
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold border ${
                      item.type === 'laporan_keliru'
                        ? 'bg-[#8C3A3A]/10 text-[#8C3A3A] border-[#8C3A3A]/30'
                        : 'bg-[#C4487A]/10 text-[#C4487A] border-[#C4487A]/30'
                    }`}
                  >
                    {item.type === 'laporan_keliru' ? 'Laporan Keliru' : 'Usulan Baru'}
                  </span>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold border ${
                      item.status === 'digunakan_dalam_pembaruan'
                        ? 'bg-[#3A5A40]/15 text-[#3A5A40] border-[#3A5A40]/30'
                        : item.status === 'tidak_digunakan'
                        ? 'bg-[#8C3A3A]/15 text-[#8C3A3A] border-[#8C3A3A]/30'
                        : 'bg-[#E6A15C]/20 text-[#A6611A] border-[#E6A15C]/40'
                    }`}
                  >
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Rujukan KB */}
              {item.related_entry?.title && (
                <div className="p-2 rounded-lg bg-[#FBF4EE] border border-[#E5DFD6] text-xs flex items-center gap-2 text-[#4A3A32]">
                  <BookOpen className="w-3.5 h-3.5 text-[#C4487A] shrink-0" />
                  <span>
                    Merujuk pada Artikel: <strong>{item.related_entry.title}</strong>
                  </span>
                </div>
              )}

              {/* Isi Usulan */}
              <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5DFD6] text-xs text-[#0E080A] leading-relaxed">
                &ldquo;{item.content_note}&rdquo;
              </div>

              {/* Review Note (if already reviewed) */}
              {item.review_note && (
                <div className="p-3 rounded-xl bg-[#3A5A40]/5 border-l-4 border-l-[#3A5A40] border border-[#3A5A40]/20 text-xs space-y-0.5">
                  <p className="font-bold text-[#3A5A40]">Catatan Review Tim:</p>
                  <p className="text-[#4A3A32]">{item.review_note}</p>
                </div>
              )}

              {/* Action Buttons for Admin */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                {activeReviewId === item.id ? (
                  <div className="w-full p-4 rounded-xl bg-[#FBF4EE] border border-[#E5DFD6] space-y-3 mt-2">
                    <label className="text-xs font-semibold text-[#0E080A] block">
                      Catatan Peninjauan / Tanggapan untuk Petani:
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNoteInput}
                      onChange={(e) => setReviewNoteInput(e.target.value)}
                      placeholder="Tuliskan alasan persetujuan atau penolakan..."
                      className="w-full p-2.5 text-xs rounded-lg border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveReviewId(null)}
                        className="px-3 py-1.5 text-xs text-[#8A8580] hover:bg-[#E5DFD6] rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(item.id, 'tidak_digunakan', reviewNoteInput)
                        }
                        disabled={updating}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#8C3A3A] hover:bg-[#722F2F] text-white rounded-lg flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Tolak Usulan
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            item.id,
                            'digunakan_dalam_pembaruan',
                            reviewNoteInput
                          )
                        }
                        disabled={updating}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#3A5A40] hover:bg-[#2D4632] text-white rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Terima & Gunakan
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveReviewId(item.id)
                      setReviewNoteInput(item.review_note || '')
                    }}
                    className="py-1.5 px-3.5 rounded-lg text-xs font-semibold bg-[#4A1F2B] hover:bg-[#6B2F3E] text-white shadow-sm flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#E6A15C]" />
                    <span>Tinjau & Beri Tanggapan</span>
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
