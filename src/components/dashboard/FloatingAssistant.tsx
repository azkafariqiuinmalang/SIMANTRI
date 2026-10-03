'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  X,
  Send,
  Sparkles,
  Maximize2,
  RefreshCw,
  HelpCircle,
  Minimize2,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

interface Message {
  id?: string | null
  sender: 'user' | 'sima'
  text: string
  timestamp: string
  feedback?: 'helpful' | 'not_helpful' | null
}

const QUICK_QUESTIONS = [
  'Solusi mengatasi penyakit Moler?',
  'Dosis pemupukan bawang merah fase vegetatif?',
  'Tips cegah busuk umbi saat musim hujan?',
  'Ciri-ciri serangan ulat grayak?',
]

// Global helper function so any component can invoke the assistant drawer
export function openSimaAssistant(options?: { prompt?: string; autoSend?: boolean }) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('open-sima-assistant', { detail: options })
    window.dispatchEvent(event)
  }
}

export default function FloatingAssistant() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Hide floating launcher on the full dedicated chat page to avoid redundancy
  const isDedicatedChatPage = pathname === '/dashboard/chat'

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, isOpen, isMinimized])

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
    }
  }, [isOpen, isMinimized])

  // Handle global event listener for cross-page trigger
  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string; autoSend?: boolean }>
      setIsOpen(true)
      setIsMinimized(false)

      if (customEvent.detail?.prompt) {
        const text = customEvent.detail.prompt
        if (customEvent.detail.autoSend) {
          handleSendMessage(text)
        } else {
          setInputMessage(text)
          setTimeout(() => {
            textareaRef.current?.focus()
          }, 250)
        }
      }
    }

    window.addEventListener('open-sima-assistant', handleOpenEvent)
    return () => {
      window.removeEventListener('open-sima-assistant', handleOpenEvent)
    }
  }, [messages])

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

      if (!response.ok) throw new Error(`HTTP error ${response.status}`)

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
        id: result.chat_id || result.data?.id || `msg-${Date.now()}`,
        sender: 'sima',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, simaMsg])
    } catch (err) {
      console.error('Floating Chat error:', err)
      const errorMsg: Message = {
        sender: 'sima',
        text: 'Mohon maaf, terjadi gangguan saat menghubungi asisten SIMA. Silakan coba sesaat lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  // Handle feedback
  const handleFeedback = async (chatId: string, feedbackType: 'helpful' | 'not_helpful') => {
    if (!chatId || feedbackSending) return
    setFeedbackSending(chatId)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isDedicatedChatPage) {
    return null
  }

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON WITH SIMA MASCOT */}
      {!isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
          <button
            onClick={() => {
              setIsOpen(true)
              setIsMinimized(false)
            }}
            className="group relative flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-tr from-simantri-900 via-simantri-800 to-simantri-700 text-white shadow-xl shadow-simantri-900/30 border border-white/25 hover:scale-105 active:scale-95 transition-all duration-300 font-jakarta"
            aria-label="Buka Asisten SIMA"
          >
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <Image
                src="/sima.jpg"
                alt="Logo SIMA Mascot"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="text-left pr-1">
              <span className="block text-xs sm:text-sm font-extrabold tracking-tight text-white leading-none">
                Tanya SIMA
              </span>
              <span className="block text-[9px] text-emerald-200 font-medium mt-1 leading-none">
                AI Asisten Bawang
              </span>
            </div>
          </button>
        </div>
      )}

      {/* FLOATING CHAT PANEL */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out font-jakarta ${
            isMinimized
              ? 'bottom-20 lg:bottom-6 right-4 sm:right-6 w-[280px] sm:w-[320px] h-auto rounded-3xl shadow-xl border border-slate-200'
              : 'bottom-20 lg:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[440px] h-[580px] max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200'
          } bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5`}
        >
          {/* HEADER WITH MASCOT */}
          <div
            className={`bg-gradient-to-r from-simantri-900 via-simantri-800 to-simantri-700 text-white flex items-center justify-between shrink-0 select-none shadow-sm ${
              isMinimized ? 'px-4 py-3 cursor-pointer' : 'px-4 py-3'
            }`}
            onClick={isMinimized ? () => setIsMinimized(false) : undefined}
          >
            <div
              className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0 pr-1"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                <Image
                  src="/sima.jpg"
                  alt="SIMA Mascot"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                    SIMA AI Assistant
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                </div>
                <p className="text-[10px] text-emerald-200 leading-none mt-0.5 truncate">
                  {isMinimized ? 'Klik untuk membuka' : 'Online • Knowledge Base Nganjuk'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {!isMinimized && (
                <>
                  <button
                    onClick={() => setMessages([])}
                    className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                    title="Reset Obrolan"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/dashboard/chat"
                    className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                    title="Buka di Halaman Penuh"
                    onClick={() => setIsOpen(false)}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                title={isMinimized ? 'Buka Panel' : 'Minimalkan'}
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-rose-500/30 transition-colors"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT BODY (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* MESSAGES SCROLL */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="py-6 px-3 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-emerald-200 flex items-center justify-center mb-2.5 overflow-hidden">
                      <Image
                        src="/sima.jpg"
                        alt="SIMA Mascot"
                        width={60}
                        height={60}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      Halo! Saya SIMA, Asisten Tani Anda
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[270px] leading-relaxed">
                      Siap membantu tanya jawab seputar budidaya bawang merah, diagnosis penyakit, dan tren harga di Nganjuk.
                    </p>

                    {/* Quick suggestion chips */}
                    <div className="mt-4 w-full space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">
                        Pertanyaan Populer:
                      </p>
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="w-full text-left p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-simantri-500 hover:bg-emerald-50/50 text-[11px] font-medium text-slate-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-simantri-600 shrink-0" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'sima' && (
                        <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-emerald-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <Image
                            src="/sima.jpg"
                            alt="SIMA"
                            width={28}
                            height={28}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="max-w-[85%] space-y-1">
                        <div
                          className={`p-3.5 text-xs leading-relaxed shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-simantri-700 text-white rounded-3xl rounded-tr-md'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-3xl rounded-tl-md'
                          }`}
                        >
                          {msg.sender === 'sima' && (
                            <div className="flex items-center justify-between gap-1 pb-1 mb-1.5 border-b border-slate-100">
                              <span className="font-bold text-[10px] text-simantri-700">
                                SIMA AI
                              </span>
                              <span className="text-[8px] font-mono text-slate-400">
                                {msg.timestamp}
                              </span>
                            </div>
                          )}

                          {msg.sender === 'sima' ? (
                            <MarkdownRenderer content={msg.text} />
                          ) : (
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                          )}
                        </div>

                        {/* Feedback buttons */}
                        {msg.sender === 'sima' && msg.id && (
                          <div className="flex items-center justify-end gap-1 px-1 text-slate-400">
                            <button
                              onClick={() => handleFeedback(msg.id!, 'helpful')}
                              disabled={feedbackSending === msg.id}
                              className={`p-1 rounded-lg transition-all ${
                                msg.feedback === 'helpful'
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'hover:text-slate-700'
                              }`}
                              title="Membantu"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id!, 'not_helpful')}
                              disabled={feedbackSending === msg.id}
                              className={`p-1 rounded-lg transition-all ${
                                msg.feedback === 'not_helpful'
                                  ? 'text-rose-700 bg-rose-50'
                                  : 'hover:text-slate-700'
                              }`}
                              title="Kurang Membantu"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Loading state */}
                {loading && (
                  <div className="flex gap-2 justify-start items-center">
                    <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-emerald-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src="/sima.jpg"
                        alt="SIMA"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-simantri-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-simantri-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-simantri-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] text-slate-500 ml-1.5 font-medium">SIMA sedang merangkai jawaban...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5 flex items-end gap-1.5 focus-within:border-simantri-600 focus-within:ring-2 focus-within:ring-simantri-600/10 focus-within:bg-white transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya SIMA apa saja..."
                    disabled={loading}
                    className="flex-1 max-h-24 min-h-[36px] p-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-0 outline-none resize-none leading-relaxed"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || loading}
                    className="h-9 w-9 rounded-xl bg-simantri-700 text-white flex items-center justify-center transition-all hover:bg-simantri-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    title="Kirim Pesan"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
