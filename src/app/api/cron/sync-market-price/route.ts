import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET || 'simantri_secret_cron_key'
    const authHeader = req.headers.get('authorization')
    
    // Call internal sync-pihps handler
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const syncRes = await fetch(`${baseUrl}/api/market/sync-pihps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`
      },
      body: JSON.stringify({ mode: 'today' })
    })

    const syncJson = await syncRes.json()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: syncRes.ok ? 'success' : 'failed',
      details: syncJson
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Cron execution failed'
    return NextResponse.json({ status: 'error', message: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}
