'use client'

import { useState } from 'react'
import { LayoutDashboard, Sparkles, ScanLine, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/components/ui/LanguageProvider'

export function PlatformVideoDemo() {
  const { t } = useLanguage()
  const [failed, setFailed] = useState(false)
  const features = [
    { icon: LayoutDashboard, title: t('Pantau lewat dashboard'), description: t('Lihat ringkasan kondisi pasar dan kesehatan tanaman dalam satu tampilan.') },
    { icon: Sparkles, title: t('Tanyakan kepada SIMA'), description: t('Ajukan pertanyaan budidaya dan baca panduan dari asisten agronomi SIMA.') },
    { icon: ScanLine, title: t('Kenali penyakit tanaman'), description: t('Unggah foto tanaman untuk melihat hasil deteksi dan rekomendasi penanganan.') },
    { icon: TrendingUp, title: t('Pelajari prediksi harga'), description: t('Pilih satu target tanggal dan lihat prediksi harga sesuai kemampuan layanan yang tersedia.') },
  ]

  return <section id="masalah" aria-labelledby="platform-demo-title" className="w-full scroll-mt-24 bg-[#FAF7F2] px-4 py-16 dark:bg-[var(--theme-canvas)] sm:px-6 lg:px-14 lg:py-24">
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="mb-3 block font-mono text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#275a3d] dark:text-[var(--theme-green)]">{t('SIMANTRI dalam genggaman')}</span>
        <h2 id="platform-demo-title" className="font-editorial text-[32px] font-medium leading-tight tracking-tight text-[#1A221D] dark:text-[var(--theme-ink)] sm:text-[42px]">{t('Lihat SIMANTRI bekerja untuk petani.')}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#5E665F] dark:text-[var(--theme-body)]">{t('Kenali dashboard, SIMA, deteksi penyakit, dan prediksi harga melalui rekaman penggunaan langsung di ponsel.')}</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1fr_320px_1fr] lg:gap-x-12 lg:gap-y-0">
        <figure className="relative isolate col-span-full row-start-1 mx-auto w-full max-w-[320px] lg:col-span-1 lg:col-start-2 lg:row-span-2">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DDE8D8] dark:bg-[var(--theme-green-soft)] lg:w-[380px]" />
          <div className="relative mx-auto w-[260px] max-w-full rounded-[42px] border-[7px] border-[#16222b] bg-[#16222b] p-1 shadow-[0_24px_60px_-20px_rgba(22,34,43,0.4)] ring-1 ring-[#637e6c]/50 sm:w-[292px]">
            <video
              controls
              playsInline
              preload="none"
              width={828}
              height={1792}
              poster="/media/simantri-demo-poster.jpg"
              src="/media/simantri-demo.mp4"
              aria-label={t('Video demonstrasi penggunaan SIMANTRI')}
              aria-describedby="platform-demo-caption"
              onError={() => setFailed(true)}
              className="block aspect-[207/448] h-auto w-full rounded-[31px] bg-black object-contain focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#91ddb1]"
            >
              {t('Browser Anda tidak mendukung pemutaran video.')}
            </video>
          </div>
          <figcaption id="platform-demo-caption" className="mt-5 text-center text-xs leading-relaxed text-[#5E665F] dark:text-[var(--theme-body)]">
            {t('Rekaman demonstrasi, bukan data terkini. Video tetap menggunakan bahasa rekaman asli.')}
          </figcaption>
          {failed && <p role="alert" className="mt-3 text-center text-sm text-[#6b1434] dark:text-[var(--theme-rose)]">{t('Video tidak dapat diputar.')}{' '}<a href="/media/simantri-demo.mp4" className="underline underline-offset-4">{t('Buka video langsung')}</a></p>}
        </figure>

        {features.map(({ icon: Icon, title, description }, index) => <article key={index} className={`relative min-w-0 text-center ${index % 2 === 0 ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-3 lg:text-left'} ${index < 2 ? 'lg:row-start-1' : 'lg:row-start-2'}`}>
          <span className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl font-editorial text-2xl font-bold ${index === 2 ? 'bg-[#173e2d] text-white dark:bg-[var(--theme-green)] dark:text-[var(--theme-canvas)]' : 'bg-[#DDE8D8] text-[#275a3d] dark:bg-[var(--theme-green-soft)] dark:text-[var(--theme-green)]'}`} aria-hidden="true">{index + 1}</span>
          <h3 className={`flex items-center justify-center gap-2 font-editorial text-[22px] font-semibold leading-snug text-[#1A221D] dark:text-[var(--theme-ink)] ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}><Icon className="h-4 w-4 shrink-0 text-[#275a3d] dark:text-[var(--theme-green)]" aria-hidden="true" />{title}</h3>
          <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-[#5E665F] dark:text-[var(--theme-body)] lg:max-w-none">{description}</p>
        </article>)}
      </div>
    </div>
  </section>
}
