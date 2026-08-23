'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  Camera,
  Upload,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  Check,
  X,
  MessageSquare,
  RefreshCw,
  Loader2,
  ChevronRight,
  Info,
  Bug,
  Leaf,
} from 'lucide-react'

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
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Upload & Detection State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DetectionResponseData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (prof) setProfile(prof as Profile)
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
      loadHistory()
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
        setErrorMessage(json.error.message || 'Gagal menganalisis foto tanaman.')
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
      if (!json.error) {
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
      <div className="min-h-screen flex items-center justify-center bg-[#FBF4EE]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A]" />
          <p className="text-sm font-medium text-[#4A3A32]">Memuat modul deteksi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto text-[#0E080A]">
      {/* TOP BANNER / INTRO */}
      <div className="card-standard p-4 sm:p-6 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase text-[#C4487A] tracking-wider">
                Computer Vision
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C4487A]/10 text-[#C4487A] font-semibold">
                YOLOv8 Multi-Objek
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E080A]">
              Deteksi Penyakit Tanaman Bawang Merah
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3A32] max-w-2xl leading-relaxed">
              Ambil foto daun atau umbi yang bergejala (Antraknosa, Moler, Trotol). Sistem YOLOv8 akan mendeteksi multi-objek dan menampilkan skor keyakinan serta arahan tindak lanjut.
            </p>
          </div>

          <Link
            href="/dashboard/chat"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4A3A32] bg-[#FBF4EE] hover:bg-[#E5DFD6] rounded-xl border border-[#E5DFD6] transition-colors self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C4487A]" />
            <span>Konsultasi SIMA &rarr;</span>
          </Link>
        </div>
      </div>

        {/* UPLOAD & ANALYSIS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: UPLOAD ZONE (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card-standard p-6 border-2 border-dashed border-[#E5DFD6] hover:border-[#C4487A] transition-colors bg-white text-center flex flex-col items-center justify-center min-h-[340px] relative">
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
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#E5DFD6] bg-[#0E080A]/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview tanaman"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setAnalysisResult(null)
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow"
                      title="Ganti Foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8A8580] px-1">
                    <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                    <span>{((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer py-10 px-4 w-full flex flex-col items-center justify-center space-y-3 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#C4487A]/10 group-hover:bg-[#C4487A]/20 text-[#C4487A] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0E080A]">
                      Tarik & Letakkan Foto di Sini
                    </p>
                    <p className="text-xs text-[#8A8580] mt-1">
                      atau klik untuk memilih file foto dari galeri/kamera
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[#8A8580] bg-[#FBF4EE] border border-[#E5DFD6]">
                    Format: JPG, PNG &bull; Maks 10MB
                  </div>
                </div>
              )}
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/25 text-[#8C3A3A] text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || analyzing}
              className="w-full py-3.5 px-6 rounded-xl bg-[#C4487A] hover:bg-[#A83A68] active:scale-[0.99] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>SIMA sedang menganalisis foto...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6A15C]" />
                  <span>Analisis Foto Tanaman &rarr;</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: RESULTS DISPLAY (7 cols) */}
          <div className="lg:col-span-7">
            {analyzing ? (
              /* LOADING STATE */
              <div className="card-standard p-8 min-h-[340px] flex flex-col items-center justify-center text-center space-y-4 border border-[#E5DFD6] bg-white">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#C4487A]/20 border-t-[#C4487A] animate-spin" />
                  <Camera className="w-6 h-6 text-[#C4487A] absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-[#0E080A]">
                    Mendeteksi Pola Patogen & Kondisi Daun...
                  </h3>
                  <p className="text-xs text-[#8A8580] max-w-sm">
                    Model YOLOv8 sedang mengekstraksi bounding box dan menghitung tingkat kepercayaan diagnosis.
                  </p>
                </div>
              </div>
            ) : analysisResult ? (
              /* RESULTS PRESENTATION */
              <div className="space-y-6">
                {/* 1. MANDATORY DISCLAIMER BOX */}
                <div className="p-4 rounded-xl bg-[#FBF4EE] border-l-4 border-l-[#E6A15C] border border-[#E5DFD6] text-xs text-[#4A3A32] space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-[#0E080A]">
                    <ShieldAlert className="w-4 h-4 text-[#E6A15C]" />
                    <span>Disclaimer Wajib Sistem AI</span>
                  </div>
                  <p className="leading-relaxed">
                    {analysisResult.disclaimer}
                  </p>
                </div>

                {/* 2. SUMMARY STATUS CARD */}
                <div
                  className={`p-5 rounded-2xl border ${
                    analysisResult.has_disease
                      ? 'bg-[#C4487A]/5 border-[#C4487A]/30'
                      : analysisResult.all_healthy
                      ? 'bg-[#3A5A40]/5 border-[#3A5A40]/30'
                      : 'bg-white border-[#E5DFD6]'
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
                      <h3 className="text-base font-serif font-bold text-[#0E080A]">
                        {analysisResult.has_disease
                          ? 'Terdeteksi Gejala Penyakit'
                          : analysisResult.all_healthy
                          ? 'Tanaman Terindikasi Sehat'
                          : 'Bagian Tanaman Terdeteksi'}
                      </h3>
                      <p className="text-xs text-[#4A3A32]">
                        {analysisResult.has_disease
                          ? 'Ditemukan indikasi serangan patogen pada foto yang Anda unggah.'
                          : analysisResult.all_healthy
                          ? 'Tidak ditemukan tanda infeksi jamur atau bakteri yang nyata.'
                          : 'Foto berisi anatomi daun bawang merah, namun belum menunjukkan indikasi patogen spesifik.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. DETECTION ITEMS LIST (DISEASE & HEALTHY ONLY) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8A8580]">
                      Hasil Diagnosis Objek ({analysisResult.results_for_display.length}):
                    </h4>
                    <span className="text-[11px] text-[#8A8580]">
                      Total objek terdeteksi model: {analysisResult.total_detected_objects}
                    </span>
                  </div>

                  {analysisResult.results_for_display.length === 0 ? (
                    <div className="p-6 rounded-xl border border-[#E5DFD6] bg-white text-center space-y-2">
                      <p className="text-xs text-[#4A3A32] font-medium">
                        Foto terdeteksi berisi tanaman bawang merah, namun sistem belum bisa menyimpulkan kondisi kesehatannya secara tegas.
                      </p>
                      <p className="text-[11px] text-[#8A8580]">
                        Saran: Ambil foto yang lebih terang dan fokus pada bercak daun yang dicurigai sakit.
                      </p>
                    </div>
                  ) : (
                    analysisResult.results_for_display.map((item, idx) => {
                      const conf = Math.round(item.confidence)
                      // Dynamic color thresholds
                      const progressColor =
                        conf >= 70 ? 'bg-[#3A5A40]' : conf >= 40 ? 'bg-[#E6A15C]' : 'bg-[#8A8580]'
                      const textColor =
                        conf >= 70 ? 'text-[#3A5A40]' : conf >= 40 ? 'text-[#C97A2E]' : 'text-[#8A8580]'

                      return (
                        <div
                          key={item.result_id || idx}
                          className="card-standard p-4 sm:p-5 border border-[#E5DFD6] bg-white space-y-3"
                        >
                          {/* Item Header & Score */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.category === 'disease' ? 'bg-[#C4487A]' : 'bg-[#3A5A40]'
                                }`}
                              />
                              <span className="font-serif font-bold text-sm text-[#0E080A]">
                                {item.display_name || item.predicted_class}
                              </span>
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FBF4EE] border border-[#E5DFD6] text-[#8A8580]">
                                {item.category}
                              </span>
                            </div>
                            <span className={`text-xs font-mono font-bold ${textColor}`}>
                              {conf}% Confidence
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 rounded-full bg-[#FBF4EE] overflow-hidden">
                            <div
                              className={`h-full ${progressColor} transition-all duration-700`}
                              style={{ width: `${Math.min(100, Math.max(5, conf))}%` }}
                            />
                          </div>

                          {/* Feedback Section */}
                          <div className="pt-2 border-t border-[#E5DFD6]/60 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-[#8A8580]">
                              Apakah hasil diagnosis ini sesuai dengan kondisi riil?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSendFeedback(item.result_id, 'sesuai')}
                                disabled={feedbackSending === item.result_id}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all inline-flex items-center gap-1 ${
                                  item.farmer_feedback === 'sesuai'
                                    ? 'bg-[#3A5A40] text-white border-[#3A5A40]'
                                    : 'border-[#3A5A40] text-[#3A5A40] hover:bg-[#3A5A40]/10'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                Sesuai
                              </button>

                              <button
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
                                    ? 'bg-[#8C3A3A] text-white border-[#8C3A3A]'
                                    : 'border-[#8C3A3A] text-[#8C3A3A] hover:bg-[#8C3A3A]/10'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                                Tidak Sesuai
                              </button>
                            </div>
                          </div>

                          {/* Correction Note Form (If "Tidak Sesuai" clicked) */}
                          {activeCorrectionId === item.result_id && (
                            <div className="p-3 rounded-xl bg-[#FBF4EE] border border-[#E5DFD6] space-y-2 mt-2">
                              <label className="text-[11px] font-medium text-[#4A3A32] block">
                                Catatan Koreksi Anda (Opsional):
                              </label>
                              <textarea
                                rows={2}
                                value={correctionNote}
                                onChange={(e) => setCorrectionNote(e.target.value)}
                                placeholder="Menurut pengalaman saya di sawah, gejala ini sebenarnya adalah..."
                                className="w-full p-2 text-xs rounded-lg border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A]"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setActiveCorrectionId(null)}
                                  className="px-2.5 py-1 rounded text-xs text-[#8A8580] hover:bg-[#E5DFD6]"
                                >
                                  Batal
                                </button>
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
                                  Kirim Feedback
                                </button>
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
              <div className="card-standard p-8 border border-[#E5DFD6] bg-white space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0E080A]">
                    Panduan Cepat Deteksi Penyakit
                  </h3>
                  <p className="text-xs text-[#8A8580] mt-1">
                    Ikuti 3 langkah mudah berikut untuk mendapatkan dugaan awal penyakit tanaman Anda:
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#FBF4EE] border border-[#E5DFD6] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#C4487A] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h4 className="text-xs font-bold text-[#0E080A]">Foto dari Jarak Dekat</h4>
                    <p className="text-[11px] text-[#4A3A32] leading-relaxed">
                      Ambil foto bagian daun atau batang yang terlihat bercak, meliuk, atau layu dengan pencahayaan cukup.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBF4EE] border border-[#E5DFD6] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E6A15C] text-[#0E080A] flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h4 className="text-xs font-bold text-[#0E080A]">Upload ke SIMANTRI</h4>
                    <p className="text-[11px] text-[#4A3A32] leading-relaxed">
                      Unggah foto ke sistem. Model YOLOv8 akan menganalisis infeksi jamur atau bakteri dalam hitungan detik.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBF4EE] border border-[#E5DFD6] space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3A5A40] text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h4 className="text-xs font-bold text-[#0E080A]">Konfirmasi & Tindakan</h4>
                    <p className="text-[11px] text-[#4A3A32] leading-relaxed">
                      Gunakan hasil deteksi sebagai bahan diskusi dengan penyuluh terdekat sebelum memilih pestisida atau fungisida.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5DFD6] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#C4487A]" />
                    <span className="text-xs text-[#4A3A32]">
                      Ingin tahu ciri khas penyakit Trotol vs Moler secara tertulis?
                    </span>
                  </div>
                  <Link
                    href="/dashboard/chat"
                    className="text-xs font-semibold text-[#C4487A] hover:underline inline-flex items-center gap-1"
                  >
                    Tanya SIMA <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT DETECTIONS HISTORY */}
        <div className="space-y-4 pt-4 border-t border-[#E5DFD6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C4487A]" />
              <h3 className="font-serif font-bold text-base text-[#0E080A]">
                Riwayat 5 Deteksi Terakhir Anda
              </h3>
            </div>
            <button
              onClick={loadHistory}
              disabled={historyLoading}
              className="p-1.5 text-xs text-[#8A8580] hover:text-[#0E080A] rounded-lg hover:bg-white transition-colors"
              title="Segarkan Riwayat"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {historyLoading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5DFD6]">
              <Loader2 className="w-6 h-6 animate-spin text-[#C4487A] mx-auto mb-2" />
              <p className="text-xs text-[#8A8580]">Memuat riwayat deteksi...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-[#E5DFD6]">
              <p className="text-xs text-[#8A8580]">
                Belum ada riwayat deteksi foto tanaman. Mulai upload foto pertama Anda di atas!
              </p>
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
                    className="card-standard p-3 bg-white border border-[#E5DFD6] space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#FBF4EE] border border-[#E5DFD6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hist.image_url}
                        alt="Foto Riwayat"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#8A8580] font-mono">
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
                                <span className="font-semibold text-[#0E080A] truncate max-w-[90px]">
                                  {ref?.displayName || r.predicted_class}
                                </span>
                                <span className="font-mono text-[10px] text-[#C4487A]">
                                  {Math.round(r.confidence)}%
                                </span>
                              </div>
                            )
                          })
                        ) : (
                          <span className="text-[10px] text-[#8A8580] italic block">
                            Anatomi Tanaman
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
    </div>
  )
}
