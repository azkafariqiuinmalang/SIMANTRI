import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dunia Brambang | Pameran Digital SIMANTRI',
  description:
    'Sebuah pengalaman museum interaktif yang mengeksplorasi jiwa kehidupan, tanah suci, dan warisan pertanian Nganjuk.',
}

export default function DuniaBrambangPage() {
  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#0E080A] overflow-hidden z-50">
      <iframe
        src="/dunia-brambang.html"
        title="Dunia Brambang: Pameran Digital"
        className="w-full h-full border-0 block"
        allow="autoplay; fullscreen"
      />
    </main>
  )
}
