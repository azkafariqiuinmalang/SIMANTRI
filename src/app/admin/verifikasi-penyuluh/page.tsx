'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  BadgeCheck,
  FileText,
  Clock,
  MapPin,
  Building,
  RefreshCw,
  Loader2,
  Check,
  X,
  Eye,
  AlertTriangle,
  ArrowLeft,
  Search,
} from 'lucide-react'

export default function AdminVerifikasiPenyuluhPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [penyuluhList, setPenyuluhList] = useState<Profile[]>([])
  const [filterStatus, setFilterStatus] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string } | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!prof || prof.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    setProfile(prof as Profile)

    // Fetch all penyuluh profiles
    const { data: penyuluhs, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'penyuluh')
      .order('created_at', { ascending: false })

    if (!error && penyuluhs) {
      setPenyuluhList(penyuluhs as Profile[])
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpdateStatus = async (
    targetId: string,
    newStatus: 'verified' | 'rejected',
    targetName: string
  ) => {
    setActionLoading(targetId)
    setSuccessToast(null)
    const supabase = createClient()

    try {
      const isVerified = newStatus === 'verified'
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: newStatus,
          is_verified_contributor: isVerified,
          verified_at: isVerified ? new Date().toISOString() : null,
          verified_by: profile?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)

      if (error) throw error

      setSuccessToast(
        newStatus === 'verified'
          ? `Akun Penyuluh ${targetName} berhasil disetujui & diverifikasi!`
          : `Kredensial Penyuluh ${targetName} telah ditolak.`
      )

      // Optimistic update
      setPenyuluhList((prev) =>
        prev.map((p) =>
          p.id === targetId
            ? {
                ...p,
                verification_status: newStatus,
                is_verified_contributor: isVerified,
                verified_at: isVerified ? new Date().toISOString() : null,
              }
            : p
        )
      )
    } catch (err) {
      console.error('Error updating verification status:', err)
      alert('Gagal memperbarui status verifikasi penyuluh.')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredList = penyuluhList.filter((item) => {
    if (filterStatus === 'all') return true
    return (item.verification_status || 'unverified') === filterStatus
  })

  const pendingCount = penyuluhList.filter(
    (p) => (p.verification_status || 'unverified') === 'pending'
  ).length

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4487A]" />
          <p className="text-xs font-semibold text-[#4A3A32]">
            Memuat data verifikasi penyuluh...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto text-[#0E080A]">
      {/* HEADER SECTION */}
      <div className="card-standard p-4 sm:p-6 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase text-[#2A5A70] tracking-wider">
                Trusted Ecosystem Governance
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2A5A70]/10 text-[#2A5A70] font-semibold">
                Admin Panel
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E080A] mt-0.5">
              Verifikasi Kredensial Penyuluh Pertanian
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3A32] mt-1 max-w-2xl leading-relaxed">
              Tinjau dokumen bukti SK / KTA Dinas sebelum memberikan hak istimewa validasi rekomendasi penyakit dan moderasi materi budidaya.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-xs font-semibold text-[#4A3A32] bg-[#FBF4EE] border border-[#E5DFD6] hover:bg-[#E5DFD6] rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Segarkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOAST SUCCESS ALERT */}
      {successToast && (
        <div className="p-4 rounded-xl bg-[#3A5A40]/10 border border-[#3A5A40]/25 text-[#3A5A40] text-xs flex items-center justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-[#3A5A40]" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="p-1 hover:bg-[#3A5A40]/20 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
            filterStatus === 'pending'
              ? 'bg-[#C4487A] text-white border-[#C4487A] shadow-sm'
              : 'bg-white border-[#E5DFD6] text-[#4A3A32] hover:bg-[#FBF4EE]'
          }`}
        >
          <span>Menunggu Verifikasi</span>
          {pendingCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                filterStatus === 'pending'
                  ? 'bg-white text-[#C4487A]'
                  : 'bg-[#C4487A] text-white'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilterStatus('verified')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            filterStatus === 'verified'
              ? 'bg-[#3A5A40] text-white border-[#3A5A40] shadow-sm'
              : 'bg-white border-[#E5DFD6] text-[#4A3A32] hover:bg-[#FBF4EE]'
          }`}
        >
          Terverifikasi
        </button>

        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            filterStatus === 'rejected'
              ? 'bg-[#8C3A3A] text-white border-[#8C3A3A] shadow-sm'
              : 'bg-white border-[#E5DFD6] text-[#4A3A32] hover:bg-[#FBF4EE]'
          }`}
        >
          Ditolak
        </button>

        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            filterStatus === 'all'
              ? 'bg-[#0E080A] text-white border-[#0E080A] shadow-sm'
              : 'bg-white border-[#E5DFD6] text-[#4A3A32] hover:bg-[#FBF4EE]'
          }`}
        >
          Semua ({penyuluhList.length})
        </button>
      </div>

      {/* PENYULUH LIST */}
      {filteredList.length === 0 ? (
        <div className="card-standard p-12 text-center bg-white border border-[#E5DFD6] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 text-[#3A5A40] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#0E080A]">
              Tidak Ada Antrean Verifikasi
            </h3>
            <p className="text-xs text-[#8A8580] mt-1 max-w-sm mx-auto">
              Tidak ada akun penyuluh dalam status filter ini. Semua penyuluh aktif telah ditinjau.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const status = item.verification_status || 'unverified'

            return (
              <div
                key={item.id}
                className="card-standard p-5 bg-white border border-[#E5DFD6] space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD6]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2A5A70] to-[#0E080A] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {item.full_name?.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0E080A]">
                          {item.full_name}
                        </h3>
                        <p className="text-[11px] text-[#8A8580] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#E6A15C]" />
                          <span>Wilayah: {item.village || 'Kab. Nganjuk'}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-semibold border ${
                        status === 'verified'
                          ? 'bg-[#3A5A40]/10 border-[#3A5A40]/30 text-[#3A5A40]'
                          : status === 'pending'
                          ? 'bg-[#E6A15C]/15 border-[#E6A15C]/40 text-[#3D261A]'
                          : 'bg-[#8C3A3A]/10 border-[#8C3A3A]/30 text-[#8C3A3A]'
                      }`}
                    >
                      {status === 'verified'
                        ? 'Terverifikasi'
                        : status === 'pending'
                        ? 'Menunggu Review'
                        : 'Ditolak'}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FBF4EE]/70">
                      <span className="text-[#8A8580]">NIP / No. KTA:</span>
                      <strong className="font-mono text-[#0E080A]">
                        {item.nip || 'Belum diisi'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FBF4EE]/70">
                      <span className="text-[#8A8580]">Instansi / BPP:</span>
                      <strong className="text-[#0E080A] text-right truncate max-w-[200px]">
                        {item.institution || 'BPP Nganjuk'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FBF4EE]/70">
                      <span className="text-[#8A8580]">Waktu Daftar:</span>
                      <span className="text-[#0E080A] font-mono text-[11px]">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Document Proof Section */}
                    <div className="pt-1">
                      {item.verification_doc_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              name: item.full_name,
                              url: item.verification_doc_url!,
                            })
                          }
                          className="w-full py-2 px-3 rounded-xl border border-[#2A5A70]/30 bg-[#2A5A70]/5 hover:bg-[#2A5A70]/15 text-[#2A5A70] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Dokumen Bukti (KTA / SK)</span>
                        </button>
                      ) : (
                        <div className="py-2 px-3 rounded-xl bg-gray-50 text-gray-400 text-xs text-center border border-dashed border-gray-200">
                          Tidak ada lampiran dokumen
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-[#E5DFD6] flex items-center gap-2">
                  {status !== 'verified' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(item.id, 'verified', item.full_name)
                      }
                      disabled={actionLoading === item.id}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Setujui & Verifikasi</span>
                    </button>
                  )}

                  {status !== 'rejected' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(item.id, 'rejected', item.full_name)
                      }
                      disabled={actionLoading === item.id}
                      className="py-2 px-3 rounded-xl bg-white border border-[#8C3A3A]/30 text-[#8C3A3A] hover:bg-[#8C3A3A]/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* DOCUMENT PREVIEW LIGHTBOX / MODAL */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E5DFD6] flex items-center justify-between bg-[#FBF4EE]">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#0E080A]">
                  Dokumen Kredensial Penyuluh
                </h3>
                <p className="text-xs text-[#8A8580]">{previewDoc.name}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-[#8A8580] hover:text-[#0E080A] hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-[#0E080A]/5 min-h-[300px]">
              {previewDoc.url.startsWith('data:image') || previewDoc.url.startsWith('http') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDoc.url}
                  alt="Dokumen KTA"
                  className="max-h-[60vh] max-w-full rounded-lg object-contain border border-[#E5DFD6] shadow"
                />
              ) : (
                <iframe
                  src={previewDoc.url}
                  title="Preview Dokumen"
                  className="w-full h-[60vh] border rounded-lg"
                />
              )}
            </div>

            <div className="p-3 border-t border-[#E5DFD6] bg-white flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="py-1.5 px-4 rounded-xl bg-[#241812] text-white text-xs font-semibold"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
