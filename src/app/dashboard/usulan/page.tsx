'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useState, useEffect, useCallback } from 'react'
import { Skeleton, Toast } from '@/components/ui/Experience'
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
  RefreshCw,
  Loader2,
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
  const { t } = useLanguage()
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
    const timer = window.setTimeout(() => { void loadData() }, 0)
    return () => window.clearTimeout(timer)
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#3A5A40]/15 dark:bg-[var(--theme-green-soft)] text-[#3A5A40] dark:text-[var(--theme-green)] border border-[#3A5A40]/30 dark:border-[var(--theme-green)]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("Diterima & Digunakan")}</span>
        )
      case 'tidak_digunakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#8C3A3A]/15 dark:bg-[var(--theme-red-soft)] text-[#8C3A3A] dark:text-[var(--theme-red)] border border-[#8C3A3A]/30 dark:border-[var(--theme-red)]/30">
            <XCircle className="w-3.5 h-3.5" />
            {t("Tidak Digunakan")}</span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#E6A15C]/20 dark:bg-[var(--theme-amber-soft)] text-[#A6611A] dark:text-[var(--theme-amber)] border border-[#E6A15C]/40 dark:border-[var(--theme-amber)]/40">
            <Clock className="w-3.5 h-3.5" />
            {t("Menunggu Tinjauan Admin")}</span>
        )
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-6xl w-full mx-auto text-[#0E080A] dark:text-[var(--theme-ink)]">
      {/* HEADER SECTION */}
      <div className="card-standard p-6 bg-gradient-to-r from-white dark:from-[var(--theme-surface)] via-white dark:via-[var(--theme-surface)] to-[#FBF4EE] dark:to-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#C4487A] dark:text-[var(--theme-rose)] tracking-wider">
              {t("Partisipasi Lapangan • Use Case Pelaporan")}</span>
            <h1 className="text-2xl font-serif font-bold text-[#0E080A] dark:text-[var(--theme-ink)] mt-1">
              {t("Usulan & Koreksi Pengetahuan")}</h1>
            <p className="text-xs sm:text-sm text-[#4A3A32] dark:text-[var(--theme-body)] mt-1 max-w-2xl leading-relaxed">
              {t("Ajukan pengalaman praktis di sawah, varietas unggulan lokal, atau koreksi jika menemukan informasi yang keliru pada materi SIMANTRI. Setiap usulan akan ditinjau langsung oleh Admin & Penyuluh.")}</p>
          </div>

          <button
            onClick={loadData}
            disabled={loadingList}
            className="self-start md:self-auto p-2 text-xs font-semibold text-[#4A3A32] dark:text-[var(--theme-body)] bg-white dark:bg-[var(--theme-surface)] border border-[#E5DFD6] dark:border-[var(--theme-line)] hover:bg-[#FBF4EE] dark:hover:bg-[var(--theme-canvas)] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
            <span>{t("Segarkan Status")}</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMNS: FORM (LEFT) & MY SUGGESTIONS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: FORM SUBMIT USULAN (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-standard p-6 border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5DFD6] dark:border-[var(--theme-line)]">
              <div className="w-8 h-8 rounded-lg bg-[#C4487A]/10 dark:bg-[var(--theme-rose-soft)] text-[#C4487A] dark:text-[var(--theme-rose)] flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-[#0E080A] dark:text-[var(--theme-ink)]">
                  {t("Formulir Pengajuan Usulan")}</h2>
                <p className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)]">
                  {t("Kirim catatan langsung ke pengelola sistem")}</p>
              </div>
            </div>

            {submitSuccess && <Toast message={t("Usulan Anda berhasil dikirim.")} onDismiss={() => setSubmitSuccess(false)} />}

            {errorMessage && (
              <div role="alert" className="p-3.5 rounded-xl bg-[#8C3A3A]/10 dark:bg-[var(--theme-red-soft)] border border-[#8C3A3A]/30 dark:border-[var(--theme-red)]/30 text-[#8C3A3A] dark:text-[var(--theme-red)] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t("Usulan belum terkirim. Pastikan isi usulan sudah diisi dan koneksi tersedia, lalu coba kembali.")}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipe Usulan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">
                  {t("Jenis Pengajuan")} <span className="text-[#8C3A3A] dark:text-[var(--theme-red)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('usulan_pembaruan')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      type === 'usulan_pembaruan'
                        ? 'bg-[#C4487A] text-white border-[#C4487A] dark:border-[var(--theme-rose)] shadow-sm'
                        : 'bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border-[#E5DFD6] dark:border-[var(--theme-line)] text-[#4A3A32] dark:text-[var(--theme-body)] hover:bg-white dark:hover:bg-[var(--theme-surface)]'
                    }`}
                  >
                    {t("Usulan Baru / Tips")}</button>
                  <button
                    type="button"
                    onClick={() => setType('laporan_keliru')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      type === 'laporan_keliru'
                        ? 'bg-[#8C3A3A] text-white border-[#8C3A3A] dark:border-[var(--theme-red)] shadow-sm'
                        : 'bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border-[#E5DFD6] dark:border-[var(--theme-line)] text-[#4A3A32] dark:text-[var(--theme-body)] hover:bg-white dark:hover:bg-[var(--theme-surface)]'
                    }`}
                  >
                    {t("Lapor Info Keliru")}</button>
                </div>
              </div>

              {/* Artikel Rujukan (Opsional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">
                  {t("Rujukan Dokumen Knowledge Base (Opsional)")}</label>
                <select
                  aria-label={t("Rujukan dokumen knowledge base")}
                  value={relatedEntryId}
                  onChange={(e) => setRelatedEntryId(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] focus:outline-none focus:border-[#C4487A] dark:focus:border-[var(--theme-rose)] text-[#0E080A] dark:text-[var(--theme-ink)]"
                >
                  <option value="">{t("-- Tidak Terkait Entri Tertentu --")}</option>
                  {kbEntries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      [{entry.category.toUpperCase()}] {entry.title}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#8A8580] dark:text-[var(--theme-muted)]">
                  {t("Pilih jika usulan Anda mengoreksi salah satu dari 39 artikel resmi SIMANTRI.")}</p>
              </div>

              {/* Isi Catatan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">
                  {t("Catatan Usulan / Penjelasan")} <span className="text-[#8C3A3A] dark:text-[var(--theme-red)]">*</span>
                </label>
                <textarea
                  aria-label={t("Catatan usulan atau penjelasan")}
                  aria-required="true"
                  aria-invalid={Boolean(errorMessage) && !contentNote.trim()}
                  rows={5}
                  value={contentNote}
                  onChange={(e) => setContentNote(e.target.value)}
                  placeholder={t("Contoh: Menurut pengalaman kelompok tani kami di Rejoso, penggunaan mulsa perak-hitam di musim hujan efektif mengurangi trotol...")}
                  className="w-full p-3 text-xs rounded-xl border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] focus:outline-none focus:border-[#C4487A] dark:focus:border-[var(--theme-rose)] leading-relaxed text-[#0E080A] dark:text-[var(--theme-ink)]"
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
                    <span>{t("Mengirimkan Usulan...")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#E6A15C]" />
                    <span>{t("Kirim Usulan ke Admin →")}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: MY SUGGESTIONS LIST (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#0E080A] dark:text-[var(--theme-ink)]">
              {t("Riwayat Status Usulan Saya (")}{suggestions.length})
            </h3>
            <span className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)]">
              {t("Terhubung langsung ke Supabase RLS")}</span>
          </div>

          {loadingList ? (
            <div className="card-standard p-8 space-y-3 bg-white dark:bg-[var(--theme-surface)] border border-[#E5DFD6] dark:border-[var(--theme-line)]" role="status" aria-label={t("Memuat daftar usulan")}>
              <Skeleton className="h-6 w-2/3" /><Skeleton className="h-16" /><Skeleton className="h-6 w-1/3" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="card-standard p-8 text-center bg-white dark:bg-[var(--theme-surface)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] text-[#8A8580] dark:text-[var(--theme-muted)] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">
                  {t("Belum ada usulan atau laporan yang diajukan.")}</p>
                <p className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)] mt-1 max-w-sm mx-auto">
                  {t("Gunakan formulir di sebelah kiri untuk berbagi pengetahuan atau mengoreksi materi budidaya.")}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="card-standard p-4 sm:p-5 bg-white dark:bg-[var(--theme-surface)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-3 hover:shadow-md transition-shadow"
                >
                  {/* Header & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          item.type === 'laporan_keliru'
                            ? 'bg-[#8C3A3A]/10 dark:bg-[var(--theme-red-soft)] text-[#8C3A3A] dark:text-[var(--theme-red)] border border-[#8C3A3A]/20 dark:border-[var(--theme-red)]/20'
                            : 'bg-[#C4487A]/10 dark:bg-[var(--theme-rose-soft)] text-[#C4487A] dark:text-[var(--theme-rose)] border border-[#C4487A]/20 dark:border-[var(--theme-rose)]/20'
                        }`}
                      >
                        {item.type === 'laporan_keliru' ? t("Laporan Kesalahan") : t("Usulan Baru")}
                      </span>
                      <span className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)] font-mono">
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
                    <div className="p-2 rounded-lg bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] text-xs flex items-center gap-2 text-[#4A3A32] dark:text-[var(--theme-body)]">
                      <BookOpen className="w-3.5 h-3.5 text-[#C4487A] dark:text-[var(--theme-rose)] shrink-0" />
                      <span className="truncate">
                        {t("Rujukan KB:")} <strong className="text-[#0E080A] dark:text-[var(--theme-ink)]">{t(item.related_entry.title)}</strong>
                      </span>
                    </div>
                  )}

                  {/* Farmer Content Note */}
                  <div className="text-xs text-[#0E080A] dark:text-[var(--theme-ink)] bg-[#FAFAF8] dark:bg-[var(--theme-canvas)] p-3 rounded-xl border border-[#E5DFD6]/60 dark:border-[var(--theme-line)] leading-relaxed">
                    {"“"}{item.content_note}{"”"}</div>

                  {/* Admin Review Note (If reviewed) */}
                  {item.review_note && (
                    <div className="p-3 rounded-xl bg-[#3A5A40]/5 dark:bg-[var(--theme-green-soft)] border-l-4 border-l-[#3A5A40] border border-[#3A5A40]/20 dark:border-[var(--theme-green)]/20 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#3A5A40] dark:text-[var(--theme-green)]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t("Tanggapan Tim Admin / Penyuluh:")}</span>
                      </div>
                      <p className="text-[#4A3A32] dark:text-[var(--theme-body)] leading-relaxed">
                        {item.review_note}
                      </p>
                      {item.reviewed_at && (
                        <p className="text-[10px] text-[#8A8580] dark:text-[var(--theme-muted)] font-mono">
                          {t("Ditinjau pada:")}{' '}
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
