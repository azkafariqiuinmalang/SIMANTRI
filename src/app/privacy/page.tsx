import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, Lock, Eye, FileText, Database, Trash2, Mail, CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi (Privacy Policy) | SIMANTRI',
  description:
    'Kebijakan Privasi SIMANTRI | Komitmen kami dalam melindungi data pribadi petani, penyuluh, dan pengguna ekosistem pertanian bawang merah Nganjuk.',
}

export default function PrivacyPage() {
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
                Kebijakan Privasi
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
              className="rounded-full bg-[#A6304F] text-white px-4 py-1.5 shadow-sm font-semibold whitespace-nowrap"
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
              className="rounded-full bg-white/60 text-[#54433A] hover:bg-white hover:text-[#241812] px-4 py-1.5 transition-all whitespace-nowrap"
            >
              Penghapusan Data
            </Link>
          </div>
          <span className="text-[11px] font-mono text-[#6b5b52]">
            Terakhir diperbarui: 25 Agustus 2026
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
              <Shield className="h-3.5 w-3.5 text-[#A6304F]" />
              Transparansi & Perlindungan Data
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#241812] tracking-tight leading-tight">
              Kebijakan Privasi SIMANTRI
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#6b5b52] leading-relaxed max-w-2xl">
              SIMANTRI (Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk) berkomitmen melindungi privasi data pribadi petani, penyuluh, dan seluruh pengguna platform. Dokumen ini menjelaskan bagaimana data Anda dikumpulkan, digunakan, dan dilindungi.
            </p>
          </div>

          {/* POLICY SECTIONS */}
          <div className="space-y-8 text-[#3D2E26] text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#A6304F]/10 text-[#A6304F] shrink-0 mt-1">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    1. Data yang Kami Kumpulkan
                  </h2>
                  <p className="mb-4">
                    Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan platform SIMANTRI, meliputi:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#54433A]">
                    <li>
                      <strong className="text-[#241812]">Informasi Akun:</strong> Nama lengkap, alamat email, nomor telepon/WhatsApp, peran pengguna (Petani, Penyuluh Pertanian Lapangan, atau Administrator).
                    </li>
                    <li>
                      <strong className="text-[#241812]">Data Lahan & Geografis:</strong> Lokasi kecamatan/desa lahan pertanian di wilayah Kabupaten Nganjuk, luas lahan, varietas bawang merah yang ditanam, dan estimasi waktu tanam/panen.
                    </li>
                    <li>
                      <strong className="text-[#241812]">Foto Tanaman & Diagnostik:</strong> Gambar daun dan umbi bawang merah yang Anda unggah ke fitur Computer Vision untuk keperluan analisis penyakit tanaman.
                    </li>
                    <li>
                      <strong className="text-[#241812]">Data Interaksi:</strong> Pertanyaan konsultasi pada fitur Chatbot Tanya Tani AI, riwayat pengecekan harga pasar, dan usulan data pengetahuan lokal.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#E6A15C]/20 text-[#8C531B] shrink-0 mt-1">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    2. Tujuan Penggunaan Data
                  </h2>
                  <p className="mb-3">
                    Data yang dikumpulkan digunakan semata-mata untuk meningkatkan produktivitas dan akurasi layanan bagi petani bawang merah:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6]">
                      <h3 className="font-semibold text-xs text-[#241812] uppercase tracking-wider mb-1">Diagnosis AI Penyakit</h3>
                      <p className="text-xs text-[#54433A]">Memproses visual citra daun untuk mengenali gejala Fusarium, Antraknosa, dan bercak ungu secara instan.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6]">
                      <h3 className="font-semibold text-xs text-[#241812] uppercase tracking-wider mb-1">Prakiraan Harga Cerdas</h3>
                      <p className="text-xs text-[#54433A]">Memberikan analisis tren harga bawang merah 1-7 hari ke depan berbasis model machine learning XGBoost.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6]">
                      <h3 className="font-semibold text-xs text-[#241812] uppercase tracking-wider mb-1">Verifikasi & Pendampingan</h3>
                      <p className="text-xs text-[#54433A]">Memfasilitasi Penyuluh Pertanian dalam memvalidasi usulan lapangan dan memberikan arahan SOP tani.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6]">
                      <h3 className="font-semibold text-xs text-[#241812] uppercase tracking-wider mb-1">Arsip Pengetahuan Lokal</h3>
                      <p className="text-xs text-[#54433A]">Mendokumentasikan kearifan lokal tani Nganjuk ke pameran edukasi digital Dunia Brambang.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#56724A]/20 text-[#36512C] shrink-0 mt-1">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    3. Keamanan & Penyimpanan Data
                  </h2>
                  <p className="mb-3">
                    Keamanan informasi Anda adalah prioritas kami. SIMANTRI menerapkan standar keamanan industri modern:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#54433A]">
                    <li>
                      <strong className="text-[#241812]">Enkripsi Data:</strong> Komunikasi data dilindungi protokol HTTPS/TLS dan database terenkripsi dengan teknologi Supabase.
                    </li>
                    <li>
                      <strong className="text-[#241812]">Kontrol Akses Berbasis Peran (RBAC):</strong> Hak akses data dibatasi secara ketat berdasarkan peran terdaftar dengan verifikasi Row-Level Security (RLS).
                    </li>
                    <li>
                      <strong className="text-[#241812]">Tidak Ada Penjualan Data:</strong> SIMANTRI tidak pernah dan tidak akan pernah menjual atau menyewakan data pribadi pengguna kepada pihak ketiga untuk kepentingan komersial.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#A6304F]/10 text-[#A6304F] shrink-0 mt-1">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    4. Hak Pengguna & Penghapusan Data
                  </h2>
                  <p className="mb-3">
                    Sebagai pengguna SIMANTRI, Anda memiliki kendali penuh atas data Anda, termasuk hak untuk:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#54433A] mb-4">
                    <li>Mengakses dan memperbarui informasi profil Anda kapan saja melalui dashboard.</li>
                    <li>Mengajukan permohonan penghapusan akun dan seluruh riwayat data terkait (Right to be Forgotten).</li>
                    <li>Mencabut izin akses kamera atau lokasi pada peramban/perangkat Anda.</li>
                  </ul>
                  <div className="mt-4 p-4 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-xs text-[#241812]">Ingin menghapus data akun Anda?</p>
                      <p className="text-xs text-[#6b5b52]">Pelajari langkah dan formulir penghapusan data mandiri.</p>
                    </div>
                    <Link
                      href="/data-deletion"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#A6304F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7E2340] transition-colors shrink-0"
                    >
                      Buka Panduan Penghapusan Data
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#241812]/10 text-[#241812] shrink-0 mt-1">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    5. Kontak & Pengelola Layanan
                  </h2>
                  <p className="mb-3 text-[#54433A]">
                    Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau pengelolaan data di SIMANTRI, silakan hubungi tim kami melalui:
                  </p>
                  <div className="p-4 rounded-xl bg-white border border-[#E5DFD6] space-y-1.5 text-xs text-[#54433A]">
                    <p><strong className="text-[#241812]">Kontak:</strong> <a href="mailto:azkabanaran65@gmail.com" className="text-[#A6304F] hover:underline font-medium">azkabanaran65@gmail.com</a> (Admin SIMANTRI)</p>
                    <p><strong className="text-[#241812]">Instansi:</strong> Tim SIMANTRI & Kolaborasi Pertanian Bawang Merah Kabupaten Nganjuk</p>
                    <p><strong className="text-[#241812]">Lokasi:</strong> Kabupaten Nganjuk, Jawa Timur, Indonesia</p>
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
            <span>&copy; {new Date().getFullYear()} Bawang Merah Nganjuk</span>
          </div>
          <div className="flex flex-wrap gap-4 text-[#F6ECDF]/80">
            <Link href="/privacy" className="text-[#E6A15C] font-semibold underline underline-offset-4">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/data-deletion" className="hover:text-white transition-colors">
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
