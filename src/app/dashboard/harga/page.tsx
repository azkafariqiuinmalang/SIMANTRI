'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { MarketPrice } from '@/types/database'
import {
  Sprout,
  TrendingUp,
  Award,
  ShieldCheck,
  Calendar,
  Sparkles,
  Loader2,
  RefreshCw,
  Info,
  ChevronRight,
  Bot,
} from 'lucide-react'

export default function PriceForecastPage() {
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [selectedHorizon, setSelectedHorizon] = useState(1)
  const [history, setHistory] = useState<MarketPrice[]>([])
  const [forecast, setForecast] = useState<{
    prediction_date: string
    predicted_price: number
    latest_market_price: number
    mape_at_training: number
    model_version: string
  } | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    // 1. Fetch 30 hari riwayat harga
    const { data: priceData, error } = await supabase
      .from('market_price')
      .select('id, tanggal, harga, source, created_at')
      .order('tanggal', { ascending: true })
      .limit(30)

    if (!error && priceData && priceData.length > 0) {
      setHistory(priceData as MarketPrice[])
    }

    setLoading(false)
  }, [])

  const handlePredict = async (daysAhead = 1) => {
    setSelectedHorizon(daysAhead)
    setPredicting(true)
    try {
      const targetDate = new Date(Date.now() + daysAhead * 86400000)
        .toISOString()
        .split('T')[0]

      const res = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_date: targetDate }),
      })

      const json = await res.json()
      if (json.data) {
        setForecast(json.data)
      }
    } catch (e) {
      console.error('Error generating forecast:', e)
    } finally {
      setPredicting(false)
    }
  }

  useEffect(() => {
    loadData().then(() => {
      handlePredict(1)
    })
  }, [loadData])

  // Simple SVG Line Chart generator
  const renderChart = () => {
    if (history.length < 2) {
      return (
        <div className="py-12 text-center text-[#8A8580] bg-[#FBF4EE] rounded-xl border border-dashed border-[#E5DFD6]">
          <Info className="w-8 h-8 mx-auto mb-2 text-[#8A8580]" />
          <p className="text-xs sm:text-sm font-medium text-[#4A3A32]">
            Data harga historis belum mencukupi untuk menampilkan grafik tren.
          </p>
          <p className="text-[11px] text-[#8A8580] mt-1">
            Admin perlu menginput minimal 2 hari harga pasar terlebih dahulu.
          </p>
        </div>
      )
    }

    const prices = history.map((h) => Number(h.harga))
    const minPrice = Math.min(...prices) * 0.95
    const maxPrice = Math.max(...prices) * 1.05
    const height = 220
    const width = 700

    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * (width - 60) + 40
      const y =
        height -
        40 -
        ((Number(h.harga) - minPrice) / (maxPrice - minPrice || 1)) *
          (height - 70)
      return `${x},${y}`
    })

    const pathData = `M ${points.join(' L ')}`

    return (
      <div className="w-full overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[500px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-56 stroke-[#C4487A]"
          >
            {/* Grid lines */}
            <line
              x1="30"
              y1="30"
              x2={width - 20}
              y2="30"
              stroke="#E5DFD6"
              strokeDasharray="4"
            />
            <line
              x1="30"
              y1={height / 2}
              x2={width - 20}
              y2={height / 2}
              stroke="#E5DFD6"
              strokeDasharray="4"
            />
            <line
              x1="30"
              y1={height - 35}
              x2={width - 20}
              y2={height - 35}
              stroke="#E5DFD6"
            />

            {/* Area gradient under line */}
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4487A" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C4487A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path
              d={`${pathData} L ${
                (width - 60) + 40
              },${height - 35} L 40,${height - 35} Z`}
              fill="url(#priceGradient)"
              stroke="none"
            />

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#C4487A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {history.map((h, i) => {
              const x = (i / (history.length - 1)) * (width - 60) + 40
              const y =
                height -
                40 -
                ((Number(h.harga) - minPrice) / (maxPrice - minPrice || 1)) *
                  (height - 70)
              return (
                <g key={h.id} className="group cursor-pointer">
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#4A1F2B"
                    strokeWidth="2"
                  />
                </g>
              )
            })}
          </svg>

          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-[#8A8580] px-2 pt-2">
            <span>
              {history[0]?.tanggal
                ? new Date(history[0].tanggal).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                  })
                : ''}
            </span>
            <span className="font-medium text-[#4A3A32]">
              Rentang: Rp {Math.round(minPrice).toLocaleString('id-ID')} s.d. Rp{' '}
              {Math.round(maxPrice).toLocaleString('id-ID')} / Kg
            </span>
            <span>
              {history[history.length - 1]?.tanggal
                ? new Date(
                    history[history.length - 1].tanggal
                  ).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                  })
                : ''}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto text-[#0E080A]">
      {/* HEADER ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#E5DFD6] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase text-[#C4487A] tracking-wider">
              Market Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3A5A40]/10 text-[#3A5A40] font-mono font-semibold">
              XGBoost v1
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E080A] mt-0.5">
            Prakiraan & Tren Harga Bawang Merah
          </h1>
          <p className="text-xs text-[#8A8580] mt-1">
            Data pasar Pasar Sukomoro disandingkan dengan sinyal cuaca harian Nganjuk.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#C4487A] bg-[#C4487A]/10 hover:bg-[#C4487A]/20 rounded-xl border border-[#C4487A]/25 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tanya SIMA AI</span>
          </Link>
          <button
            onClick={() => {
              loadData()
              handlePredict(selectedHorizon)
            }}
            disabled={loading || predicting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4A3A32] bg-[#FBF4EE] hover:bg-[#E5DFD6] rounded-xl border border-[#E5DFD6] transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading || predicting ? 'animate-spin' : ''}`}
            />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* TRANSPARENCY PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#3A5A40]/10 text-[#3A5A40] border border-[#3A5A40]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Pasar Sukomoro + Open-Meteo
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E6A15C]/15 text-[#3D261A] border border-[#E6A15C]/30">
          <Award className="w-3.5 h-3.5 text-[#E6A15C]" />
          Akurasi: MAPE ~3.0%
        </span>
      </div>

      {/* FORECAST & CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Card */}
        <div className="lg:col-span-1">
          <div className="card-standard p-5 sm:p-6 shadow-sm border-2 border-[#C4487A]/30 bg-gradient-to-b from-white to-[#FBF4EE]/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-wider text-[#C4487A] uppercase font-mono">
                  Estimasi Harga Panen
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#3A5A40]/15 text-[#3A5A40] font-semibold">
                  MAPE 3.0%
                </span>
              </div>

              {predicting ? (
                <div className="py-10 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C4487A] mx-auto mb-2" />
                  <p className="text-xs text-[#4A3A32]">
                    Menghitung inferensi XGBoost...
                  </p>
                </div>
              ) : forecast ? (
                <div>
                  <div className="text-xs text-[#8A8580] flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C4487A]" />
                    <span>Target:</span>
                    <strong className="text-[#0E080A]">
                      {new Date(forecast.prediction_date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>

                  <div className="my-3">
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0E080A]">
                      Rp {forecast.predicted_price.toLocaleString('id-ID')}
                      <span className="text-xs font-sans font-normal text-[#8A8580] ml-1">
                        / Kg
                      </span>
                    </div>

                    {history.length > 0 && (
                      <p className="text-xs text-[#4A3A32] mt-2 flex items-center gap-1">
                        <span>Harga pasar terakhir:</span>
                        <strong className="text-[#3A5A40]">
                          Rp{' '}
                          {Number(history[history.length - 1].harga).toLocaleString('id-ID')}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#8A8580]">
                  Belum ada prakiraan yang dimuat.
                </div>
              )}
            </div>

            {/* Target Horizon Buttons */}
            <div className="pt-4 border-t border-[#E5DFD6] space-y-2">
              <label className="text-xs font-semibold text-[#4A3A32] block">
                Pilih Target Hari:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Besok', days: 1 },
                  { label: '+3 Hari', days: 3 },
                  { label: '+7 Hari', days: 7 },
                ].map((item) => (
                  <button
                    key={item.days}
                    onClick={() => handlePredict(item.days)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                      selectedHorizon === item.days
                        ? 'bg-[#C4487A] text-white border-[#C4487A] shadow-sm'
                        : 'bg-white hover:bg-[#FBF4EE] text-[#4A3A32] border-[#E5DFD6]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart Card */}
        <div className="lg:col-span-2">
          <div className="card-standard p-5 sm:p-6 shadow-sm border border-[#E5DFD6] bg-white">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#C4487A]" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#0E080A]">
                  Grafik Tren 30 Hari Terakhir
                </h2>
              </div>
              <span className="text-xs font-mono text-[#8A8580]">
                Pasar Sukomoro
              </span>
            </div>

            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  )
}
