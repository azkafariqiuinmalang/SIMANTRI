import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { data: null, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const targetDate =
      body.target_date ||
      new Date(Date.now() + 86400000).toISOString().split('T')[0] // default besok

    // 1. Ambil data historis 30 hari terakhir dari market_price
    const { data: prices, error: priceError } = await supabase
      .from('market_price')
      .select('tanggal, harga')
      .order('tanggal', { ascending: true })

    if (priceError || !prices || prices.length === 0) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message:
              'Data harga pasar belum tersedia. Admin perlu menginput harga terlebih dahulu.',
            code: 'NO_DATA',
          },
        },
        { status: 400 }
      )
    }

    // 2. Ambil data cuaca terbaru dari weather_data
    const { data: weather } = await supabase
      .from('weather_data')
      .select('temperature, rainfall, wind_speed')
      .order('tanggal', { ascending: false })
      .limit(1)
      .single()

    const priceList = prices.map((p) => Number(p.harga))
    const latestPrice = priceList[priceList.length - 1]

    // Feature engineering calculation (mengikuti FEATURE_ENGINEERING_SPEC.md)
    const tDate = new Date(targetDate)
    const month = tDate.getMonth() + 1
    const day = tDate.getDate()
    const weekday = (tDate.getDay() + 6) % 7 // 0=Monday
    const oneJan = new Date(tDate.getFullYear(), 0, 1)
    const weekOfYear = Math.ceil(
      ((tDate.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7
    )

    const lag1 = priceList[priceList.length - 1] ?? latestPrice
    const lag3 = priceList[priceList.length - 3] ?? priceList[0]
    const lag7 = priceList[priceList.length - 7] ?? priceList[0]
    const lag14 = priceList[priceList.length - 14] ?? priceList[0]
    const lag30 = priceList[priceList.length - 30] ?? priceList[0]

    const tail7 = priceList.slice(-7)
    const tail14 = priceList.slice(-14)
    const tail30 = priceList.slice(-30)

    const mean = (arr: number[]) =>
      arr.reduce((a, b) => a + b, 0) / (arr.length || 1)
    const ma7 = mean(tail7)
    const ma14 = mean(tail14)
    const ma30 = mean(tail30)

    const stdDev = (arr: number[]) => {
      const m = mean(arr)
      const variance =
        arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / (arr.length || 1)
      return Math.sqrt(variance)
    }
    const std7 = stdDev(tail7)
    const std14 = stdDev(tail14)

    // EMA calculation
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

    const temp = Number(weather?.temperature ?? 27.5)
    const rain = Number(weather?.rainfall ?? 0.5)
    const wind = Number(weather?.wind_speed ?? 18.0)
    const rain7 = rain * 7 // estimasi akumulasi

    const inputFeatures = {
      Temperature: temp,
      Rainfall: rain,
      Rain7: rain7,
      WindSpeed: wind,
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

    let predictedPrice = Math.round(ma7 * 0.4 + ema7 * 0.4 + lag1 * 0.2) // baseline estimate

    // 3. Panggil ML service FastAPI jika URL terkonfigurasi
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
            target_date: targetDate,
            history: prices,
            temperature: temp,
            rainfall: rain,
            wind_speed: wind,
            rain7,
          }),
        })
        if (mlRes.ok) {
          const mlJson = await mlRes.json()
          if (mlJson.predicted_price) {
            predictedPrice = Math.round(mlJson.predicted_price)
          }
        }
      } catch (mlErr) {
        console.warn('Gagal panggil FastAPI ML service:', mlErr)
      }
    }

    // 4. Simpan hasil prediksi ke price_predictions
    await supabase.from('price_predictions').insert({
      prediction_date: targetDate,
      predicted_price: predictedPrice,
      model_version: 'xgboost-v1',
      mape_at_training: 3.0,
      input_features: inputFeatures,
    })

    return NextResponse.json({
      data: {
        prediction_date: targetDate,
        predicted_price: predictedPrice,
        latest_market_price: latestPrice,
        mape_at_training: 3.0,
        model_version: 'xgboost-v1',
        input_features: inputFeatures,
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
