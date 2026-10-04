'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  RefreshCw,
  Send,
  Sparkles,
  Sprout,
  ThumbsDown,
  ThumbsUp,
  Lightbulb,
  Copy,
  Check,
  Info,
  AlertTriangle,
  Flame,
  PhoneCall,
  X,
} from 'lucide-react'
import { Toast, useChatScroll, useOverlayFocus } from '@/components/ui/Experience'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface Message {
  id?: string | null
  sender: 'user' | 'sima'
  text: string
  requestText?: string
  sumber?: { doc_id: string; title: string }[]
  dari_kb?: boolean
  feedback?: 'helpful' | 'not_helpful' | null
  timestamp: string
}

interface TacticalPrompt {
  id: string
  icon: string
  text: string
  category: string
}

const TACTICAL_PROMPTS: TacticalPrompt[] = [
  {
    id: '1',
    icon: 'fungicide',
    text: 'Bagaimana takaran fungisida mankozeb untuk gejala bercak ungu saat musim hujan?',
    category: 'Penyakit & Hama',
  },
  {
    id: '2',
    icon: 'market',
    text: 'Kapan waktu paling optimal melepas stok bawang simpan berdasarkan prediksi harga H+3?',
    category: 'Strategi Pasar',
  },
  {
    id: '3',
    icon: 'fertilizer',
    text: 'Berapa takaran pupuk kalium cair (K2O) pada fase pembentukan umbi 42 HST?',
    category: 'Pemupukan',
  },
  {
    id: '4',
    icon: 'disease',
    text: 'Ciri-ciri perbedaan serangan embun bulu vs layu moler di bedengan sawah?',
    category: 'Diagnosis Cepat',
  },
]

const TRENDING_TOPICS = [
  {
    title: 'Strategi tunda jual vs jual basah di tebas',
    category: 'Analisis Pasar',
    count: '48 Petani',
    badgeColor: 'text-shallot-600 bg-shallot-50',
    prompt: 'Bagaimana analisis perbandingan keuntungan strategi tunda jual simpan gudang vs jual basah tebas di Pasar Sukomoro saat ini?',
  },
  {
    title: 'Penyemprotan nutrisi Kalium Silika fase umbi',
    category: 'Pemupukan',
    count: '39 Petani',
    badgeColor: 'text-simantri-700 bg-simantri-50',
    prompt: 'Bagaimana cara dan waktu aplikasi penyemprotan pupuk Kalium Silika pada fase pembesaran umbi bawang merah agar kulit merah mengkilap?',
  },
  {
    title: 'Rotasi fungisida Mankozeb + Azoksistrobin',
    category: 'Hama & Penyakit',
    count: '31 Petani',
    badgeColor: 'text-simantri-700 bg-simantri-50',
    prompt: 'Bagaimana jadwal rotasi bahan aktif fungisida kontak Mankozeb dan sistemik Azoksistrobin untuk mencegah resistensi jamur Alternaria porri?',
  },
  {
    title: 'Penyesuaian irigasi pompa sumur bor diesel',
    category: 'Pengairan',
    count: '19 Petani',
    badgeColor: 'text-amber-700 bg-amber-50',
    prompt: 'Berapa frekuensi ideal penggenangan parit bedengan menggunakan pompa sumur bor pada tanah lempung berpasir Nganjuk di usia 35-50 HST?',
  },
]

export default function ChatAssistantPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const { scrollRef, onScroll, scrollToLatest } = useChatScroll()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const closeGuide = useCallback(() => setIsGuideOpen(false), [])
  const guideRef = useOverlayFocus(isGuideOpen, closeGuide)
  useEffect(() => {
    if (!isGuideOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isGuideOpen])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (prof) setProfile(prof as Profile)
      setAuthChecking(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    scrollToLatest()
    // Follow only while the reader remains near the latest message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading])

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim()
    if (!textToSend || loading) return

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = { sender: 'user', text: customText ? t(textToSend) : textToSend, requestText: textToSend, timestamp: now }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setLoading(true)

    try {
      const historyPayload = messages.map((message) => ({
        role: message.sender === 'user' ? 'user' : 'model',
        text: message.requestText ?? message.text,
      }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, conversation_history: historyPayload, language }),
      })

      if (!response.ok) throw new Error(`HTTP error ${response.status}`)

      const result = await response.json()
      const replyText =
        result.reply || result.response || result.data?.response || result.data?.reply ||
        result.data?.message || result.message || 'Jawaban tidak dapat dimuat.'
      const simaMsg: Message = {
        // This fallback runs after an asynchronous user submission, never during render.
        // eslint-disable-next-line react-hooks/purity
        id: result.chat_id || result.data?.id || `msg-${Date.now()}`,
        sender: 'sima',
        text: replyText,
        sumber: result.sumber || result.data?.sumber || [],
        dari_kb: result.dari_kb ?? result.data?.dari_kb ?? false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, simaMsg])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'sima',
          text: t('Mohon maaf, terjadi gangguan saat menghubungi asisten cerdas SIMA. Silakan coba kembali sesaat lagi.'),
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = async (chatId: string, feedbackType: 'helpful' | 'not_helpful') => {
    if (!chatId || feedbackSending) return
    setFeedbackSending(chatId)
    setMessages((prev) =>
      prev.map((message) => (message.id === chatId ? { ...message, feedback: feedbackType } : message))
    )

    try {
      const response = await fetch(`/api/chat/${chatId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackType }),
      })
      if (response.ok) setFeedbackNotice('Terima kasih, masukan Anda sudah tercatat.')
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setFeedbackSending(null)
    }
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  if (authChecking) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center p-8 font-jakarta">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-white p-2 shadow-lg border border-emerald-100 flex items-center justify-center animate-pulse">
            <Image src="/sima.jpg" alt={t("Logo SIMA")} width={56} height={56} className="rounded-2xl object-cover" priority />
          </div>
          <p className="text-sm font-bold text-slate-700">{t("Menghubungkan ke SIMA AI Assistant...")}</p>
        </div>
      </div>
    )
  }

  const farmerName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Petani'
  const userVillage = profile?.village || 'Sukomoro'

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-jakarta">
      {feedbackNotice && <Toast message={feedbackNotice} onDismiss={() => setFeedbackNotice('')} />}
      {/* TOP PAGE HEADER BAR */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-simantri-900 via-simantri-800 to-slate-900 p-6 sm:p-7 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-simantri-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 h-48 w-48 rounded-full bg-shallot-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 shadow-lg shadow-black/20 shrink-0 border border-white/20">
              <Image
                src="/sima.jpg"
                alt={t("Logo SIMA")}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-xl"
                priority
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {t("SIMA AI Assistant")}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-extrabold">
                  {t("v2.4 Gemini + RAG Pertanian")}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {t("Asisten cerdas agronomi budidaya, pengendalian OPT, dan analisis pasar bawang merah Kabupaten Nganjuk.")}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition backdrop-blur-md active:translate-y-0"
              title={t("Reset sesi percakapan")}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t("Percakapan Baru")}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-simantri-500 hover:bg-simantri-600 border border-emerald-400/30 text-xs font-bold text-white transition shadow-sm active:translate-y-0"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{t("Panduan Tanya")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN WORKSTATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
        {/* LEFT CONVERSATION WORKSPACE (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-210px)] min-h-[640px] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Scrollable Message Stream */}
          <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/40">
            {/* Assistant Greeting Banner Card */}
            {messages.length === 0 ? (
              <div className="space-y-6 py-2">
                <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 p-6 sm:p-7 border border-emerald-100 shadow-xs overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-emerald-200/60 shrink-0 overflow-hidden">
                      <Image
                        src="/sima.jpg"
                        alt={t("SIMA Mascot")}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-bold text-simantri-700 uppercase tracking-wider">
                        {t("Agronomi Telemetri Nganjuk")}</span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        {t("Sugeng Rawuh, Pak")} {farmerName}!
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                        {t("Saya")} <strong>SIMA</strong>{t(", asisten agronomi Anda. Ada yang ingin ditanyakan seputar penanganan penyakit bercak ungu, takaran pupuk fase pembesaran umbi, atau strategi waktu jual di Pasar Sukomoro?")}</p>
                    </div>
                  </div>

                  {/* Tactical Quick Prompt Chips */}
                  <div className="mt-6 pt-5 border-t border-emerald-100/80">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                      {t("Rekomendasi Pertanyaan Cepat (Klik untuk Bertanya):")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TACTICAL_PROMPTS.map((prompt) => (
                        <button
                          key={prompt.id}
                          type="button"
                          onClick={() => handleSendMessage(prompt.text)}
                          className="group text-left p-3.5 rounded-2xl bg-white hover:bg-simantri-700 hover:text-white border border-slate-200/80 hover:border-simantri-700 transition-all duration-200 shadow-xs flex items-start gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 group-hover:bg-white/20 text-simantri-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-200 uppercase tracking-wider block">
                              {t(prompt.category)}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-white leading-snug line-clamp-2 mt-0.5">
                              {t(prompt.text)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.timestamp}-${index}`}
                  className={`sim-message flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'sima' && (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white p-0.5 border border-emerald-200 shadow-xs flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                      <Image
                        src="/sima.jpg"
                        alt="SIMA"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}

                  <div className={`max-w-[88%] sm:max-w-[80%] space-y-2`}>
                    {message.sender === 'sima' && (
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-xs font-extrabold text-simantri-800">{t("SIMA Agronomi Nganjuk")}</span>
                        <span className="text-[10px] text-slate-400 font-medium">• {message.timestamp}</span>
                        {message.dari_kb && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {t("Tervalidasi RAG BPTP")}</span>
                        )}
                      </div>
                    )}

                    <div
                      className={`p-4 sm:p-5 text-sm leading-relaxed shadow-xs ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-simantri-700 to-simantri-800 text-white rounded-3xl rounded-tr-md'
                          : 'bg-white border border-slate-200/90 text-slate-900 rounded-3xl rounded-tl-md'
                      }`}
                    >
                      {message.sender === 'sima' ? (
                        <MarkdownRenderer content={message.text} />
                      ) : (
                        <div className="whitespace-pre-wrap [overflow-wrap:anywhere]">{message.text}</div>
                      )}

                      {message.sender === 'user' && (
                        <p className="mt-1 text-right text-[10px] text-emerald-200 font-medium">
                          {message.timestamp}
                        </p>
                      )}
                    </div>

                    {/* SIMA Action Bar & Feedback */}
                    {message.sender === 'sima' && message.id && (
                      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px]">{t("Bermanfaat?")}</span>
                          <button
                            type="button"
                            onClick={() => handleFeedback(message.id!, 'helpful')}
                            aria-pressed={message.feedback === 'helpful'}
                            aria-busy={feedbackSending === message.id}
                            disabled={feedbackSending === message.id}
                            className={`p-1.5 rounded-xl border transition ${
                              message.feedback === 'helpful'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 font-bold'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                            title={t("Jawaban membantu")}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(message.id!, 'not_helpful')}
                            aria-pressed={message.feedback === 'not_helpful'}
                            aria-busy={feedbackSending === message.id}
                            disabled={feedbackSending === message.id}
                            className={`p-1.5 rounded-xl border transition ${
                              message.feedback === 'not_helpful'
                                ? 'border-rose-300 bg-rose-50 text-rose-700 font-bold'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                            title={t("Kurang tepat")}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyText(message.text, message.id!)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[11px] text-emerald-600 font-bold">{t("Tersalin")}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">{t("Salin")}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs shadow-xs">
                      {profile?.full_name?.charAt(0).toUpperCase() || t("P")}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading Typing Indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white p-0.5 border border-emerald-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                  <Image src="/sima.jpg" alt="SIMA" width={36} height={36} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="p-4 rounded-3xl rounded-tl-md bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-simantri-600 sim-typing-dot" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-simantri-600 sim-typing-dot" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-simantri-600 sim-typing-dot" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 ml-2">
                    {t("SIMA sedang merangkai rekomendasi agronomi...")}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* STICKY CHAT COMPOSER */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="relative flex items-center gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200/80 focus-within:border-simantri-600 focus-within:ring-2 focus-within:ring-simantri-600/15 focus-within:bg-white transition-all"
            >
              <textarea
                aria-label={t("Pertanyaan untuk SIMA")}
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("Tanyakan penanganan hama, pemupukan, atau taksiran harga... (contoh: takaran pupuk 42 HST)")}
                disabled={loading}
                className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 px-2 py-1.5 resize-none max-h-24 leading-relaxed"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="h-10 px-4 rounded-xl bg-simantri-700 hover:bg-simantri-800 active:bg-simantri-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>{t("Kirim")}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 truncate">
                <Info className="w-3.5 h-3.5 text-simantri-600 shrink-0" />
                <span className="truncate">
                  {t("Rekomendasi diselaraskan dengan SOP BPTP Jatim & Pasar Sukomoro Nganjuk.")}</span>
              </div>
              <span className="hidden sm:inline font-mono text-[10px] text-slate-400 shrink-0">
                {t("Shift + Enter untuk baris baru")}</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTEXT & FIELD ASSISTANCE PANEL (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Farmer Field Context Profile */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-simantri-700 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{t("Konteks Lahan Anda")}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{t("Telemetri Lapangan")}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold text-emerald-800">
                {t("TERDETEKSI")}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
                <span className="text-slate-500">{t("Varietas Utama:")}</span>
                <span className="font-bold text-shallot-700">{t("Tajuk / Bauji Nganjuk")}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
                <span className="text-slate-500">{t("Fase & Usia:")}</span>
                <span className="font-bold text-slate-800">{t("42 HST (Pembentukan Umbi)")}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
                <span className="text-slate-500">{t("Lokasi Hamparan:")}</span>
                <span className="font-bold text-slate-800">{t("Kecamatan")} {userVillage}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
                <span className="text-slate-500">{t("Kondisi Cuaca:")}</span>
                <span className="font-bold text-amber-700">{t("31°C • RH 78% (Lembap)")}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 flex items-start gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>{t("Waspada Kelembapan:")}</strong>  {t("Kelembapan malam")} {userVillage}  {t("cukup tinggi, perhatikan sanitasi daun dari bercak ungu.")}</p>
            </div>
          </div>

          {/* Card 2: Trending Community Questions */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-shallot-50 text-shallot-700 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{t("Tren Tanya Sukomoro")}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{t("7 Hari Terakhir")}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{t("Komunitas")}</span>
            </div>

            <div className="space-y-2 pt-1">
              {TRENDING_TOPICS.map((topic, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(topic.prompt)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-simantri-800 line-clamp-1 block">
                      {t(topic.title)}
                    </span>
                    <span className="text-[10px] text-slate-500">{t(topic.category)}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${topic.badgeColor}`}>
                    {t(topic.count)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: PPL Field Officer Assistance */}
          <div className="bg-gradient-to-br from-simantri-800 to-simantri-900 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">{t("Butuh Kunjungan Lapangan?")}</h4>
                <p className="text-[11px] text-emerald-200">{t("BPP & Mantri Tani Kab. Nganjuk")}</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {t("Jika tanaman mengalami gejala penyakit menular atau butuh verifikasi fisik langsung di bedengan sawah Anda.")}</p>
            <button
              type="button"
              onClick={() => handleSendMessage(`Saya membutuhkan rekomendasi langkah untuk mengundang PPL atau Mantri Pertanian ke lahan saya di ${userVillage}.`)}
              className="w-full py-2.5 px-4 rounded-2xl bg-white text-simantri-900 hover:bg-emerald-50 text-xs font-extrabold transition shadow-sm active:translate-y-0 text-center"
            >
              {t("Hubungi Penyuluh Lapangan")}</button>
          </div>
        </div>
      </div>

      {/* MODAL PANDUAN BERTANYA */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsGuideOpen(false)}
        >
          <div
            ref={guideRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("Panduan bertanya pada SIMA")}
            className="sim-result bg-white rounded-3xl max-w-lg w-full max-h-[85dvh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-simantri-700 flex items-center justify-center font-bold">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {t("Panduan Bertanya Efektif ke SIMA")}</h3>
                  <p className="text-xs text-slate-500">{t("Dapatkan rekomendasi agronomi paling presisi")}</p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-simantri-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-slate-900">{t("Sebutkan Usia Tanaman (HST):")}</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t("Contoh:")} <em>{t("\"Bawang saya usia 42 HST...\"")}</em>  {t("— Resep nutrisi fase vegetatif dan pembesaran umbi sangat berbeda.")}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-simantri-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-slate-900">{t("Deskripsikan Gejala Fisik:")}</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t("Sebutkan warna daun (kuning ujung, bercak ungu, bintik putih) dan cuaca di sawah dalam 2 hari terakhir.")}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-simantri-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-slate-900">{t("Tanyakan Prediksi Harga Pasar:")}</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t("Gunakan kata kunci seperti")} <em>{t("\"Prediksi harga tebas Sukomoro minggu depan\"")}</em>  {t("untuk simulasi jual panen.")}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="py-2.5 px-5 rounded-2xl bg-simantri-700 hover:bg-simantri-800 text-white font-bold text-xs transition"
              >
                {t("Saya Mengerti, Mulai Bertanya")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
