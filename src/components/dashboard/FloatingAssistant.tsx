'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  X,
  Send,
  Maximize2,
  RefreshCw,
  HelpCircle,
  Minimize2,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { Toast, useChatScroll } from '@/components/ui/Experience'
import { SimaMascot } from '@/components/dashboard/SimaMascot'

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
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedbackSending, setFeedbackSending] = useState<string | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState('')
  const { scrollRef, onScroll, scrollToLatest } = useChatScroll()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Hide floating launcher on the dedicated full chat page to avoid redundancy
  const isDedicatedChatPage = pathname === '/dashboard/chat'

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToLatest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading, isOpen, isMinimized])

  useEffect(() => {
    if (!isOpen) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); setIsOpen(false) } }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); trigger?.focus() }
  }, [isOpen])

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = window.setTimeout(() => textareaRef.current?.focus(), 200)
      return () => window.clearTimeout(timer)
    }
  }, [isOpen, isMinimized])

  // Send message
  const handleSendMessage = useCallback(async (customText?: string) => {
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
  }, [inputMessage, loading, messages])

  // Handle global event listener for cross-page trigger
  useEffect(() => {
    let focusTimer: ReturnType<typeof setTimeout> | undefined
    const handleOpenEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ prompt?: string; autoSend?: boolean }>).detail
      setIsOpen(true)
      setIsMinimized(false)
      if (detail?.prompt) {
        if (detail.autoSend) void handleSendMessage(detail.prompt)
        else {
          setInputMessage(detail.prompt)
          focusTimer = setTimeout(() => textareaRef.current?.focus(), 250)
        }
      }
    }
    window.addEventListener('open-sima-assistant', handleOpenEvent)
    return () => { window.removeEventListener('open-sima-assistant', handleOpenEvent); if (focusTimer) clearTimeout(focusTimer) }
  }, [handleSendMessage])

  // Handle feedback
  const handleFeedback = async (chatId: string, feedbackType: 'helpful' | 'not_helpful') => {
    if (!chatId || feedbackSending) return
    setFeedbackSending(chatId)
    setMessages((prev) =>
      prev.map((msg) => (msg.id === chatId ? { ...msg, feedback: feedbackType } : msg))
    )

    try {
      const response = await fetch(`/api/chat/${chatId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackType }),
      })
      if (response.ok) setFeedbackNotice('Terima kasih, masukan Anda sudah tercatat.')
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
      {feedbackNotice && <Toast message={feedbackNotice} onDismiss={() => setFeedbackNotice('')} />}
      {/* FLOATING SIMA MASCOT + SPEECH BUBBLE WIDGET */}
      {!isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end pointer-events-auto font-jakarta select-none">
          {/* SPEECH BUBBLE (Above Mascot) */}
          {(
            <div
              inert={isBubbleDismissed}
              aria-hidden={isBubbleDismissed}
              style={{ opacity: isBubbleDismissed ? 0 : 1, visibility: isBubbleDismissed ? 'hidden' : 'visible', transform: isBubbleDismissed ? 'translateY(4px)' : 'none', transition: `opacity 220ms ease-out, transform 220ms ease-out, visibility 0s ${isBubbleDismissed ? '220ms' : '0s'}` }}
              onClick={() => {
                setIsOpen(true)
                setIsMinimized(false)
              }}
              className="group relative cursor-pointer mb-2 mr-2 sm:mr-3 bg-white border border-[#DCE8E1] hover:border-[#167A4A]/40 rounded-[22px] sm:rounded-[26px] p-3.5 sm:p-4 shadow-lg shadow-emerald-950/8 hover:shadow-xl hover:shadow-emerald-950/12 transition-all duration-200 max-w-[260px] sm:max-w-[310px] text-left"
            >
              <button type="button" className="absolute inset-0 rounded-[22px] sm:rounded-[26px]" aria-label="Tanya SIMA: buka percakapan" />
              {/* Header row with Title and Close Button */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#167A4A] shrink-0" />
                  <p className="text-xs sm:text-[13px] font-bold text-[#1F2922] leading-tight">
                    <span className="hidden sm:inline">Ada yang bisa SIMA bantu?</span>
                    <span className="sm:hidden">Ada yang bisa dibantu?</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsBubbleDismissed(true)
                  }}
                  className="relative z-10 min-w-11 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
                  aria-label="Tutup percakapan sapaan"
                  title="Tutup gelembung"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Secondary description line (Desktop / Tablet) */}
              <p className="hidden sm:block text-[11px] text-[#3D463F]/80 leading-relaxed mt-1.5">
                Tanya seputar budidaya, penyakit, atau harga bawang merah.
              </p>

              {/* CTA Action button */}
              <div className="mt-2.5 sm:mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167A4A] group-hover:text-[#115E39] group-hover:translate-x-0.5 transition-all">
                  Tanya SIMA
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <span className="text-[10px] font-medium text-[#A63C5D] bg-[#FDF2F4] px-2 py-0.5 rounded-full">
                  SIMANTRI
                </span>
              </div>

              {/* Speech Bubble Triangular Pointer toward SIMA Mascot */}
              <div className="absolute -bottom-[10px] right-7 sm:right-9 w-4 h-3 pointer-events-none overflow-hidden">
                <svg
                  className="w-4 h-3"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0 L8 10 L16 0" fill="#FFFFFF" />
                  <path d="M0 0 L8 10 L16 0" stroke="#DCE8E1" strokeWidth="1.2" fill="none" />
                  <line x1="0.5" y1="0" x2="15.5" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
                </svg>
              </div>
            </div>
          )}

          {/* SIMA MASCOT BUTTON */}
          <button
            type="button"
            onClick={() => {
              if (isBubbleDismissed) {
                // If bubble was closed, clicking mascot toggles speech bubble or opens assistant
                setIsBubbleDismissed(false)
              } else {
                setIsOpen(true)
                setIsMinimized(false)
              }
            }}
            onContextMenu={(e) => {
              // Right-click or alternate tap allows toggling the bubble back if closed
              e.preventDefault()
              setIsBubbleDismissed(!isBubbleDismissed)
            }}
            className="group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#167A4A] focus-visible:ring-offset-2 rounded-full p-1 transition-transform active:translate-y-0"
            aria-label="Buka Asisten SIMA (Klik untuk berdiskusi)"
            title={isBubbleDismissed ? 'Tanya SIMA (Klik untuk membuka)' : 'Asisten SIMA'}
          >
            {/* Mascot Visual with Blinking Idle Animation - Single prominent large instance */}
            <div className="relative">
              <SimaMascot
                size={86}
                className="hover:brightness-105 transition-all"
                animated={true}
                enableBreathing={false}
              />
            </div>
          </button>
        </div>
      )}

      {/* FLOATING CHAT PANEL */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Percakapan SIMA"
          className={`sim-result fixed z-50 transition-all duration-300 ease-out font-jakarta ${
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
              <div className="w-9 h-9 rounded-xl bg-white/95 p-0.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                <SimaMascot size={32} animated={false} enableBreathing={false} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                    SIMA AI Assistant
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] text-emerald-100 leading-none mt-0.5 truncate">
                  {isMinimized ? 'Klik untuk membuka' : 'Knowledge Base Bawang Merah Nganjuk'}
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
              <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="py-6 px-3 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-[#DFF3E8] flex items-center justify-center mb-2.5 overflow-hidden">
                      <SimaMascot size={56} animated={true} enableBreathing={false} />
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
                          className="w-full text-left p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-[#167A4A] hover:bg-[#DFF3E8]/30 text-[11px] font-medium text-slate-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-[#167A4A] shrink-0" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`sim-message flex gap-2.5 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'sima' && (
                        <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-[#DFF3E8] shadow-xs flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <SimaMascot size={26} animated={false} enableBreathing={false} />
                        </div>
                      )}

                      <div className="max-w-[85%] space-y-1">
                        <div
                          className={`p-3.5 text-xs leading-relaxed shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-[#0e5b38] text-white rounded-3xl rounded-tr-md'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-3xl rounded-tl-md'
                          }`}
                        >
                          {msg.sender === 'sima' && (
                            <div className="flex items-center justify-between gap-1 pb-1 mb-1.5 border-b border-slate-100">
                              <span className="font-bold text-[10px] text-[#167A4A]">
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
                              aria-pressed={msg.feedback === 'helpful'}
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
                              aria-pressed={msg.feedback === 'not_helpful'}
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
                    <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-[#DFF3E8] shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                      <SimaMascot size={26} animated={false} enableBreathing={false} />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#167A4A] sim-typing-dot" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#167A4A] sim-typing-dot" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#167A4A] sim-typing-dot" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] text-slate-500 ml-1.5 font-medium">SIMA sedang merangkai jawaban...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5 flex items-end gap-1.5 focus-within:border-[#167A4A] focus-within:ring-2 focus-within:ring-[#167A4A]/10 focus-within:bg-white transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Pertanyaan untuk SIMA"
                    placeholder="Tanya SIMA apa saja..."
                    disabled={loading}
                    className="flex-1 max-h-24 min-h-[36px] p-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-0 outline-none resize-none leading-relaxed"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || loading}
                    className="h-11 w-11 rounded-xl bg-[#167A4A] text-white flex items-center justify-center transition-all hover:bg-[#115E39] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
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
