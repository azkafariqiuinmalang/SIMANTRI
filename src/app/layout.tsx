import type { Metadata } from 'next'
import { Fraunces, Inter, Newsreader, Manrope, Caveat, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

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
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${newsreader.variable} ${manrope.variable} ${caveat.variable} ${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#FAF7F2] text-[#1A221D] font-sans antialiased flex flex-col selection:bg-[#167a4a]/20 selection:text-[#167a4a]">
        {children}
      </body>
    </html>
  )
}

