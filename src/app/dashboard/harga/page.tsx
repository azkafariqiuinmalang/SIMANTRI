'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { MarketPrice } from '@/types/database'
import {
  Sprout,
  ArrowLeft,
  TrendingUp,
  Award,
  ShieldCheck,
  Calendar,
  Sparkles,
  Loader2,
  RefreshCw,
  Info,
} from 'lucide-react'

export default function PriceForecastPage() {
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
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
        <div className="py-16 text-center text-[#8A8580] bg-[#FBF4EE] rounded-xl border border-dashed border-[#E5DFD6]">
          <Info className="w-8 h-8 mx-auto mb-2 text-[#8A8580]" />
          <p className="text-sm font-medium text-[#4A3A32]">
            Data harga historis belum mencukupi untuk menampilkan grafik tren.
          </p>
          <p className="text-xs text-[#8A8580] mt-1">
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
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 stroke-[#C4487A]"
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
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#4A1F2B"
                  strokeWidth="2.5"
                />
              </g>
            )
          })}
        </svg>

        <div className="flex justify-between items-center text-[11px] text-[#8A8580] px-3 pt-2">
          <span>
            {history[0]?.tanggal
              ? new Date(history[0].tanggal).toLocaleDateString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                })
              : ''}
          </span>
          <span className="font-medium text-[#4A3A32]">
            Rentang Harga: Rp {Math.round(minPrice).toLocaleString('id-ID')} — Rp{' '}
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
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF4EE] flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-[#E5DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg text-[#4A3A32] hover:bg-[#FBF4EE] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-[#4A1F2B] text-[#FBF4EE] flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-[#E6A15C]" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-[#0E080A] tracking-tight block leading-none">
                SIMANTRI Pasar
              </span>
              <span className="text-[11px] text-[#8A8580] tracking-wider uppercase font-medium">
                Prakiraan & Tren Harga Bawang Merah
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              loadData()
              handlePredict(1)
            }}
            disabled={loading || predicting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A3A32] bg-[#FBF4EE] hover:bg-[#E5DFD6] rounded-lg border border-[#E5DFD6] transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                loading || predicting ? 'animate-spin' : ''
              }`}
            />
            Segarkan Data
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Transparency Badges */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3A5A40]/10 text-[#3A5A40] border border-[#3A5A40]/20">
            <ShieldCheck className="w-4 h-4" />
            Sumber Data: PIHPS Pasar Sukomoro + Cuaca Open-Meteo
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6A15C]/15 text-[#3D261A] border border-[#E6A15C]/30">
            <Award className="w-4 h-4 text-[#E6A15C]" />
            Akurasi Model XGBoost: MAPE ~3.0%
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C4487A]/10 text-[#C4487A] border border-[#C4487A]/20">
            <Sparkles className="w-3.5 h-3.5" />
            Versi Model: xgboost-v1
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Forecast Spotlight Card */}
          <div className="lg:col-span-1">
            <div className="card-standard p-6 sm:p-7 shadow-md border-2 border-[#C4487A]/30 bg-gradient-to-b from-white to-[#FBF4EE]/60">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-wider text-[#C4487A] uppercase">
                  Prakiraan Harga Cerdas
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#3A5A40]/15 text-[#3A5A40] font-semibold">
                  MAPE 3.0%
                </span>
              </div>

              {predicting ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C4487A] mx-auto mb-3" />
                  <p className="text-xs text-[#4A3A32]">
                    Menghitung fitur Lag, MA & inferensi XGBoost...
                  </p>
                </div>
              ) : forecast ? (
                <div>
                  <div className="text-xs text-[#8A8580] flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C4487A]" />
                    Target:{' '}
                    <strong className="text-[#0E080A]">
                      {new Date(forecast.prediction_date).toLocaleDateString(
                        'id-ID',
                        {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </strong>
                  </div>

                  <div className="my-4">
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0E080A]">
                      Rp {forecast.predicted_price.toLocaleString('id-ID')}
                      <span className="text-sm font-sans font-normal text-[#8A8580] ml-1">
                        / Kg
                      </span>
                    </div>

                    {history.length > 0 && (
                      <p className="text-xs text-[#4A3A32] mt-2 flex items-center gap-1">
                        <span>Harga pasar terakhir:</span>
                        <strong className="text-[#3A5A40]">
                          Rp{' '}
                          {Number(
                            history[history.length - 1].harga
                          ).toLocaleString('id-ID')}
                        </strong>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E5DFD6] space-y-2">
                    <label className="text-xs font-semibold text-[#4A3A32] block">
                      Prakiraan Hari Lainnya:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handlePredict(1)}
                        className="py-1.5 px-2 text-xs font-medium bg-white hover:bg-[#C4487A] hover:text-white border border-[#E5DFD6] rounded-lg transition-colors"
                      >
                        Besok
                      </button>
                      <button
                        onClick={() => handlePredict(3)}
                        className="py-1.5 px-2 text-xs font-medium bg-white hover:bg-[#C4487A] hover:text-white border border-[#E5DFD6] rounded-lg transition-colors"
                      >
                        +3 Hari
                      </button>
                      <button
                        onClick={() => handlePredict(7)}
                        className="py-1.5 px-2 text-xs font-medium bg-white hover:bg-[#C4487A] hover:text-white border border-[#E5DFD6] rounded-lg transition-colors"
                      >
                        +7 Hari
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-[#8A8580]">
                  Belum ada prakiraan yang dimuat.
                </div>
              )}
            </div>
          </div>

          {/* Trend Chart Card */}
          <div className="lg:col-span-2">
            <div className="card-standard p-6 sm:p-7 shadow-sm border border-[#E5DFD6]">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#C4487A]" />
                  <h2 className="text-lg font-serif font-bold text-[#0E080A]">
                    Grafik Tren Harga Bawang Merah
                  </h2>
                </div>
                <span className="text-xs font-medium text-[#8A8580]">
                  30 Data Terakhir
                </span>
              </div>

              {renderChart()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
