import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, FileText, Scale, AlertTriangle, Cpu, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan (Terms of Service) | SIMANTRI',
  description:
    'Syarat dan Ketentuan Penggunaan SIMANTRI | Pedoman dan aturan penggunaan layanan ekosistem teknologi pertanian bawang merah Nganjuk.',
}

export default function TermsPage() {
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
                Syarat & Ketentuan
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
              className="rounded-full bg-[#A6304F] text-white px-4 py-1.5 shadow-sm font-semibold whitespace-nowrap"
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
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#E6A15C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6A15C]/30 bg-[#E6A15C]/15 px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C531B] mb-4">
              <Scale className="h-3.5 w-3.5 text-[#8C531B]" />
              Ketentuan Penggunaan Platform
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#241812] tracking-tight leading-tight">
              Syarat dan Ketentuan Layanan
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#6b5b52] leading-relaxed max-w-2xl">
              Selamat datang di SIMANTRI. Dengan mengakses atau menggunakan aplikasi web dan layanan SIMANTRI, Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut.
            </p>
          </div>

          {/* TERMS SECTIONS */}
          <div className="space-y-8 text-[#3D2E26] text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#A6304F]/10 text-[#A6304F] shrink-0 mt-1">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    1. Ketentuan Umum & Definisi
                  </h2>
                  <p className="mb-3">
                    Dalam Syarat dan Ketentuan ini, yang dimaksud dengan:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#54433A]">
                    <li>
                      <strong className="text-[#241812]">SIMANTRI:</strong> Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk, platform berbasis web yang menyediakan prakiraan harga, deteksi penyakit tanaman berbasis computer vision, asisten konsultasi AI, dan arsip pengetahuan pertanian.
                    </li>
                    <li>
                      <strong className="text-[#241812]">Pengguna:</strong> Setiap individu yang mengakses platform, baik sebagai Petani, Penyuluh Pertanian Lapangan (PPL), Administrator, maupun masyarakat umum.
                    </li>
                    <li>
                      <strong className="text-[#241812]">Layanan:</strong> Seluruh fitur interaktif, analitik data, pameran digital Dunia Brambang, dan modul konsultasi yang tersedia di domain resmi SIMANTRI.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#56724A]/20 text-[#36512C] shrink-0 mt-1">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    2. Akun, Hak Akses & Tanggung Jawab Pengguna
                  </h2>
                  <ul className="space-y-2.5 list-disc list-inside text-[#54433A]">
                    <li>Pengguna wajib memberikan informasi yang akurat, benar, dan terkini saat melakukan pendaftaran akun.</li>
                    <li>Akun dengan peran <strong>Penyuluh Pertanian</strong> wajib melalui proses verifikasi dan persetujuan oleh Administrator sebelum mendapatkan hak akses khusus validasi usulan.</li>
                    <li>Pengguna bertanggung jawab penuh dalam menjaga kerahasiaan kata sandi serta segala aktivitas yang terjadi di bawah akun masing-masing.</li>
                    <li>Pengguna dilarang menggunakan platform untuk tindakan yang melanggar hukum, memalsukan data harga pasar, atau menyebarkan konten yang merusak integritas sistem.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#E6A15C]/20 text-[#8C531B] shrink-0 mt-1">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    3. Batasan Tanggung Jawab Kecerdasan Buatan (AI Disclaimer)
                  </h2>
                  <div className="p-4 rounded-xl bg-[#FAF0E4] border border-[#E5DFD6] mb-4">
                    <p className="text-xs sm:text-sm text-[#8C531B] font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-[#8C531B]" />
                      Pemberitahuan Penting Mengenai Fitur Analitik & AI:
                    </p>
                  </div>
                  <ul className="space-y-2.5 list-disc list-inside text-[#54433A]">
                    <li>
                      <strong className="text-[#241812]">Deteksi Penyakit AI:</strong> Hasil analisis gambar tanaman berbasis Computer Vision berfungsi sebagai panduan diagnosis awal dan rekomendasi pendukung. Keputusan penanganan OPT dan penggunaan pestisida tetap disarankan untuk dikonfirmasikan dengan Penyuluh Pertanian setempat.
                    </li>
                    <li>
                      <strong className="text-[#241812]">Prakiraan Harga XGBoost:</strong> Proyeksi harga bawang merah 1-7 hari ke depan dihasilkan melalui model statistik historis. Harga aktual di pasar dapat dipengaruhi oleh faktor cuaca ekstrem tak terduga, fluktuasi pasokan nasional, atau dinamika pasar mendadak.
                    </li>
                    <li>
                      SIMANTRI dan pengembang tidak bertanggung jawab atas kerugian finansial langsung atau tidak langsung yang timbul akibat keputusan bisnis/tani semata-mata berdasarkan hasil komputasi sistem.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#A6304F]/10 text-[#A6304F] shrink-0 mt-1">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    4. Hak Kekayaan Intelektual
                  </h2>
                  <p className="mb-3">
                    Seluruh desain antarmuka, kode sumber, logo, narasi kurasi di modul <em>Dunia Brambang</em>, dan model komputasi merupakan hak milik SIMANTRI dan mitra pengembang terkait yang dilindungi undang-undang hak cipta Republik Indonesia.
                  </p>
                  <p className="text-[#54433A]">
                    Data kearifan lokal yang disumbangkan oleh petani tetap dihormati sebagai kontribusi komunitas untuk kemajuan pertanian Nganjuk secara terbuka dan edukatif.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="rounded-2xl bg-[#FFFDF8]/90 border border-[#241812]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#241812]/10 text-[#241812] shrink-0 mt-1">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#241812] mb-3">
                    5. Perubahan Ketentuan & Hukum yang Berlaku
                  </h2>
                  <p className="mb-3 text-[#54433A]">
                    SIMANTRI berhak memperbarui Syarat & Ketentuan ini sewaktu-waktu demi menyesuaikan perkembangan teknologi dan regulasi pemerintah. Penggunaan berkelanjutan atas platform menandakan persetujuan Anda terhadap perubahan tersebut.
                  </p>
                  <p className="text-[#54433A]">
                    Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Negara Kesatuan Republik Indonesia.
                  </p>
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
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-[#E6A15C] font-semibold underline underline-offset-4">
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
