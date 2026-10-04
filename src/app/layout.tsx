import type { Metadata } from 'next'
import { Fraunces, Inter, Newsreader, Manrope, Caveat, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/ui/LanguageProvider'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { THEME_BOOTSTRAP } from '@/lib/theme'

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
      data-theme="light"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${newsreader.variable} ${manrope.variable} ${caveat.variable} ${fraunces.variable} ${inter.variable}`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head>
      <body className="min-h-screen bg-[#FAF7F2] dark:bg-[var(--theme-canvas)] text-[#1A221D] dark:text-[var(--theme-ink)] font-sans antialiased flex flex-col selection:bg-[#167a4a]/20 dark:selection:bg-[var(--theme-green-soft)] selection:text-[#167a4a] dark:selection:text-[var(--theme-green)]">
        <ThemeProvider><LanguageProvider>{children}</LanguageProvider></ThemeProvider>
      </body>
    </html>
  )
}

