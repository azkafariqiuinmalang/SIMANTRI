import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Koordinat Nganjuk untuk Open-Meteo API
const NGANJUK_LAT = -7.604
const NGANJUK_LON = 111.904

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Cek autentikasi dan role Admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { data: null, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: 'Akses ditolak: Hanya Admin yang boleh menginput harga harian',
            code: 'FORBIDDEN',
          },
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { tanggal, harga } = body

    if (!tanggal || !harga || isNaN(Number(harga))) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: 'Format data tidak valid. Tanggal dan harga wajib diisi.',
            code: 'BAD_REQUEST',
          },
        },
        { status: 400 }
      )
    }

    // 2. Simpan / Upsert ke tabel market_price
    const { data: savedPrice, error: priceError } = await supabase
      .from('market_price')
      .upsert(
        {
          tanggal,
          harga: Number(harga),
          source: 'manual',
          input_by: user.id,
        },
        { onConflict: 'tanggal' }
      )
      .select()
      .single()

    if (priceError) {
      return NextResponse.json(
        { data: null, error: { message: priceError.message, code: priceError.code } },
        { status: 500 }
      )
    }

    // 3. Fetch cuaca hari itu dari Open-Meteo API dan simpan ke weather_data
    let weatherSaved = false
    try {
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${NGANJUK_LAT}&longitude=${NGANJUK_LON}&start_date=${tanggal}&end_date=${tanggal}&daily=temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=Asia%2FJakarta`
      const weatherRes = await fetch(openMeteoUrl)
      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json()
        if (weatherJson.daily && weatherJson.daily.time && weatherJson.daily.time.length > 0) {
          const temp = weatherJson.daily.temperature_2m_mean?.[0] ?? null
          const rain = weatherJson.daily.precipitation_sum?.[0] ?? null
          const wind = weatherJson.daily.wind_speed_10m_max?.[0] ?? null

          await supabase.from('weather_data').upsert(
            {
              tanggal,
              temperature: temp,
              rainfall: rain,
              wind_speed: wind,
              fetched_at: new Date().toISOString(),
            },
            { onConflict: 'tanggal' }
          )
          weatherSaved = true
        }
      }
    } catch (weatherErr) {
      console.warn('Gagal fetch Open-Meteo weather data:', weatherErr)
    }

    return NextResponse.json({
      data: {
        price: savedPrice,
        weather_cached: weatherSaved,
      },
      error: null,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json(
      { data: null, error: { message: msg, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
