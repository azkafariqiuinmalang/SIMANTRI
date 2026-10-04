'use client'

import { useLanguage } from '@/components/ui/LanguageProvider'

import type { LucideIcon } from 'lucide-react'
import { ChevronRight, Info } from 'lucide-react'
import Link from 'next/link'
import { useId, useMemo, useState } from 'react'

export function PageHeading({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string
  description: string
  icon?: LucideIcon
  action?: React.ReactNode
}) {
  const { t } = useLanguage()
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[clamp(1.85rem,4vw,2.6rem)] font-bold tracking-[-0.035em] text-[var(--sim-color-foreground)]">
            {t(title)}
          </h1>
          {Icon && <Icon className="hidden h-7 w-7 text-[var(--sim-color-primary)] dark:text-[var(--theme-green)] sm:block" aria-hidden="true" />}
        </div>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--sim-color-muted)] sm:text-base">
          {t(description)}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = 'green',
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  icon: LucideIcon
  href?: string
  tone?: 'green' | 'rose' | 'amber' | 'blue'
}) {
  const { t } = useLanguage()
  const tones = {
    green: 'bg-[var(--sim-green-50)] text-[var(--sim-green-600)]',
    rose: 'bg-[var(--sim-rose-50)] text-[var(--sim-rose-500)]',
    amber: 'bg-[var(--sim-amber-50)] text-[var(--sim-amber-500)]',
    blue: 'bg-[var(--sim-blue-50)] text-[var(--sim-blue-600)]',
  }

  const content = (
    <div className="sim-card-flat group relative h-full overflow-hidden p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        {href && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--sim-color-border)] text-[var(--sim-color-muted)] transition-colors group-hover:border-[var(--sim-green-200)] group-hover:text-[var(--sim-color-primary)] dark:group-hover:text-[var(--theme-green)]">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-semibold leading-5 text-[var(--sim-color-body)]">{t(label)}</p>
      <div className="sim-tabular mt-1 text-[clamp(1.35rem,3vw,2rem)] font-extrabold tracking-[-0.035em] text-[var(--sim-color-foreground)]">
        {typeof value === 'string' ? t(value) : value}
      </div>
      {hint && <div className="mt-1 text-xs leading-5 text-[var(--sim-color-muted)]">{typeof hint === 'string' ? t(hint) : hint}</div>}
    </div>
  )

  return href ? (
    <Link href={href} className="sim-focus sim-interactive-card block h-full rounded-[var(--sim-radius-card)]">
      {content}
    </Link>
  ) : (
    content
  )
}

export interface PriceChartPoint {
  label: string
  value: number
  source?: string
}

export function PriceLineChart({
  points,
  height = 260,
}: {
  points: PriceChartPoint[]
  height?: number
}) {
  const { t } = useLanguage()
  const gradientId = useId().replaceAll(':', '')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const geometry = useMemo(() => {
    if (points.length < 2) return null
    const width = 760
    const padding = { top: 28, right: 20, bottom: 38, left: 54 }
    const values = points.map((item) => item.value)
    const rawMin = Math.min(...values)
    const rawMax = Math.max(...values)
    const range = rawMax - rawMin || Math.max(rawMax * 0.1, 1)
    const min = rawMin - range * 0.18
    const max = rawMax + range * 0.18
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const plotted = points.map((point, index) => ({
      ...point,
      x: padding.left + (index / (points.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((point.value - min) / (max - min)) * chartHeight,
    }))
    const line = `M ${plotted.map((point) => `${point.x},${point.y}`).join(' L ')}`
    const area = `${line} L ${plotted.at(-1)!.x},${height - padding.bottom} L ${plotted[0].x},${height - padding.bottom} Z`
    return { width, padding, min, max, plotted, line, area, chartHeight }
  }, [height, points])

  if (!geometry) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--sim-color-border)] bg-[var(--sim-green-50)]/40 px-6 text-center">
        <Info className="mb-2 h-6 w-6 text-[var(--sim-color-primary)] dark:text-[var(--theme-green)]" aria-hidden="true" />
        <p className="text-sm font-semibold text-[var(--sim-color-body)]">{t("Data tren belum mencukupi")}</p>
        <p className="mt-1 text-xs text-[var(--sim-color-muted)]">{t("Grafik akan muncul setelah tersedia sedikitnya dua catatan harga.")}</p>
      </div>
    )
  }

  const tickIndexes = Array.from(new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]))

  return (
    <div className="relative w-full overflow-x-auto pb-1" aria-label={t("Grafik tren harga bawang merah")}>
      <svg viewBox={`0 0 ${geometry.width} ${height}`} className="min-w-[620px] w-full" role="group" aria-label={t("Tren harga; pilih titik untuk detail")}>
        <title>{t("Tren harga bawang merah")}</title>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sim-green-500)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--sim-green-500)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = geometry.padding.top + geometry.chartHeight * ratio
          const value = geometry.max - (geometry.max - geometry.min) * ratio
          return (
            <g key={ratio}>
              <line x1={geometry.padding.left} x2={geometry.width - geometry.padding.right} y1={y} y2={y} stroke="var(--sim-color-border)" strokeWidth="1" />
              <text x={geometry.padding.left - 9} y={y + 4} textAnchor="end" fill="var(--sim-color-muted)" fontSize="11">
                {Math.round(value / 1000)}{t("k")}</text>
            </g>
          )
        })}
        <path d={geometry.area} fill={`url(#${gradientId})`} />
        <path d={geometry.line} fill="none" stroke="var(--sim-green-600)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {geometry.plotted.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="30"
              fill="transparent"
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`${point.label}, Rp ${point.value.toLocaleString('id-ID')} per kilogram`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveIndex(index) }
                if (event.key === 'Escape') setActiveIndex(null)
              }}
            />
            <circle cx={point.x} cy={point.y} r={activeIndex === index ? 7 : index === geometry.plotted.length - 1 ? 5 : 3.5} fill="var(--sim-green-600)" stroke="#fff" strokeWidth="2" pointerEvents="none" />
          </g>
        ))}
        {tickIndexes.map((index) => {
          const point = geometry.plotted[index]
          return <text key={index} x={point.x} y={height - 12} textAnchor="middle" fill="var(--sim-color-muted)" fontSize="11">{point.label}</text>
        })}
      </svg>
      {activeIndex !== null && points[activeIndex] && (
        <div className="sim-tooltip pointer-events-none absolute right-3 top-3 rounded-xl bg-[var(--sim-green-900)] px-3 py-2 text-xs text-white shadow-lg" aria-live="polite">
          <p className="font-bold">Rp {points[activeIndex].value.toLocaleString('id-ID')}{t("/kg")}</p>
          <p className="mt-0.5 text-white/75">{points[activeIndex].label}</p>
        </div>
      )}
    </div>
  )
}
