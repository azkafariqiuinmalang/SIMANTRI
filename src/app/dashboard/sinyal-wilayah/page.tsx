'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Activity,
  AlertTriangle,
  MapPin,
  Users,
  MessageSquare,
  Clock,
  RefreshCw,
  Loader2,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
} from 'lucide-react'

interface SignalItem {
  predicted_class: string
  village: string | null
  jumlah_feedback_tidak_sesuai: number
  jumlah_petani_berbeda: number
  catatan_petani: string[] | null
  feedback_terakhir: string | null
}

export default function SinyalWilayahPage() {
  const [signals, setSignals] = useState<SignalItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadSignals = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('v_cv_signal_review')
      .select('*')

    if (!error && data) {
      setSignals(data as SignalItem[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSignals()
  }, [loadSignals])

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-6xl w-full mx-auto text-[#0E080A]">
      {/* HEADER SECTION */}
      <div className="card-standard p-6 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-[#2A5A70] tracking-wider">
              Early Warning System &bull; View Sinyal Lapangan
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#0E080A] mt-1">
              Sinyal Ketidaksesuaian Penyakit Lapangan
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3A32] mt-1 max-w-2xl leading-relaxed">
              Agregasi feedback petani yang menandai hasil diagnosis Computer Vision &ldquo;Tidak Sesuai&rdquo; (minimal 2 petani berbeda di desa yang sama). Membantu Penyuluh mendeteksi anomali wabah baru atau varian penyakit di wilayah Nganjuk.
            </p>
          </div>

          <button
            onClick={loadSignals}
            disabled={loading}
            className="p-2 text-xs font-semibold text-[#4A3A32] bg-white border border-[#E5DFD6] hover:bg-[#FBF4EE] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan Sinyal</span>
          </button>
        </div>
      </div>

      {/* SIGNALS LIST */}
      {loading ? (
        <div className="card-standard p-12 text-center bg-white border border-[#E5DFD6]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A] mx-auto mb-2" />
          <p className="text-xs text-[#8A8580]">Menganalisis sinyal wilayah...</p>
        </div>
      ) : signals.length === 0 ? (
        <div className="card-standard p-12 text-center bg-white border border-[#E5DFD6] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#0E080A]">
              Tidak Ada Sinyal Anomali Kritis
            </h3>
            <p className="text-xs text-[#8A8580] mt-1 max-w-md mx-auto leading-relaxed">
              Semua diagnosis deteksi CV berjalan stabil dan belum ada klaster minimal 2 petani berbeda per desa yang mengajukan koreksi ketidaksesuaian.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signals.map((sig, idx) => (
            <div
              key={idx}
              className="card-standard p-5 bg-white border border-[#8C3A3A]/30 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD6]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#8C3A3A]" />
                  <span className="font-serif font-bold text-sm text-[#0E080A]">
                    Diagnosis: {sig.predicted_class}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-[#8C3A3A]/10 text-[#8C3A3A] px-2 py-0.5 rounded border border-[#8C3A3A]/20">
                  {sig.jumlah_petani_berbeda} Petani Berbeda
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#4A3A32]">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C4487A] shrink-0" />
                  <span>
                    Wilayah: <strong>{sig.village || 'Kabupaten Nganjuk'}</strong>
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#3A5A40] shrink-0" />
                  <span>
                    Total Feedback Tidak Sesuai: <strong>{sig.jumlah_feedback_tidak_sesuai}x</strong>
                  </span>
                </p>
                {sig.feedback_terakhir && (
                  <p className="flex items-center gap-1.5 text-[11px] text-[#8A8580]">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Laporan Terakhir:{' '}
                      {new Date(sig.feedback_terakhir).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </p>
                )}
              </div>

              {sig.catatan_petani && sig.catatan_petani.length > 0 && (
                <div className="p-3 rounded-xl bg-[#FBF4EE] border border-[#E5DFD6] space-y-1 text-xs">
                  <p className="font-semibold text-[#0E080A] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#C4487A]" />
                    <span>Catatan Koreksi dari Petani:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-[#4A3A32]">
                    {sig.catatan_petani.map((note, nIdx) => (
                      <li key={nIdx} className="leading-relaxed">
                        &ldquo;{note}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
