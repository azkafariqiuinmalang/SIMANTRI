import Link from 'next/link'
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#E5DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-[#FBF4EE] flex items-center justify-center shadow-sm">
              <Sprout className="w-6 h-6 text-[#E6A15C]" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-[#0E080A] tracking-tight block leading-none">
                SIMANTRI
              </span>
              <span className="text-[11px] text-[#8A8580] tracking-wider uppercase font-medium">
                Kabupaten Nganjuk
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#4A3A32] hover:text-[#C4487A] transition-colors px-3 py-2"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-4 py-2 rounded-lg shadow-sm"
            >
              Daftar Akun
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C4487A]/10 border border-[#C4487A]/20 text-[#C4487A] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#E6A15C]" />
                NextGen Secure: Trusted Web Ecosystem
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0E080A] tracking-tight leading-[1.15]">
                Sistem Informasi Manajemen Pertanian{' '}
                <span className="text-[#C4487A] underline decoration-[#E6A15C]/40 underline-offset-8">
                  Bawang Merah
                </span>{' '}
                Nganjuk
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[#4A3A32] leading-relaxed">
                Membantu petani mengambil keputusan berbasis data di sepanjang
                siklus budidaya: dari waktu terbaik menjual panen, diagnosis dini
                penyakit, hingga preservasi kearifan lokal.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto btn-primary py-3 px-7 rounded-xl text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto btn-secondary py-3 px-7 rounded-xl text-base flex items-center justify-center gap-2"
                >
                  <span>Masuk Akun</span>
                </Link>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Prediksi Harga */}
              <div className="card-standard p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md border border-[#E5DFD6]">
                <div className="w-12 h-12 rounded-xl bg-[#C4487A]/10 text-[#C4487A] flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#0E080A] mb-3">
                  Prakiraan Harga Cerdas
                </h3>
                <p className="text-sm text-[#4A3A32] leading-relaxed">
                  Estimasi harga harian bawang merah 1–7 hari ke depan berbasis
                  Machine Learning (XGBoost) dengan transparansi akurasi dan
                  faktor cuaca.
                </p>
                <div className="mt-6 pt-4 border-t border-[#E5DFD6] flex items-center text-xs font-semibold text-[#3A5A40]">
                  <Award className="w-4 h-4 mr-1 text-[#3A5A40]" />
                  MAPE Model Historis: ~3.0%
                </div>
              </div>

              {/* Card 2: Deteksi Penyakit */}
              <div className="card-standard p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md border border-[#E5DFD6]">
                <div className="w-12 h-12 rounded-xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#0E080A] mb-3">
                  Deteksi Dini Penyakit
                </h3>
                <p className="text-sm text-[#4A3A32] leading-relaxed">
                  Diagnosis visual berbasis Computer Vision untuk deteksi gejala
                  Fusarium, Antraknosa, dan bercak daun dengan skor keyakinan &
                  disclaimer terpercaya.
                </p>
                <div className="mt-6 pt-4 border-t border-[#E5DFD6] flex items-center text-xs font-semibold text-[#8A8580]">
                  Terkoneksi ke Umpan Balik Petani & Penyuluh
                </div>
              </div>

              {/* Card 3: Dunia Brambang */}
              <div className="card-standard p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md border border-[#E5DFD6]">
                <div className="w-12 h-12 rounded-xl bg-[#4A1F2B]/10 text-[#4A1F2B] flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-[#E6A15C]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#0E080A] mb-3">
                  Dunia Brambang
                </h3>
                <p className="text-sm text-[#4A3A32] leading-relaxed">
                  Pameran pengetahuan digital budidaya bawang merah Nganjuk.
                  Akses publik terbuka, kurasi ketat oleh Admin dan verifikasi
                  Penyuluh.
                </p>
                <div className="mt-6 pt-4 border-t border-[#E5DFD6] flex items-center text-xs font-semibold text-[#C4487A]">
                  Akses Publik Tanpa Perlu Login &rarr;
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5DFD6] py-8 text-center text-sm text-[#8A8580]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif font-bold text-[#0E080A] text-base mb-1">
            SIMANTRI Nganjuk
          </p>
          <p className="text-xs text-[#8A8580]">
            Sistem Informasi Manajemen Pertanian Bawang Merah &copy; 2026.
            Kompetisi Web Development.
          </p>
        </div>
      </footer>
    </div>
  )
}
