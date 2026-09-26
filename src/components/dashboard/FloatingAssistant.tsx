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
        id: result.chat_id || result.data?.id || null,
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
            className="group relative flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-tr from-[#4A1F2B] via-[#8A2D50] to-[#C4487A] text-white shadow-xl shadow-[#C4487A]/30 border border-white/25 hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Buka Asisten SIMA"
          >
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6A15C] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#E6A15C] border-2 border-white" />
            </span>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white p-0.5 overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <Image
                src="/logo_sima.png"
                alt="Logo SIMA Mascot"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-left pr-1">
              <span className="block text-xs sm:text-sm font-serif font-bold tracking-tight text-white leading-none">
                Tanya SIMA
              </span>
              <span className="block text-[9px] text-[#F5F0EB]/85 font-sans font-medium mt-0.5 leading-none">
                Asisten Tani Nganjuk
              </span>
            </div>
          </button>
        </div>
      )}

      {/* FLOATING CHAT PANEL */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out ${
            isMinimized
              ? 'bottom-20 lg:bottom-6 right-4 sm:right-6 w-[270px] sm:w-[300px] h-auto rounded-2xl shadow-xl border border-white/25'
              : 'bottom-20 lg:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[430px] h-[550px] max-h-[82vh] rounded-2xl shadow-2xl border border-[#E5DFD6]'
          } bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5`}
        >
          {/* HEADER WITH MASCOT */}
          <div
            className={`bg-gradient-to-r from-[#4A1F2B] via-[#732742] to-[#8A2D50] text-white flex items-center justify-between shrink-0 select-none shadow-sm ${
              isMinimized ? 'px-3 py-2.5 cursor-pointer' : 'px-3.5 py-2.5'
            }`}
            onClick={isMinimized ? () => setIsMinimized(false) : undefined}
          >
            <div
              className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0 pr-1"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                <Image
                  src="/logo_sima.png"
                  alt="SIMA Mascot"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-serif font-bold text-white leading-tight truncate">
                    SIMA (Asisten Tani)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                </div>
                <p className="text-[10px] text-[#F5F0EB]/85 leading-none mt-0.5 truncate">
                  {isMinimized ? 'Klik untuk buka' : 'Tanya budidaya & hama'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="flex items-center gap-0.5 sm:gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {!isMinimized && (
                <>
                  <button
                    onClick={() => setMessages([])}
                    className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors"
                    title="Reset Obrolan"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/dashboard/chat"
                    className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors"
                    title="Buka di Halaman Penuh"
                    onClick={() => setIsOpen(false)}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors"
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
                className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-red-500/30 transition-colors"
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
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FDFBF7] custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="py-6 px-3 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border border-[#C4487A]/25 flex items-center justify-center mb-2.5 overflow-hidden">
                      <Image
                        src="/logo_sima.png"
                        alt="SIMA Mascot"
                        width={60}
                        height={60}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm font-serif font-bold text-[#0E080A]">
                      Halo! Saya SIMA, Asisten Tani Anda
                    </p>
                    <p className="text-[11px] text-[#8A8580] mt-1 max-w-[270px] leading-relaxed">
                      Siap membantu tanya jawab seputar budidaya bawang merah, diagnosis penyakit, dan penanganannya di Nganjuk.
                    </p>

                    {/* Quick suggestion chips */}
                    <div className="mt-4 w-full space-y-1.5">
                      <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8A8580] text-left">
                        Pertanyaan Populer:
                      </p>
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="w-full text-left p-2 rounded-xl border border-[#E5DFD6] bg-white hover:border-[#C4487A] hover:bg-[#FBF4EE] text-[11px] text-[#4A3A32] transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-[#C4487A] shrink-0" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'sima' && (
                        <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-[#C4487A]/30 shadow-xs flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <Image
                            src="/logo_sima.png"
                            alt="SIMA"
                            width={26}
                            height={26}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className="max-w-[85%] space-y-1">
                        <div
                          className={`p-3 text-xs leading-relaxed shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-[#C4487A] text-white rounded-2xl rounded-tr-none'
                              : 'bg-white border border-[#E5DFD6] text-[#0E080A] rounded-2xl rounded-tl-none'
                          }`}
                        >
                          {msg.sender === 'sima' && (
                            <div className="flex items-center justify-between gap-1 pb-1 mb-1.5 border-b border-[#E5DFD6]/60">
                              <span className="font-serif font-bold text-[10px] text-[#C4487A]">
                                SIMA (Asisten Tani)
                              </span>
                              <span className="text-[8px] font-mono text-[#8A8580]">
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
                          <div className="flex items-center justify-end gap-1 px-1 text-[#8A8580]">
                            <button
                              onClick={() => handleFeedback(msg.id!, 'helpful')}
                              disabled={feedbackSending === msg.id}
                              className={`p-0.5 rounded transition-all ${
                                msg.feedback === 'helpful'
                                  ? 'text-[#3A5A40]'
                                  : 'hover:text-[#4A3A32]'
                              }`}
                              title="Membantu"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id!, 'not_helpful')}
                              disabled={feedbackSending === msg.id}
                              className={`p-0.5 rounded transition-all ${
                                msg.feedback === 'not_helpful'
                                  ? 'text-[#8C3A3A]'
                                  : 'hover:text-[#4A3A32]'
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
                    <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-[#C4487A]/30 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src="/logo_sima.png"
                        alt="SIMA"
                        width={26}
                        height={26}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-2.5 rounded-2xl rounded-tl-none bg-white border border-[#E5DFD6] shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A] animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] text-[#8A8580] ml-1.5 font-medium">SIMA sedang merangkai jawaban...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <div className="p-2.5 bg-white border-t border-[#E5DFD6] shrink-0">
                <div className="rounded-xl border border-[#E5DFD6] bg-[#FDFBF7] p-1.5 flex items-end gap-1.5 focus-within:border-[#C4487A] focus-within:ring-2 focus-within:ring-[#C4487A]/10 transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya SIMA apa saja..."
                    disabled={loading}
                    className="flex-1 max-h-24 min-h-[34px] p-1.5 text-xs text-[#0E080A] placeholder-[#8A8580] bg-transparent border-0 outline-none resize-none leading-relaxed"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || loading}
                    className="h-8 w-8 rounded-lg bg-[#C4487A] text-white flex items-center justify-center transition-all hover:bg-[#A83A68] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
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
