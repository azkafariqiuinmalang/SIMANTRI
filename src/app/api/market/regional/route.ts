import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date') // optional YYYY-MM-DD

    let query = supabase
      .from('market_regional_price')
      .select('id, tanggal, prov_id, provinsi, komoditas, price_type, harga, harga_diff, semua_provinsi, percentage, created_at')
      .order('harga', { ascending: false })

    if (dateParam) {
      query = query.eq('tanggal', dateParam)
    } else {
      // Get the latest date available
      const { data: latestRow } = await supabase
        .from('market_regional_price')
        .select('tanggal')
        .order('tanggal', { ascending: false })
        .limit(1)
        .single()

      if (latestRow?.tanggal) {
        query = query.eq('tanggal', latestRow.tanggal)
      }
    }

    const { data: regionalPrices, error } = await query

    if (error) {
      return NextResponse.json(
        { data: null, error: { message: error.message, code: error.code } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: regionalPrices || [],
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
