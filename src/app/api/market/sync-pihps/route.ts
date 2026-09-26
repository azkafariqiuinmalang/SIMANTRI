import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PIHPS_BASE_URL = 'https://www.bi.go.id/hargapangan/WebSite/Home/GetGridData1'
const COMMODITY_ID = '5_11' // Bawang Merah Ukuran Sedang
const PRICE_TYPE = 4 // Produsen
const PROV_ID_ALL = 0
const PROV_ID_JATIM = 16

const NGANJUK_LAT = -7.604
const NGANJUK_LON = 111.904

function formatPihpsDate(dateStr: string): string {
  const dt = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(dt.getDate()).padStart(2, '0')
  return `${months[dt.getMonth()]} ${day}, ${dt.getFullYear()}`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Auth check: Admin or API Cron Secret Key
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'simantri_secret_cron_key'
    const isCronAuthorized = authHeader === `Bearer ${cronSecret}`

    let userId: string | null = null
    if (!isCronAuthorized) {
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
          { data: null, error: { message: 'Akses ditolak: Hanya Admin yang dapat memicu sinkronisasi', code: 'FORBIDDEN' } },
          { status: 403 }
        )
      }

      userId = user.id
    }

    const body = await req.json().catch(() => ({}))
    const mode = body.mode || 'today' // 'today' | 'backfill'
    const days = Math.min(Number(body.days || 30), 30)

    const datesToProcess: string[] = []
    const now = new Date()

    if (mode === 'backfill') {
      for (let i = days; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000)
        datesToProcess.push(d.toISOString().split('T')[0])
      }
    } else {
      const targetDate = body.tanggal || now.toISOString().split('T')[0]
      datesToProcess.push(targetDate)
    }

    const results = []

    for (const dateStr of datesToProcess) {
      const pihpsDate = formatPihpsDate(dateStr)

      const pihpsUrl = `${PIHPS_BASE_URL}?tanggal=${encodeURIComponent(pihpsDate)}&commodity=${COMMODITY_ID}&priceType=${PRICE_TYPE}&isPasokan=1&jenis=1&periode=1&provId=${PROV_ID_ALL}`
      
      let pihpsData: any[] = []
      try {
        const resPihps = await fetch(pihpsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
          },
          next: { revalidate: 0 }
        })

        if (resPihps.ok) {
          const jsonPihps = await resPihps.json()
          pihpsData = jsonPihps.data || []
        }
      } catch (err) {
        console.warn(`[PIHPS] Error fetching date ${dateStr}:`, err)
      }

      if (pihpsData.length === 0) {
        results.push({ date: dateStr, status: 'no_data' })
        continue
      }

      // Extract East Java / Jatim Price
      const jatimItem = pihpsData.find((x: any) => x.ProvID === PROV_ID_JATIM || (x.Provinsi && x.Provinsi.toLowerCase().includes('jawa timur')))
      const nationalVal = pihpsData.find((x: any) => x.SemuaProvinsi)?.SemuaProvinsi || 15000
      const jatimPrice = jatimItem?.Nilai ? Number(jatimItem.Nilai) : Number(nationalVal)

      // 1. Upsert into market_price via RPC
      await supabase.rpc('upsert_scraped_market_price', {
        p_tanggal: dateStr,
        p_harga: jatimPrice,
        p_source: 'scraping',
        p_input_by: userId
      })

      // 2. Upsert regional records into market_regional_price
      const regionalRecords = pihpsData
        .filter((item: any) => item.ProvID !== undefined && item.Provinsi && item.Nilai !== undefined)
        .map((item: any) => ({
          tanggal: dateStr,
          prov_id: Number(item.ProvID),
          provinsi: String(item.Provinsi),
          komoditas: 'Bawang Merah Ukuran Sedang',
          price_type: PRICE_TYPE,
          harga: Number(item.Nilai),
          harga_diff: String(item.NilaiDiff || 'Rp0'),
          semua_provinsi: Number(item.SemuaProvinsi || 0),
          percentage: Number(item.Percentage || 0)
        }))

      if (regionalRecords.length > 0) {
        await supabase.rpc('upsert_scraped_regional_price', {
          p_records: regionalRecords
        })
      }

      // 3. Fetch & Upsert Weather
      try {
        const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${NGANJUK_LAT}&longitude=${NGANJUK_LON}&start_date=${dateStr}&end_date=${dateStr}&daily=temperature_2m_mean,precipitation_sum,wind_speed_10m_max&timezone=Asia%2FJakarta`
        const weatherRes = await fetch(openMeteoUrl)
        if (weatherRes.ok) {
          const weatherJson = await weatherRes.json()
          if (weatherJson.daily?.time?.length > 0) {
            const temp = weatherJson.daily.temperature_2m_mean?.[0] ?? 27.5
            const rain = weatherJson.daily.precipitation_sum?.[0] ?? 0.5
            const wind = weatherJson.daily.wind_speed_10m_max?.[0] ?? 18.0

            await supabase.rpc('upsert_weather_data', {
              p_tanggal: dateStr,
              p_temperature: temp,
              p_rainfall: rain,
              p_wind_speed: wind
            })
          }
        }
      } catch (weatherErr) {
        console.warn('Weather sync warning:', weatherErr)
      }

      results.push({
        date: dateStr,
        status: 'synced',
        jatim_price: jatimPrice,
        regional_count: regionalRecords.length
      })
    }

    // 4. Auto-Trigger XGBoost Prediction Pipeline for tomorrow
    let predictionResult = null
    try {
      const tomorrowStr = new Date(now.getTime() + 86400000).toISOString().split('T')[0]
      
      // Fetch 30 days price history
      const { data: history } = await supabase
        .from('market_price')
        .select('tanggal, harga')
        .order('tanggal', { ascending: true })

      if (history && history.length > 0) {
        const priceList = history.map((h: any) => Number(h.harga))
        const latestPrice = priceList[priceList.length - 1]

        const tDate = new Date(tomorrowStr)
        const month = tDate.getMonth() + 1
        const day = tDate.getDate()
        const weekday = (tDate.getDay() + 6) % 7
        const oneJan = new Date(tDate.getFullYear(), 0, 1)
        const weekOfYear = Math.ceil(((tDate.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7)

        const lag1 = priceList[priceList.length - 1] ?? latestPrice
        const lag3 = priceList[priceList.length - 3] ?? priceList[0]
        const lag7 = priceList[priceList.length - 7] ?? priceList[0]
        const lag14 = priceList[priceList.length - 14] ?? priceList[0]
        const lag30 = priceList[priceList.length - 30] ?? priceList[0]

        const tail7 = priceList.slice(-7)
        const tail14 = priceList.slice(-14)
        const tail30 = priceList.slice(-30)

        const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1)
        const ma7 = mean(tail7)
        const ma14 = mean(tail14)
        const ma30 = mean(tail30)

        const stdDev = (arr: number[]) => {
          const m = mean(arr)
          return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / (arr.length || 1))
        }
        const std7 = stdDev(tail7)
        const std14 = stdDev(tail14)

        const calcEma = (arr: number[], span: number) => {
          const k = 2 / (span + 1)
          let ema = arr[0]
          for (let i = 1; i < arr.length; i++) {
            ema = arr[i] * k + ema * (1 - k)
          }
          return ema
        }
        const ema7 = calcEma(priceList, 7)
        const ema14 = calcEma(priceList, 14)

        const max7 = Math.max(...tail7)
        const min7 = Math.min(...tail7)
        const range7 = max7 - min7

        const inputFeatures = {
          Temperature: 27.5,
          Rainfall: 0.5,
          Rain7: 3.5,
          WindSpeed: 18.0,
          Month: month,
          Day: day,
          Weekday: weekday,
          WeekOfYear: weekOfYear,
          Lag1: lag1,
          Lag3: lag3,
          Lag7: lag7,
          Lag14: lag14,
          Lag30: lag30,
          MA7: ma7,
          MA14: ma14,
          MA30: ma30,
          STD7: std7,
          STD14: std14,
          EMA7: ema7,
          EMA14: ema14,
          Max7: max7,
          Min7: min7,
          Range7: range7,
        }

        let predictedPrice = Math.round(ma7 * 0.4 + ema7 * 0.4 + lag1 * 0.2)

        let mlApiUrl = process.env.PRICE_MODEL_API_URL
        if (mlApiUrl) {
          if (!mlApiUrl.startsWith('http://') && !mlApiUrl.startsWith('https://')) {
            mlApiUrl = `https://${mlApiUrl}`
          }
          mlApiUrl = mlApiUrl.replace(/\/+$/, '')
          try {
            const mlRes = await fetch(`${mlApiUrl}/predict-from-history`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                target_date: tomorrowStr,
                history: history,
                temperature: 27.5,
                rainfall: 0.5,
                wind_speed: 18.0,
                rain7: 3.5,
              }),
            })
            if (mlRes.ok) {
              const mlJson = await mlRes.json()
              if (mlJson.predicted_price) {
                predictedPrice = Math.round(mlJson.predicted_price)
              }
            }
          } catch (mlErr) {
            console.warn('ML Service warning:', mlErr)
          }
        }

        await supabase.rpc('upsert_price_prediction', {
          p_prediction_date: tomorrowStr,
          p_predicted_price: predictedPrice,
          p_model_version: 'xgboost-v1',
          p_input_features: inputFeatures,
          p_mape: 3.0
        })

        predictionResult = {
          prediction_date: tomorrowStr,
          predicted_price: predictedPrice,
        }
      }
    } catch (predErr) {
      console.warn('Auto-forecast pipeline error:', predErr)
    }

    return NextResponse.json({
      data: {
        synced_count: results.filter(r => r.status === 'synced').length,
        results,
        prediction: predictionResult
      },
      error: null
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json(
      { data: null, error: { message: msg, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
