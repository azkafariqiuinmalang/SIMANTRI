import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SIMANTRI | Sistem Informasi Manajemen Pertanian Bawang Merah Nganjuk',
  description:
    'Platform ekosistem terpercaya untuk petani bawang merah Kabupaten Nganjuk: Prediksi Harga, Diagnosis Penyakit CV, dan Pameran Pengetahuan Digital Dunia Brambang.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FBF4EE] text-[#4A3A32] font-sans antialiased flex flex-col selection:bg-[#C4487A]/20 selection:text-[#4A1F2B]">
        {children}
      </body>
    </html>
  )
}
