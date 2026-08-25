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
} from 'lucide-react'

export default function DataDeletionPage() {
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Permohonan Penghapusan Data Akun SIMANTRI - ${userName || userEmail}`)
    const body = encodeURIComponent(
      `Halo Tim Dukungan SIMANTRI,\n\n` +
      `Saya ingin mengajukan permohonan penghapusan akun dan data pribadi saya dari platform SIMANTRI.\n\n` +
      `Detail Akun:\n` +
      `- Nama: ${userName}\n` +
      `- Email Terdaftar: ${userEmail}\n` +
      `- Alasan Permohonan: ${reason || 'Penghapusan akun sukarela'}\n\n` +
      `Saya memahami bahwa setelah data dihapus, riwayat diagnosis penyakit tanaman dan konfigurasi lahan saya tidak dapat dipulihkan.\n\n` +
      `Terima kasih.`
    )
    window.location.href = `mailto:azkabanaran65@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
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
              SIMANTRI menghormati hak privasi dan kendali data Anda (*Right to be Forgotten*). Halaman ini menyediakan panduan lengkap bagi pengguna untuk menghapus akun dan data pribadi dari server SIMANTRI.
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
                      Melalui Permohonan Email Resmi
                    </h3>
                    <p className="text-xs text-[#6b5b52] leading-relaxed mb-4">
                      Jika Anda tidak dapat mengakses akun atau ingin menghapus seluruh jejak data secara permanen oleh tim teknis kami:
                    </p>
                    <ol className="text-xs text-[#54433A] space-y-1.5 list-decimal list-inside">
                      <li>Gunakan formulir cepat di bawah ini atau kirim email langsung</li>
                      <li>Kirim email ke <strong className="text-[#241812]">azkabanaran65@gmail.com</strong></li>
                      <li>Gunakan subjek: <code className="bg-[#FAF0E4] px-1 py-0.5 rounded text-[11px]">Permohonan Penghapusan Akun</code></li>
                      <li>Sertakan alamat email yang terdaftar</li>
                    </ol>
                  </div>
                  <a
                    href="#form-penghapusan"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#A6304F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7E2340] transition-colors"
                  >
                    Isi Formulir Permohonan Cepat
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
                    Permohonan penghapusan data yang diajukan melalui email atau formulir resmi akan diproses dalam waktu maksimal <strong className="text-[#241812]">3 x 24 jam kerja</strong> setelah verifikasi kepemilikan akun berhasil dilakukan. Anda akan menerima email konfirmasi penutupan data setelah proses selesai.
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
                    Isi detail berikut untuk membuka klien email Anda dengan template permohonan yang telah terformat otomatis.
                  </p>
                </div>

                {submitted && (
                  <div className="mb-6 p-4 rounded-xl bg-[#56724A]/15 border border-[#56724A]/30 text-[#36512C] text-xs sm:text-sm flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#56724A]" />
                    <span>Aplikasi email Anda telah dibuka. Silakan klik tombol <strong>Kirim</strong> pada klien email Anda untuk merampungkan permohonan.</span>
                  </div>
                )}

                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#241812] uppercase tracking-wider mb-1.5">
                      Nama Lengkap Anda
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full rounded-xl border border-[#241812]/20 bg-[#FFFDF8] px-4 py-2.5 text-sm text-[#241812] placeholder-[#6b5b52]/50 focus:border-[#A6304F] focus:outline-none focus:ring-2 focus:ring-[#A6304F]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#241812] uppercase tracking-wider mb-1.5">
                      Alamat Email Terdaftar di SIMANTRI
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="email@domain.com"
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

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#A6304F] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7E2340] active:scale-[0.99]"
                    >
                      <Send className="h-4 w-4" />
                      Kirim Permohonan via Email
                    </button>
                    <p className="text-[11px] text-center text-[#6b5b52] mt-2">
                      Permohonan akan diarahkan langsung ke <span className="font-mono text-[#241812]">azkabanaran65@gmail.com</span> (Admin SIMANTRI)
                    </p>
                  </div>
                </form>
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
