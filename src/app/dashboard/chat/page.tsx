'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  Sprout,
  ArrowLeft,
  Send,
  BookOpen,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react'

interface Message {
  id?: string | null
  sender: 'user' | 'sima'
  text: string
  sumber?: { doc_id: string; title: string }[]
  dari_kb?: boolean
  feedback?: 'helpful' | 'not_helpful' | null
  timestamp: string
}

const SAMPLE_QUESTIONS = [
  'Kapan waktu tanam Bauji yang ideal?',
  'Bagaimana cara mengenali gejala Moler?',
  'Apa perbedaan varietas Bauji dan Tajuk?',
  'Berapa pH tanah ideal untuk bawang merah?',
]

export default function ChatAssistantPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

      if (prof) {
        setProfile(prof as Profile)
      }
      setAuthChecking(false)
    }

    checkAuth()
  }, [router])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim()
    if (!textToSend || loading) return

    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setLoading(true)

    try {
      // Build conversation history format
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversation_history: historyPayload,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const result = await response.json()
      const replyText =
        result.reply ||
        result.response ||
        result.data?.response ||
        result.data?.reply ||
        result.data?.message ||
        result.message ||
        'Jawaban tidak dapat dimuat.'

      const simaMsg: Message = {
        id: result.chat_id || result.data?.id || null,
        sender: 'sima',
        text: replyText,
        sumber: result.sumber || result.data?.sumber || [],
        dari_kb: result.dari_kb ?? result.data?.dari_kb ?? false,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, simaMsg])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMsg: Message = {
        sender: 'sima',
        text: 'Mohon maaf, terjadi gangguan saat menghubungi asisten cerdas SIMA. Silakan coba kembali sesaat lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  // Handle message feedback
  const handleFeedback = async (chatId: string, feedbackType: 'helpful' | 'not_helpful') => {
    if (!chatId || feedbackSending) return
    setFeedbackSending(chatId)

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((msg) => (msg.id === chatId ? { ...msg, feedback: feedbackType } : msg))
    )

    try {
      await fetch(`/api/chat/${chatId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackType }),
      })
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    } finally {
      setFeedbackSending(null)
    }
  }

  // Handle textarea enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (authChecking) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#C4487A] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#4A3A32]">Menghubungkan ke SIMA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-130px)] lg:h-[calc(100vh-60px)] max-w-5xl w-full mx-auto p-2 sm:p-4 md:p-6 text-[#0E080A]">
      {/* CHAT BANNER BAR */}
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-[#E5DFD6] rounded-2xl shadow-sm mb-2 sm:mb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4A1F2B] text-[#FFFDF8] flex items-center justify-center shadow-md shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6A15C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-serif font-bold text-[#0E080A]">
                SIMA AI Asisten Tani
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold bg-[#3A5A40]/10 text-[#3A5A40] border border-[#3A5A40]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3A5A40] animate-pulse" />
                39 Dokumen KB
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#8A8580]">
              Pengetahuan Terkurasi Bawang Merah Nganjuk
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="p-2 rounded-xl text-[#8A8580] hover:text-[#C4487A] hover:bg-[#FBF4EE] border border-[#E5DFD6] transition-colors text-xs inline-flex items-center gap-1"
          title="Percakapan Baru"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Reset</span>
        </button>
      </div>

      {/* MESSAGES SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-2 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          /* EMPTY STATE / WELCOME CARD */
          <div className="py-6 sm:py-10 px-3 sm:px-6 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#C4487A]/10 border border-[#C4487A]/20 flex items-center justify-center text-[#C4487A] shadow-inner mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#C4487A]" />
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#0E080A]">
              Halo! Ada yang bisa SIMA bantu?
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#4A3A32] leading-relaxed max-w-md">
              SIMA belajar dari 39 dokumen pengetahuan budidaya bawang merah Nganjuk, mencakup varietas, fase tanam, hama, penyakit, dan karakteristik tanah per kecamatan.
            </p>

            <div className="mt-6 w-full">
              <p className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-[#8A8580] mb-2.5">
                Pertanyaan Populer untuk Memulai:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    className="p-2.5 sm:p-3 rounded-xl border border-[#E5DFD6] bg-white hover:border-[#C4487A] hover:bg-[#FBF4EE] text-xs font-medium text-[#4A3A32] transition-all flex items-start gap-2 group shadow-sm active:scale-95"
                  >
                    <HelpCircle className="w-4 h-4 text-[#C4487A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="leading-tight">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MESSAGE THREAD */
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2 sm:gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'sima' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#4A1F2B] text-[#E6A15C] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}

              <div className="max-w-[90%] sm:max-w-[80%] space-y-1.5">
                {/* Bubble */}
                <div
                  className={`p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#C4487A] text-white rounded-2xl rounded-tr-none'
                      : 'bg-white border border-[#E5DFD6] text-[#0E080A] rounded-2xl rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.sender === 'sima' && (
                    <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#E5DFD6]/60">
                      <span className="font-serif font-bold text-[11px] sm:text-xs text-[#C4487A]">
                        SIMA (Asisten Tani)
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#8A8580]">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>

                {/* Footer Sources & Feedback */}
                {msg.sender === 'sima' && (
                  <div className="flex flex-wrap items-center justify-between gap-1.5 px-1 text-[11px]">
                    <div>
                      {msg.dari_kb && msg.sumber && msg.sumber.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#3A5A40]/10 text-[#3A5A40] border border-[#3A5A40]/20">
                            <BookOpen className="w-3 h-3" />
                            Sumber:
                          </span>
                          {msg.sumber.map((s) => (
                            <span
                              key={s.doc_id}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white border border-[#3A5A40]/20 text-[#3A5A40]"
                              title={s.title}
                            >
                              {s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#8A8580]/10 text-[#8A8580]">
                          <Info className="w-3 h-3" />
                          Jawaban Umum
                        </span>
                      )}
                    </div>

                    {msg.id && (
                      <div className="flex items-center gap-1 text-[#8A8580]">
                        <button
                          onClick={() => handleFeedback(msg.id!, 'helpful')}
                          disabled={feedbackSending === msg.id}
                          className={`p-1 rounded border transition-all ${
                            msg.feedback === 'helpful'
                              ? 'bg-[#3A5A40]/15 text-[#3A5A40] border-[#3A5A40]'
                              : 'hover:bg-white text-[#8A8580] border-transparent'
                          }`}
                          title="Jawaban Membantu"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id!, 'not_helpful')}
                          disabled={feedbackSending === msg.id}
                          className={`p-1 rounded border transition-all ${
                            msg.feedback === 'not_helpful'
                              ? 'bg-[#8C3A3A]/15 text-[#8C3A3A] border-[#8C3A3A]'
                              : 'hover:bg-white text-[#8A8580] border-transparent'
                          }`}
                          title="Jawaban Kurang Membantu"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C4487A] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex gap-2 sm:gap-3 justify-start items-start">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#4A1F2B] text-[#E6A15C] flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="p-3 sm:p-4 rounded-2xl rounded-tl-none bg-white border border-[#E5DFD6] shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] sm:text-xs text-[#8A8580] ml-2 font-medium">SIMA sedang merangkai jawaban...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR (ANCHORED DIRECTLY AT BOTTOM OF CONTAINER) */}
      <div className="pt-2 shrink-0">
        <div className="rounded-2xl border border-[#E5DFD6] bg-white p-1.5 sm:p-2 shadow-md flex items-end gap-1.5 sm:gap-2 focus-within:border-[#C4487A] focus-within:ring-2 focus-within:ring-[#C4487A]/10 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan jadwal tanam, penyakit, atau harga pasar..."
            disabled={loading}
            className="flex-1 max-h-28 min-h-[38px] sm:min-h-[44px] p-2 text-xs sm:text-sm text-[#0E080A] placeholder-[#8A8580] bg-transparent border-0 outline-none resize-none leading-relaxed"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-[#C4487A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all hover:bg-[#A83A68] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
          >
            <span className="hidden sm:inline">Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
