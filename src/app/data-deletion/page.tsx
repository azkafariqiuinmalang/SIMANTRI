'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Mail,
  ShieldAlert,
  UserX,
  FileSpreadsheet,
  Clock,
  Send,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'

export default function DataDeletionPage() {
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [reason, setReason] = useState('')
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const emailSubject = `Permohonan Penghapusan Data Akun SIMANTRI - ${userName || userEmail || 'Pengguna'}`
  const emailBody = 
`Halo Admin SIMANTRI,

Saya ingin mengajukan permohonan penghapusan akun dan data pribadi saya dari platform SIMANTRI.

Detail Akun:
- Nama: ${userName || '[Nama Pengguna]'}
- Email Terdaftar: ${userEmail || '[Email Terdaftar]'}
- Alasan Permohonan: ${reason || 'Penghapusan akun sukarela'}

Saya memahami bahwa setelah data dihapus, riwayat diagnosis penyakit tanaman dan konfigurasi lahan saya tidak dapat dipulihkan.

Terima kasih.`

  const handleOpenGmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !userEmail) {
      setStatusMessage('Mohon lengkapi Nama dan Alamat Email Anda terlebih dahulu.')
      return
    }
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=azkabanaran65@gmail.com&su=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`
    window.open(url, '_blank')
    setStatusMessage('Tab Gmail Web telah dibuka. Silakan tekan tombol "Send / Kirim" di halaman Gmail tersebut.')
  }

  const handleOpenDefaultMail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !userEmail) {
      setStatusMessage('Mohon lengkapi Nama dan Alamat Email Anda terlebih dahulu.')
      return
    }
    const mailtoUrl = `mailto:azkabanaran65@gmail.com?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoUrl
    setStatusMessage('Aplikasi email perangkat Anda telah dibuka. Silakan klik "Kirim" pada aplikasi email Anda.')
  }

  const handleCopyText = () => {
    if (!userName || !userEmail) {
      setStatusMessage('Mohon lengkapi Nama dan Alamat Email Anda terlebih dahulu.')
      return
    }
    navigator.clipboard.writeText(emailBody)
    setCopied(true)
    setStatusMessage('Teks permohonan berhasil disalin ke clipboard! Anda dapat menempelkannya (paste) ke email Anda secara manual.')
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F6ECDF] text-[#241812] flex flex-col selection:bg-[#C4487A]/20 selection:text-[#4A1F2B]">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F6ECDF]/90 border-b border-[#241812]/10 transition-all">
        <div className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-[#241812]/10 flex items-center justify-center">
              <Image
                src="/logo_simantri.png"
                alt="Logo SIMANTRI"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="block font-serif text-lg font-bold leading-none tracking-tight">
                SIMAN<em className="text-[#A6304F]">TRI</em>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6b5b52]">
                Penghapusan Data
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#241812]/15 bg-white/70 px-4 py-2 text-xs font-semibold text-[#241812] backdrop-blur-sm transition-all hover:bg-white hover:border-[#A6304F]/40 hover:text-[#A6304F] shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* SUB-NAVIGATION TABS */}
      <nav className="bg-[#EDE3D3] border-b border-[#241812]/10 px-4 sm:px-8 py-3">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link
              href="/privacy"
              className="rounded-full bg-white/60 text-[#54433A] hover:bg-white hover:text-[#241812] px-4 py-1.5 transition-all whitespace-nowrap"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className="rounded-full bg-white/60 text-[#54433A] hover:bg-white hover:text-[#241812] px-4 py-1.5 transition-all whitespace-nowrap"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              href="/data-deletion"
              className="rounded-full bg-[#A6304F] text-white px-4 py-1.5 shadow-sm font-semibold whitespace-nowrap"
            >
              Penghapusan Data
            </Link>
          </div>
          <span className="text-[11px] font-mono text-[#6b5b52]">
            Panduan Kepatuhan & Hak Pengguna
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {/* HERO BANNER */}
          <div className="mb-10 sm:mb-14 rounded-3xl bg-gradient-to-br from-[#FFFDF8] via-white to-[#FAF0E4] p-6 sm:p-10 border border-[#241812]/10 shadow-[0_20px_45px_-20px_rgba(36,24,18,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#A6304F]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 rounded-full border border-[#A6304F]/20 bg-[#A6304F]/10 px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E2340] mb-4">
              <Trash2 className="h-3.5 w-3.5 text-[#A6304F]" />
              User Data Deletion Instructions
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#241812] tracking-tight leading-tight">
              Instruksi & Permohonan Penghapusan Data
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#6b5b52] leading-relaxed max-w-2xl">
              SIMANTRI menghormati hak privasi dan kendali data Anda (<em>Right to be Forgotten</em>). Halaman ini menyediakan panduan lengkap bagi pengguna untuk menghapus akun dan data pribadi dari platform SIMANTRI.
            </p>
          </div>

          {/* GRID OF INSTRUCTIONS */}
          <div className="space-y-8 text-[#3D2E26] text-sm sm:text-base leading-relaxed">
            {/* Step by step */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-4 flex items-center gap-2">
                <UserX className="h-5 w-5 text-[#A6304F]" />
                Cara Menghapus Akun dan Data Anda
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1 */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5DFD6] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#A6304F] text-white font-bold text-xs mb-3">
                      1
                    </div>
                    <h3 className="font-bold text-sm text-[#241812] mb-1">
                      Melalui Dashboard Profil (Mandiri)
                    </h3>
                    <p className="text-xs text-[#6b5b52] leading-relaxed mb-4">
                      Jika Anda masih memiliki akses login, Anda dapat menghapus atau memperbarui informasi profil Anda secara langsung:
                    </p>
                    <ol className="text-xs text-[#54433A] space-y-1.5 list-decimal list-inside">
                      <li>Masuk ke akun Anda di <Link href="/login" className="text-[#A6304F] font-semibold underline">Portal Login</Link></li>
                      <li>Buka menu <strong>Profil Pengguna</strong> di sidebar dashboard</li>
                      <li>Pilih opsi pengeditan atau ajukan penonaktifan profil</li>
                    </ol>
                  </div>
                  <Link
                    href="/dashboard/profil"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#241812]/15 bg-[#FAF0E4] px-4 py-2 text-xs font-semibold text-[#241812] hover:bg-[#A6304F] hover:text-white hover:border-[#A6304F] transition-all"
                  >
                    Buka Halaman Profil
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Method 2 */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5DFD6] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#56724A] text-white font-bold text-xs mb-3">
                      2
                    </div>
                    <h3 className="font-bold text-sm text-[#241812] mb-1">
                      Melalui Email ke Admin SIMANTRI
                    </h3>
                    <p className="text-xs text-[#6b5b52] leading-relaxed mb-4">
                      Jika Anda tidak dapat mengakses akun atau ingin menghapus seluruh jejak data secara permanen oleh pengelola:
                    </p>
                    <ol className="text-xs text-[#54433A] space-y-1.5 list-decimal list-inside">
                      <li>Isi formulir di bawah ini</li>
                      <li>Kirimkan ke <strong className="text-[#241812]">azkabanaran65@gmail.com</strong> via Gmail Web atau aplikasi email Anda</li>
                      <li>Admin akan memverifikasi dan menghapus data Anda</li>
                    </ol>
                  </div>
                  <a
                    href="#form-penghapusan"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#A6304F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7E2340] transition-colors"
                  >
                    Buka Formulir Email
                  </a>
                </div>
              </div>
            </section>

            {/* Scope of data deletion */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-4 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[#E6A15C]" />
                Cakupan Data yang Dihapus vs Disimpan
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF0E4]/70 border border-[#E5DFD6]">
                  <h3 className="text-xs font-bold text-[#A6304F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Trash2 className="h-4 w-4" /> Data yang Dihapus Permanen:
                  </h3>
                  <ul className="text-xs text-[#54433A] space-y-1.5 list-disc list-inside">
                    <li>Nama lengkap, email, nomor HP, dan kredensial login</li>
                    <li>Foto tanaman dan gambar gejala penyakit yang diunggah</li>
                    <li>Riwayat sesi konsultasi Tanya Tani AI</li>
                    <li>Data spesifik lokasi kebun milik pribadi</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF0E4]/70 border border-[#E5DFD6]">
                  <h3 className="text-xs font-bold text-[#56724A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Data yang Diawetkan (Anonim):
                  </h3>
                  <ul className="text-xs text-[#54433A] space-y-1.5 list-disc list-inside">
                    <li>Catatan riwayat harga pasar historis (tanpa identitas pelapor)</li>
                    <li>Kontribusi artikel pengetahuan yang telah disetujui di pameran umum Dunia Brambang (ditransformasikan ke atribusi anonim)</li>
                    <li>Log keamanan audit sistem sesuai kewajiban hukum</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SLA & Timeline */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#56724A]/20 text-[#36512C] shrink-0 mt-1">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-2">
                    Waktu Pemrosesan (SLA)
                  </h2>
                  <p className="text-sm text-[#54433A]">
                    Permohonan penghapusan data yang diajukan ke admin akan diproses dalam waktu maksimal <strong className="text-[#241812]">3 x 24 jam kerja</strong> setelah verifikasi kepemilikan akun berhasil dilakukan. Anda akan menerima email konfirmasi setelah proses penghapusan selesai.
                  </p>
                </div>
              </div>
            </section>

            {/* FORM PERMOHONAN CEPAT */}
            <section id="form-penghapusan" className="rounded-2xl bg-white border border-[#241812]/15 p-6 sm:p-8 shadow-md scroll-mt-24">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#A6304F]/10 text-[#A6304F] mb-3">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#241812]">
                    Formulir Permohonan Penghapusan Akun
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6b5b52] mt-1">
                    Lengkapi data di bawah, lalu pilih metode pengiriman email ke Admin SIMANTRI (<strong>azkabanaran65@gmail.com</strong>).
                  </p>
                </div>

                {statusMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-[#56724A]/15 border border-[#56724A]/30 text-[#36512C] text-xs sm:text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#56724A] mt-0.5" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#241812] uppercase tracking-wider mb-1.5">
                      Nama Lengkap Anda <span className="text-[#A6304F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Contoh: Evodya Arun Rahma"
                      className="w-full rounded-xl border border-[#241812]/20 bg-[#FFFDF8] px-4 py-2.5 text-sm text-[#241812] placeholder-[#6b5b52]/50 focus:border-[#A6304F] focus:outline-none focus:ring-2 focus:ring-[#A6304F]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#241812] uppercase tracking-wider mb-1.5">
                      Alamat Email Terdaftar di SIMANTRI <span className="text-[#A6304F]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Contoh: emailAnda@gmail.com"
                      className="w-full rounded-xl border border-[#241812]/20 bg-[#FFFDF8] px-4 py-2.5 text-sm text-[#241812] placeholder-[#6b5b52]/50 focus:border-[#A6304F] focus:outline-none focus:ring-2 focus:ring-[#A6304F]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#241812] uppercase tracking-wider mb-1.5">
                      Alasan Penghapusan (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Tuliskan alasan atau catatan tambahan..."
                      className="w-full rounded-xl border border-[#241812]/20 bg-[#FFFDF8] px-4 py-2.5 text-sm text-[#241812] placeholder-[#6b5b52]/50 focus:border-[#A6304F] focus:outline-none focus:ring-2 focus:ring-[#A6304F]/20 resize-none"
                    />
                  </div>

                  {/* PREVIEW BOX */}
                  <div className="p-3.5 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6] text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#241812] uppercase tracking-wider text-[10px]">
                        Preview Format Permohonan Email:
                      </span>
                      <span className="text-[#6b5b52] text-[10px]">Tujuan: azkabanaran65@gmail.com</span>
                    </div>
                    <pre className="font-mono text-[11px] text-[#54433A] whitespace-pre-wrap bg-white/80 p-2.5 rounded-lg border border-[#E5DFD6] overflow-x-auto max-h-36">
                      {emailBody}
                    </pre>
                  </div>

                  {/* ACTIONS */}
                  <div className="pt-2 space-y-2.5">
                    {/* Option 1: Gmail Web Direct (Most Reliable) */}
                    <button
                      type="button"
                      onClick={handleOpenGmail}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#A6304F] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7E2340] active:scale-[0.99]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Buka & Kirim Langsung via Gmail Web
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Option 2: Default Mail App */}
                      <button
                        type="button"
                        onClick={handleOpenDefaultMail}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#241812]/15 bg-[#FAF0E4] px-4 py-2.5 text-xs font-semibold text-[#241812] hover:bg-[#EDE3D3] transition-all"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Buka Aplikasi Email Perangkat
                      </button>

                      {/* Option 3: Copy to Clipboard */}
                      <button
                        type="button"
                        onClick={handleCopyText}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#241812]/15 bg-white px-4 py-2.5 text-xs font-semibold text-[#241812] hover:bg-[#FAF0E4] transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#56724A]" />
                            <span className="text-[#56724A]">Format Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Salin Format Teks
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-[#6b5b52] pt-1">
                      Penerima: <span className="font-mono text-[#241812] font-medium">azkabanaran65@gmail.com</span> (Admin SIMANTRI)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1b120d] px-4 sm:px-8 py-10 text-[#F6ECDF]/70 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#F6ECDF]">SIMANTRI</span>
            <span>&copy; {new Date().getFullYear()} — Bawang Merah Nganjuk</span>
          </div>
          <div className="flex flex-wrap gap-4 text-[#F6ECDF]/80">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/data-deletion" className="text-[#E6A15C] font-semibold underline underline-offset-4">
              Penghapusan Data
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
