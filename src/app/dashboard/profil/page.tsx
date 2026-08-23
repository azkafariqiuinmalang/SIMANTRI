'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import {
  User,
  ShieldCheck,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  Sprout,
  Mail,
  Shield,
} from 'lucide-react'

const NGANJUK_KECAMATAN = [
  'Bagor',
  'Baron',
  'Berbek',
  'Gondang',
  'Jatikalen',
  'Kertosono',
  'Lengkong',
  'Loceret',
  'Nganjuk',
  'Ngetos',
  'Ngluyu',
  'Ngronggot',
  'Pace',
  'Patianrowo',
  'Prambon',
  'Rejoso',
  'Sawahan',
  'Sukomoro',
  'Tanjunganom',
  'Wilangan',
]

export default function ProfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>('')
  const [fullName, setFullName] = useState('')
  const [village, setVillage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && prof) {
        setProfile(prof as Profile)
        setFullName(prof.full_name || '')
        setVillage(prof.village || '')
      }
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          village: village.trim(),
        })
        .eq('id', profile.id)

      if (error) {
        setErrorMessage(error.message || 'Gagal memperbarui profil.')
      } else {
        setProfile({ ...profile, full_name: fullName.trim(), village: village.trim() })
        setSuccessMessage('Profil Anda berhasil diperbarui!')
        // Auto dismiss success alert after 4s
        setTimeout(() => setSuccessMessage(null), 4000)
      }
    } catch (err: unknown) {
      setErrorMessage('Terjadi kesalahan koneksi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#C4487A]" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 max-w-4xl w-full mx-auto text-[#0E080A]">
      {/* HEADER SECTION */}
      <div className="card-standard p-6 bg-gradient-to-r from-white via-white to-[#FBF4EE] border border-[#E5DFD6] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A1F2B] to-[#C4487A] text-white flex items-center justify-center text-2xl font-bold font-serif shadow-md shrink-0">
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0E080A]">
                {fullName || 'Pengguna SIMANTRI'}
              </h1>
              {profile?.is_verified_contributor && (
                <span
                  title="Kontributor Terverifikasi"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#3A5A40]/15 text-[#3A5A40] border border-[#3A5A40]/30"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Terverifikasi
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A8580] mt-0.5 flex items-center gap-2">
              <span className="font-mono">{email}</span>
              <span>&bull;</span>
              <span className="capitalize font-semibold text-[#C4487A]">
                Peran: {profile?.role}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR ALERTS */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#3A5A40]/10 border border-[#3A5A40]/30 text-[#3A5A40] text-xs flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#8C3A3A]/10 border border-[#8C3A3A]/30 text-[#8C3A3A] text-xs flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORM CARD */}
      <div className="card-standard p-6 sm:p-8 bg-white border border-[#E5DFD6] shadow-sm space-y-6">
        <div className="pb-4 border-b border-[#E5DFD6]">
          <h2 className="font-serif font-bold text-lg text-[#0E080A]">
            Informasi Pribadi & Wilayah Tanam
          </h2>
          <p className="text-xs text-[#8A8580] mt-0.5">
            Perbarui data diri dan lokasi budidaya Anda di wilayah Kabupaten Nganjuk.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0E080A]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Pak Sutrisno"
              className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A] text-[#0E080A]"
            />
          </div>

          {/* Email (Read only) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0E080A]">
              Alamat Email (Akun Login)
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={email}
                className="w-full py-2.5 px-3.5 pl-9 text-xs rounded-xl border border-[#E5DFD6] bg-[#FBF4EE] text-[#8A8580] cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-[#8A8580] absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-[#8A8580]">
              Email terikat dengan akun Supabase Auth dan tidak dapat diubah di sini.
            </p>
          </div>

          {/* Role (Read only) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0E080A]">
              Peran Aktor Sistem
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={`Aktor: ${profile?.role?.toUpperCase()}`}
                className="w-full py-2.5 px-3.5 pl-9 text-xs rounded-xl border border-[#E5DFD6] bg-[#FBF4EE] text-[#4A3A32] font-semibold cursor-not-allowed uppercase font-mono"
              />
              <Shield className="w-4 h-4 text-[#C4487A] absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-[#8A8580]">
              Hak akses halaman disesuaikan secara otomatis sesuai peran yang terdaftar.
            </p>
          </div>

          {/* Village / District */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0E080A]">
              Kecamatan / Desa Lokasi Budidaya
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={
                  NGANJUK_KECAMATAN.find((k) =>
                    village.toLowerCase().includes(k.toLowerCase())
                  ) || ''
                }
                onChange={(e) => {
                  const kec = e.target.value
                  setVillage(kec ? `Kecamatan ${kec}` : '')
                }}
                className="py-2.5 px-3.5 text-xs rounded-xl border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A] text-[#0E080A]"
              >
                <option value="">-- Pilih Kecamatan di Nganjuk --</option>
                {NGANJUK_KECAMATAN.map((k) => (
                  <option key={k} value={k}>
                    Kecamatan {k}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Atau ketik nama desa/kelurahan..."
                className="py-2.5 px-3.5 text-xs rounded-xl border border-[#E5DFD6] bg-white focus:outline-none focus:border-[#C4487A] text-[#0E080A]"
              />
            </div>
            <p className="text-[10px] text-[#8A8580]">
              Data wilayah digunakan untuk kalibrasi rekomendasi tanah dan cuaca lokal.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#E5DFD6] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 rounded-xl bg-[#C4487A] hover:bg-[#A83A68] text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#E6A15C]" />
                  <span>Simpan Perubahan Profil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
