'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  Camera,
  Upload,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Loader2,
  ChevronRight,
  Info,
  Bug,
  Leaf,
} from 'lucide-react'
import { openSimaAssistant } from '@/components/dashboard/FloatingAssistant'
import { Toast, Skeleton } from '@/components/ui/Experience'
import { PageHeading } from '@/components/dashboard/DashboardUI'

interface DetectionDisplayResult {
  result_id: string
  predicted_class: string
  display_name: string | null
  category: string
  confidence: number
  bbox?: { x: number; y: number; width: number; height: number }
  farmer_feedback?: 'sesuai' | 'tidak_sesuai' | null
  farmer_correction_note?: string | null
}

interface DetectionResponseData {
  detection_id: string
  image_url: string
  results: DetectionDisplayResult[]
  results_for_display: DetectionDisplayResult[]
  disclaimer: string
  has_disease: boolean
  all_healthy: boolean
  total_detected_objects: number
}

interface HistoryItem {
  id: string
  image_url: string
  created_at: string
  results: {
    id: string
    predicted_class: string
    confidence: number
    farmer_feedback: 'sesuai' | 'tidak_sesuai' | null
  }[]
}

const CV_CLASS_MAP: Record<string, { category: string; displayName: string }> = {
  Antranoksa: { category: 'disease', displayName: 'Antraknosa' },
  Antraknosa: { category: 'disease', displayName: 'Antraknosa' },
  'Daun-Bawang': { category: 'anatomy', displayName: 'Daun Bawang' },
  Moler: { category: 'disease', displayName: 'Moler' },
  Moleh: { category: 'disease', displayName: 'Moler' },
  'Pucuk-Daun': { category: 'anatomy', displayName: 'Pucuk Daun' },
  Sehat: { category: 'healthy', displayName: 'Sehat' },
  Trotol: { category: 'disease', displayName: 'Trotol' },
}

export default function DiseaseDetectionPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)

  // Upload & Detection State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DetectionResponseData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [feedbackNotice, setFeedbackNotice] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Feedback State
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(null)
  const [correctionNote, setCorrectionNote] = useState<string>('')

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  // 1. Auth check
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setAuthLoading(false)
    }

    checkAuth()
  }, [router])

  // 2. Load detection history
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: historyData, error } = await supabase
      .from('cv_detections')
      .select(`
        id,
        image_url,
        created_at,
        results:cv_detection_results(id, predicted_class, confidence, farmer_feedback)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!error && historyData) {
      setHistory(historyData as unknown as HistoryItem[])
    }
    setHistoryLoading(false)
  }, [])

  useEffect(() => {
    if (!authLoading) {
      const timer = window.setTimeout(() => {
        void loadHistory()
      }, 0)
      return () => window.clearTimeout(timer)
    }
  }, [authLoading, loadHistory])

  // Handle file select
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Hanya file gambar (JPG, PNG, WebP) yang diperbolehkan.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran file terlalu besar. Maksimal 10MB.')
      return
    }

    setErrorMessage(null)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setAnalysisResult(null)
  }

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // Run AI Detection
  const handleAnalyze = async () => {
    if (!selectedFile || analyzing) return

    setAnalyzing(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/detect-disease', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (json.error) {
        setErrorMessage('Foto belum berhasil dianalisis. Periksa koneksi dan coba kembali.')
      } else if (json.data) {
        setAnalysisResult(json.data as DetectionResponseData)
        loadHistory() // Refresh recent history
      }
    } catch (err: unknown) {
      console.error('Detection request error:', err)
      setErrorMessage('Koneksi terputus. Pastikan server lokal terhubung dan coba lagi.')
    } finally {
      setAnalyzing(false)
    }
  }

  // Send Farmer Feedback
  const handleSendFeedback = async (
    resultId: string,
    feedbackType: 'sesuai' | 'tidak_sesuai',
    note?: string
  ) => {
    setFeedbackSending(resultId)

    // Optimistic UI update in current results
    if (analysisResult) {
      setAnalysisResult({
        ...analysisResult,
        results_for_display: analysisResult.results_for_display.map((r) =>
          r.result_id === resultId
            ? { ...r, farmer_feedback: feedbackType, farmer_correction_note: note || null }
            : r
        ),
      })
    }

    try {
      const res = await fetch(`/api/detect-disease/results/${resultId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_feedback: feedbackType,
          farmer_correction_note: note || '',
        }),
      })

      const json = await res.json()
      if (!json.error && res.ok) {
        setFeedbackNotice('Terima kasih, feedback Anda sudah tercatat.')
        setActiveCorrectionId(null)
        setCorrectionNote('')
        loadHistory()
      }
    } catch (err) {
      console.error('Error submitting feedback:', err)
    } finally {
      setFeedbackSending(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-[55vh] flex flex-1 items-center justify-center bg-[var(--sim-canvas)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--sim-color-primary)] dark:text-[var(--theme-green)]" />
          <p className="text-sm font-medium text-[var(--sim-color-body)]">{t("Memuat modul deteksi...")}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="sim-page mx-auto w-full max-w-[1440px] space-y-6">
      {feedbackNotice && <Toast message={feedbackNotice} onDismiss={() => setFeedbackNotice('')} />}
      <PageHeading title={t("Deteksi Penyakit")} description={t("Unggah foto tanaman bawang merah untuk mengidentifikasi penyakit dan mendapatkan rekomendasi penanganan.")} icon={Leaf} action={<Link href="/dashboard/chat" className="sim-button-secondary"><Sparkles className="h-4 w-4 text-[var(--sim-color-primary)] dark:text-[var(--theme-green)]" aria-hidden="true" />{t("Konsultasi SIMA")}</Link>} />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="sim-card-flat flex items-start gap-3 p-4"><div className="sim-icon-tile"><Upload className="h-5 w-5" aria-hidden="true" /></div><div><h2 className="font-bold text-[var(--sim-color-foreground)]">{t("Unggah cepat")}</h2><p className="mt-1 text-xs leading-5 text-[var(--sim-color-muted)]">{t("Pilih satu foto daun atau bagian tanaman yang ingin dianalisis.")}</p></div></div>
        <div className="sim-card-flat flex items-start gap-3 p-4"><div className="sim-icon-tile"><ShieldAlert className="h-5 w-5" aria-hidden="true" /></div><div><h2 className="font-bold text-[var(--sim-color-foreground)]">{t("Hasil terukur")}</h2><p className="mt-1 text-xs leading-5 text-[var(--sim-color-muted)]">{t("Model menampilkan objek, kelas, dan confidence dari foto Anda.")}</p></div></div>
        <div className="sim-card-flat flex items-start gap-3 bg-[var(--sim-amber-50)] p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[var(--theme-surface)] text-[var(--sim-amber-500)]"><Info className="h-5 w-5" aria-hidden="true" /></div><div><h2 className="font-bold text-[var(--sim-color-foreground)]">{t("Panduan tindak lanjut")}</h2><p className="mt-1 text-xs leading-5 text-[var(--sim-color-muted)]">{t("Gunakan hasil sebagai bahan diskusi dengan penyuluh atau SIMA.")}</p></div></div>
      </div>

        {/* UPLOAD & ANALYSIS SECTION */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* LEFT: UPLOAD ZONE (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sim-card min-h-[340px] border-2 border-dashed border-[var(--sim-color-border)] bg-white dark:bg-[var(--theme-surface)] p-6 text-center transition-colors hover:border-[var(--sim-green-500)] relative flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0])
                  }
                }}
              />

              {previewUrl ? (
                <div className="w-full space-y-4">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-[#0E080A]/5 dark:bg-[var(--theme-raised)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={t("Preview tanaman")}
                      className="sim-result w-full h-full object-contain"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setAnalysisResult(null)
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow"
                      title={t("Ganti Foto")}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8A8580] dark:text-[var(--theme-muted)] px-1">
                    <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                    <span>{((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)}  {t("MB")}</span>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragActive(false) }}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label={t("Pilih foto tanaman")}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInputRef.current?.click() } }}
                  className={`cursor-pointer rounded-2xl border-2 py-10 px-4 w-full flex flex-col items-center justify-center space-y-3 group transition-colors ${dragActive ? 'border-simantri-500 dark:border-[var(--theme-green)] bg-simantri-50 dark:bg-[var(--theme-green-soft)]' : 'border-transparent'}`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--sim-green-50)] text-[var(--sim-color-primary)] dark:text-[var(--theme-green)] shadow-sm transition-colors group-hover:bg-[var(--sim-green-100)]">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">
                      {t("Tarik & Letakkan Foto di Sini")}</p>
                    <p className="text-xs text-[#8A8580] dark:text-[var(--theme-muted)] mt-1">
                      {t("atau klik untuk memilih file foto dari galeri/kamera")}</p>
                  </div>
                  <div className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)]">
                    {t("Format: JPG, PNG • Maks 10MB")}</div>
                </div>
              )}
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
              <div role="alert" className="p-4 rounded-xl bg-[#8C3A3A]/10 dark:bg-[var(--theme-red-soft)] border border-[#8C3A3A]/25 dark:border-[var(--theme-red)]/25 text-[#8C3A3A] dark:text-[var(--theme-red)] text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{t(errorMessage)}</div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || analyzing}
              className="sim-button-primary w-full py-3.5 px-6"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t("Sedang Menganalisis...")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6A15C]" />
                  <span>{t("Analisis Foto Tanaman →")}</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: RESULTS DISPLAY (7 cols) */}
          <div className="lg:col-span-7">
            {analyzing ? (
              /* LOADING STATE */
              <div className="card-standard p-8 min-h-[340px] flex flex-col items-center justify-center text-center space-y-4 border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#C4487A]/20 dark:border-[var(--theme-rose)]/20 border-t-[#C4487A] animate-spin" />
                  <Camera className="w-6 h-6 text-[#C4487A] dark:text-[var(--theme-rose)] absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">
                    {t("Mendeteksi Pola Patogen & Kondisi Daun...")}</h3>
                  <p className="text-xs text-[#8A8580] dark:text-[var(--theme-muted)] max-w-sm">
                    {t("Model YOLOv8 sedang mengekstraksi bounding box dan menghitung tingkat kepercayaan diagnosis.")}</p>
                </div>
              </div>
            ) : analysisResult ? (
              /* RESULTS PRESENTATION */
              <div key={analysisResult.detection_id} className="sim-result space-y-6">
                {/* 1. MANDATORY DISCLAIMER BOX */}
                <div className="p-4 rounded-xl bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border-l-4 border-l-[#E6A15C] border border-[#E5DFD6] dark:border-[var(--theme-line)] text-xs text-[#4A3A32] dark:text-[var(--theme-body)] space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">
                    <ShieldAlert className="w-4 h-4 text-[#E6A15C]" />
                    <span>{t("Disclaimer Wajib Sistem AI")}</span>
                  </div>
                  <p className="leading-relaxed">
                    {analysisResult.disclaimer}
                  </p>
                </div>

                {/* 2. SUMMARY STATUS CARD */}
                <div
                  className={`p-5 rounded-2xl border ${
                    analysisResult.has_disease
                      ? 'bg-[#C4487A]/5 dark:bg-[var(--theme-rose-soft)] border-[#C4487A]/30 dark:border-[var(--theme-rose)]/30'
                      : analysisResult.all_healthy
                      ? 'bg-[#3A5A40]/5 dark:bg-[var(--theme-green-soft)] border-[#3A5A40]/30 dark:border-[var(--theme-green)]/30'
                      : 'bg-white dark:bg-[var(--theme-surface)] border-[#E5DFD6] dark:border-[var(--theme-line)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {analysisResult.has_disease ? (
                      <div className="w-10 h-10 rounded-xl bg-[#C4487A] text-white flex items-center justify-center shadow-sm">
                        <Bug className="w-5 h-5" />
                      </div>
                    ) : analysisResult.all_healthy ? (
                      <div className="w-10 h-10 rounded-xl bg-[#3A5A40] text-white flex items-center justify-center shadow-sm">
                        <Leaf className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#8A8580] text-white flex items-center justify-center shadow-sm">
                        <Info className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">
                        {analysisResult.has_disease
                          ? t("Terdeteksi Gejala Penyakit")
                          : analysisResult.all_healthy
                          ? t("Tanaman Terindikasi Sehat")
                          : t("Bagian Tanaman Terdeteksi")}
                      </h3>
                      <p className="text-xs text-[#4A3A32] dark:text-[var(--theme-body)]">
                        {analysisResult.has_disease
                          ? t("Ditemukan indikasi serangan patogen pada foto yang Anda unggah.")
                          : analysisResult.all_healthy
                          ? t("Tidak ditemukan tanda infeksi jamur atau bakteri yang nyata.")
                          : t("Foto berisi anatomi daun bawang merah, namun belum menunjukkan indikasi patogen spesifik.")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. DETECTION ITEMS LIST (DISEASE & HEALTHY ONLY) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8A8580] dark:text-[var(--theme-muted)]">
                      {t("Hasil Diagnosis Objek (")}{analysisResult.results_for_display.length}):
                    </h4>
                    <span className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)]">
                      {t("Total objek terdeteksi model:")} {analysisResult.total_detected_objects}
                    </span>
                  </div>

                  {analysisResult.results_for_display.length === 0 ? (
                    <div className="p-6 rounded-xl border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] text-center space-y-2">
                      <p className="text-xs text-[#4A3A32] dark:text-[var(--theme-body)] font-medium">
                        {t("Foto terdeteksi berisi tanaman bawang merah, namun sistem belum bisa menyimpulkan kondisi kesehatannya secara tegas.")}</p>
                      <p className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)]">
                        {t("Saran: Ambil foto yang lebih terang dan fokus pada bercak daun yang dicurigai sakit.")}</p>
                    </div>
                  ) : (
                    analysisResult.results_for_display.map((item, idx) => {
                      const conf = Math.round(item.confidence)
                      // Dynamic color thresholds
                      const progressColor =
                        conf >= 70 ? 'bg-[#3A5A40]' : conf >= 40 ? 'bg-[#E6A15C]' : 'bg-[#8A8580]'
                      const textColor =
                        conf >= 70 ? 'text-[#3A5A40] dark:text-[var(--theme-green)]' : conf >= 40 ? 'text-[#C97A2E] dark:text-[var(--theme-amber)]' : 'text-[#8A8580] dark:text-[var(--theme-muted)]'

                      return (
                        <div
                          key={item.result_id || idx}
                          className="card-standard p-4 sm:p-5 border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] space-y-3"
                        >
                          {/* Item Header & Score */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.category === 'disease' ? 'bg-[#C4487A]' : 'bg-[#3A5A40]'
                                }`}
                              />
                              <span className="font-serif font-bold text-sm text-[#0E080A] dark:text-[var(--theme-ink)]">
                                {item.display_name || item.predicted_class}
                              </span>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] text-[#8A8580] dark:text-[var(--theme-muted)]">
                                {t(item.category)}
                              </span>
                            </div>
                            <span className={`text-xs font-mono font-bold ${textColor}`}>
                              {conf}{t("% Confidence")}</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 rounded-full bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] overflow-hidden">
                            <div
                              className={`sim-confidence h-full ${progressColor}`}
                              style={{ width: `${Math.min(100, Math.max(0, conf))}%`, animationDelay: '80ms' }}
                            />
                          </div>

                          {/* Quick AI Consultation Trigger */}
                          <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#4A1F2B]/5 dark:from-[var(--theme-rose-soft)] to-[#C4487A]/10 dark:to-[var(--theme-rose-soft)] border border-[#C4487A]/20 dark:border-[var(--theme-rose)]/20 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white dark:bg-[var(--theme-surface)] border border-[#C4487A]/30 dark:border-[var(--theme-rose)]/30">
                                <Image
                                  src="/logo_sima.png"
                                  alt="SIMA"
                                  width={20}
                                  height={20}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="text-[11px] font-medium text-[#0E080A] dark:text-[var(--theme-ink)]">
                                {t("Butuh panduan langkah penanganan penyakit ini?")}</span>
                            </div>
                            <button
                              onClick={() => {
                                const diseaseName = item.display_name || item.predicted_class
                                openSimaAssistant({
                                  prompt: `Saya mendeteksi penyakit ${diseaseName} pada tanaman bawang merah (Keyakinan: ${conf}%). Bagaimana langkah penanganan, dosis obat/fungisida, dan cara mencegah penyebarannya?`,
                                  autoSend: true,
                                })
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#C4487A] hover:bg-[#A83A68] text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs active:translate-y-0 shrink-0"
                            >
                              <Sparkles className="w-3 h-3 text-[#E6A15C]" />
                              {t("Tanya Solusi ke SIMA")}</button>
                          </div>

                          {/* Feedback Section */}
                          <div className="pt-2 border-t border-[#E5DFD6]/60 dark:border-[var(--theme-line)] flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-[#8A8580] dark:text-[var(--theme-muted)]">
                              {t("Apakah hasil diagnosis ini sesuai dengan kondisi riil?")}</span>
                            <div className="flex items-center gap-2">
                              <button
                                aria-pressed={item.farmer_feedback === 'sesuai'}
                                onClick={() => handleSendFeedback(item.result_id, 'sesuai')}
                                aria-busy={feedbackSending === item.result_id}
                                disabled={feedbackSending === item.result_id}
                                className={`min-h-11 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all inline-flex items-center gap-1 ${
                                  item.farmer_feedback === 'sesuai'
                                    ? 'bg-[#3A5A40] text-white border-[#3A5A40] dark:border-[var(--theme-green)]'
                                    : 'border-[#3A5A40] dark:border-[var(--theme-green)] text-[#3A5A40] dark:text-[var(--theme-green)] hover:bg-[#3A5A40]/10 dark:hover:bg-[var(--theme-green-soft)]'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                {t("Sesuai")}</button>

                              <button
                                aria-pressed={item.farmer_feedback === 'tidak_sesuai'}
                                onClick={() => {
                                  if (activeCorrectionId === item.result_id) {
                                    setActiveCorrectionId(null)
                                  } else {
                                    setActiveCorrectionId(item.result_id)
                                    setCorrectionNote('')
                                  }
                                }}
                                disabled={feedbackSending === item.result_id}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all inline-flex items-center gap-1 ${
                                  item.farmer_feedback === 'tidak_sesuai'
                                    ? 'bg-[#8C3A3A] text-white border-[#8C3A3A] dark:border-[var(--theme-red)]'
                                    : 'border-[#8C3A3A] dark:border-[var(--theme-red)] text-[#8C3A3A] dark:text-[var(--theme-red)] hover:bg-[#8C3A3A]/10 dark:hover:bg-[var(--theme-red-soft)]'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                                {t("Tidak Sesuai")}</button>
                            </div>
                          </div>

                          {/* Correction Note Form (If "Tidak Sesuai" clicked) */}
                          {activeCorrectionId === item.result_id && (
                            <div className="p-3 rounded-xl bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-2 mt-2">
                              <label className="text-[11px] font-medium text-[#4A3A32] dark:text-[var(--theme-body)] block">
                                {t("Catatan Koreksi Anda (Opsional):")}</label>
                              <textarea
                                aria-label={t("Catatan koreksi hasil deteksi")}
                                rows={2}
                                value={correctionNote}
                                onChange={(e) => setCorrectionNote(e.target.value)}
                                placeholder={t("Menurut pengalaman saya di sawah, gejala ini sebenarnya adalah...")}
                                className="w-full p-2 text-xs rounded-lg border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] focus:outline-none focus:border-[#C4487A] dark:focus:border-[var(--theme-rose)]"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setActiveCorrectionId(null)}
                                  className="px-2.5 py-1 rounded text-xs text-[#8A8580] dark:text-[var(--theme-muted)] hover:bg-[#E5DFD6] dark:hover:bg-[var(--theme-raised)]"
                                >
                                  {t("Batal")}</button>
                                <button
                                  onClick={() =>
                                    handleSendFeedback(
                                      item.result_id,
                                      'tidak_sesuai',
                                      correctionNote
                                    )
                                  }
                                  className="px-3 py-1 rounded bg-[#8C3A3A] text-white text-xs font-medium hover:bg-[#722F2F]"
                                >
                                  {t("Kirim Feedback")}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            ) : (
              /* EMPTY STATE: 3 STEPS GUIDE */
              <div className="card-standard p-8 border border-[#E5DFD6] dark:border-[var(--theme-line)] bg-white dark:bg-[var(--theme-surface)] space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">
                    {t("Panduan Cepat Deteksi Penyakit")}</h3>
                  <p className="text-xs text-[#8A8580] dark:text-[var(--theme-muted)] mt-1">
                    {t("Ikuti 3 langkah mudah berikut untuk mendapatkan dugaan awal penyakit tanaman Anda:")}</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C4487A] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h4 className="text-xs font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">{t("Foto dari Jarak Dekat")}</h4>
                    <p className="text-[11px] text-[#4A3A32] dark:text-[var(--theme-body)] leading-relaxed">
                      {t("Ambil foto bagian daun atau batang yang terlihat bercak, meliuk, atau layu dengan pencahayaan cukup.")}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E6A15C] text-[#0E080A] dark:text-[var(--theme-ink)] flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h4 className="text-xs font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">{t("Upload ke SIMANTRI")}</h4>
                    <p className="text-[11px] text-[#4A3A32] dark:text-[var(--theme-body)] leading-relaxed">
                      {t("Unggah foto ke sistem. Model YOLOv8 akan menganalisis infeksi jamur atau bakteri dalam hitungan detik.")}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3A5A40] text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h4 className="text-xs font-bold text-[#0E080A] dark:text-[var(--theme-ink)]">{t("Konfirmasi & Tindakan")}</h4>
                    <p className="text-[11px] text-[#4A3A32] dark:text-[var(--theme-body)] leading-relaxed">
                      {t("Gunakan hasil deteksi sebagai bahan diskusi dengan penyuluh terdekat sebelum memilih pestisida atau fungisida.")}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[var(--theme-surface)] border border-[#E5DFD6] dark:border-[var(--theme-line)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#C4487A] dark:text-[var(--theme-rose)]" />
                    <span className="text-xs text-[#4A3A32] dark:text-[var(--theme-body)]">
                      {t("Ingin tahu ciri khas penyakit Trotol vs Moler secara tertulis?")}</span>
                  </div>
                  <Link
                    href="/dashboard/chat"
                    className="text-xs font-semibold text-[#C4487A] dark:text-[var(--theme-rose)] hover:underline inline-flex items-center gap-1"
                  >
                    {t("Tanya SIMA")} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT DETECTIONS HISTORY */}
        <div className="space-y-4 pt-4 border-t border-[#E5DFD6] dark:border-[var(--theme-line)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C4487A] dark:text-[var(--theme-rose)]" />
              <h3 className="font-serif font-bold text-base text-[#0E080A] dark:text-[var(--theme-ink)]">
                {t("Riwayat 5 Deteksi Terakhir Anda")}</h3>
            </div>
            <button
              onClick={loadHistory}
              disabled={historyLoading}
              className="p-1.5 text-xs text-[#8A8580] dark:text-[var(--theme-muted)] hover:text-[#0E080A] dark:hover:text-[var(--theme-ink)] rounded-lg hover:bg-white dark:hover:bg-[var(--theme-surface)] transition-colors"
              title={t("Segarkan Riwayat")}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {historyLoading ? (
            <div className="p-8 text-center bg-white dark:bg-[var(--theme-surface)] rounded-2xl border border-[#E5DFD6] dark:border-[var(--theme-line)]">
              <Skeleton className="mx-auto mb-3 h-20 w-full" />
              <p className="text-xs text-[#8A8580] dark:text-[var(--theme-muted)]">{t("Memuat riwayat deteksi...")}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 text-center bg-white dark:bg-[var(--theme-surface)] rounded-2xl border border-[#E5DFD6] dark:border-[var(--theme-line)]">
              <p className="text-xs text-[#8A8580] dark:text-[var(--theme-muted)]">
                {t("Belum ada riwayat deteksi foto tanaman. Mulai upload foto pertama Anda di atas!")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {history.map((hist) => {
                // Filter only disease/healthy for thumbnail badge
                const displayResults = (hist.results || []).filter((r) => {
                  const ref = CV_CLASS_MAP[r.predicted_class]
                  return ref && (ref.category === 'disease' || ref.category === 'healthy')
                })

                return (
                  <div
                    key={hist.id}
                    className="card-standard p-3 bg-white dark:bg-[var(--theme-surface)] border border-[#E5DFD6] dark:border-[var(--theme-line)] space-y-2 transition-shadow"
                  >
                    <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#FBF4EE] dark:bg-[var(--theme-canvas)] border border-[#E5DFD6] dark:border-[var(--theme-line)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hist.image_url}
                        alt={t("Foto Riwayat")}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#8A8580] dark:text-[var(--theme-muted)] font-mono">
                        <span>
                          {new Date(hist.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <span>
                          {new Date(hist.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1">
                        {displayResults.length > 0 ? (
                          displayResults.map((r, i) => {
                            const ref = CV_CLASS_MAP[r.predicted_class]
                            return (
                              <div
                                key={r.id || i}
                                className="flex items-center justify-between text-[11px]"
                              >
                                <span className="font-semibold text-[#0E080A] dark:text-[var(--theme-ink)] truncate max-w-[90px]">
                                  {ref?.displayName || r.predicted_class}
                                </span>
                                <span className="font-mono text-[10px] text-[#C4487A] dark:text-[var(--theme-rose)]">
                                  {Math.round(r.confidence)}%
                                </span>
                              </div>
                            )
                          })
                        ) : (
                          <span className="text-[10px] text-[#8A8580] dark:text-[var(--theme-muted)] italic block">
                            {t("Anatomi Tanaman")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
    </main>
  )
}
