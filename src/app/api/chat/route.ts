import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  validateUserInput,
  detectPromptInjection,
  buildSecureSystemPrompt,
  encapsulateUserPrompt,
  sanitizeAiOutput,
} from '@/lib/security/ai-guardrails'

interface KnowledgeEntryMatch {
  doc_id: string
  title: string
  summary: string | null
  content: string
  keywords: string[] | null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    // -------------------------------------------------------------------------
    // LAYER 1: INPUT VALIDATION & NORMALIZATION
    // -------------------------------------------------------------------------
    const validation = validateUserInput(body?.message)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: validation.error?.message || 'Pesan tidak valid',
            code: validation.error?.code || 'INVALID_INPUT',
          },
        },
        { status: 400 }
      )
    }

    const userMessage = validation.sanitizedMessage

    // -------------------------------------------------------------------------
    // LAYER 2: PROMPT INJECTION & INTENT RISK DETECTION
    // -------------------------------------------------------------------------
    const injectionAnalysis = detectPromptInjection(userMessage)
    if (injectionAnalysis.isBlocked) {
      const refusal = injectionAnalysis.refusalMessage || 'Permintaan ditolak oleh filter keamanan.'
      
      // Log blocked injection attempts for audit trail
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from('chat_logs').insert({
          user_id: user?.id ?? null,
          message: userMessage,
          response: `[BLOCKED_BY_GUARDRAIL] ${refusal}`,
        })
      } catch (logErr) {
        console.warn('Logging blocked injection failed:', logErr)
      }

      return NextResponse.json({
        data: {
          id: null,
          response: refusal,
          sumber: [],
          dari_kb: false,
          security: {
            status: 'blocked',
            risk_level: injectionAnalysis.riskLevel,
            reason: 'prompt_injection_detected',
          },
        },
        reply: refusal,
        response: refusal,
        sumber: [],
        dari_kb: false,
        chat_id: null,
        error: null,
      })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // -------------------------------------------------------------------------
    // Retrieval (Ambil konteks dari knowledge_entries)
    // -------------------------------------------------------------------------
    const STOPWORDS = new Set([
      'dan', 'di', 'ke', 'dari', 'yang', 'ini', 'itu', 'pada', 'untuk', 'dengan',
      'adalah', 'sebagai', 'cara', 'membuat', 'resep', 'rumah', 'bagaimana', 'apa',
      'apakah', 'kapan', 'dimana', 'siapa', 'mengapa', 'kenapa', 'bisa', 'harus',
      'saya', 'kamu', 'anda', 'kita', 'mereka', 'tolong', 'jelaskan', 'tentang',
      'halo', 'selamat', 'pagi', 'siang', 'sore', 'malam', 'ya', 'tidak', 'dong',
      'awal', 'akhir', 'buka', 'usaha', 'modal', 'kiloan', 'berapa', 'mana', 'lebih',
      'sangat', 'baik', 'punya', 'ada', 'lagi', 'saja', 'juga', 'akan', 'sudah',
      'oleh', 'atas', 'bawah', 'saat', 'dalam', 'luar', 'lain', 'kami', 'kita'
    ])

    const meaningfulWords = userMessage
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w: string) => w.length >= 3 && !STOPWORDS.has(w))

    let retrievedDocs: KnowledgeEntryMatch[] = []

    // Pendekatan 1: Full-Text Search di kolom content / summary
    try {
      const { data: ftsData } = await supabase
        .from('knowledge_entries')
        .select('doc_id, title, summary, content, keywords')
        .eq('status', 'published')
        .textSearch('content', userMessage, { type: 'websearch' })
        .limit(3)

      if (ftsData && ftsData.length > 0) {
        retrievedDocs.push(...(ftsData as KnowledgeEntryMatch[]))
      }
    } catch {
      // Fallback silently
    }

    // Pendekatan 2: Keyword matching / overlaps di kolom keywords
    if (retrievedDocs.length < 3 && meaningfulWords.length > 0) {
      try {
        const { data: kwData } = await supabase
          .from('knowledge_entries')
          .select('doc_id, title, summary, content, keywords')
          .eq('status', 'published')
          .overlaps('keywords', meaningfulWords)
          .limit(3)

        if (kwData && kwData.length > 0) {
          retrievedDocs.push(...(kwData as KnowledgeEntryMatch[]))
        }
      } catch {
        // Fallback silently
      }
    }

    // Pendekatan 3: Exact title/topic matching jika keyword khusus (bawang, varietas, pupuk, hama, moler, tanah, dll)
    if (retrievedDocs.length === 0 && meaningfulWords.length > 0) {
      for (const w of meaningfulWords.slice(0, 3)) {
        const { data: ilikeData } = await supabase
          .from('knowledge_entries')
          .select('doc_id, title, summary, content, keywords')
          .eq('status', 'published')
          .or(`title.ilike.%${w}%,topic.ilike.%${w}%`)
          .limit(2)

        if (ilikeData && ilikeData.length > 0) {
          retrievedDocs.push(...(ilikeData as KnowledgeEntryMatch[]))
        }
      }
    }

    // Deduplikasi berdasarkan doc_id, ambil maksimal 3 entri terbaik
    const uniqueDocsMap = new Map<string, KnowledgeEntryMatch>()
    for (const doc of retrievedDocs) {
      if (!uniqueDocsMap.has(doc.doc_id)) {
        uniqueDocsMap.set(doc.doc_id, doc)
      }
      if (uniqueDocsMap.size >= 3) break
    }
    const finalDocs = Array.from(uniqueDocsMap.values())

    const dariKb = finalDocs.length > 0
    const sumber = finalDocs.map((d) => ({
      doc_id: d.doc_id,
      title: d.title,
    }))

    // -------------------------------------------------------------------------
    // LAYER 3 & 4: PROMPT ISOLATION & SYSTEM PROMPT PROTECTION
    // -------------------------------------------------------------------------
    const contextString = dariKb
      ? finalDocs
          .map(
            (d) =>
              `--- DOKUMEN: [${d.doc_id}] ${d.title} ---\nRINGKASAN: ${d.summary || '-'}\nISI PENGETAHUAN:\n${d.content.slice(0, 3500)}`
          )
          .join('\n\n')
      : 'Tidak ada dokumen spesifik yang ditemukan di Knowledge Base untuk kueri ini.'

    const weatherString =
      'Kabupaten Nganjuk, Jawa Timur. Iklim tropis monsun dengan suhu rata-rata 25-32°C, kelembaban udara 65-85%, sentra utama budidaya bawang merah dataran rendah (6-80 mdpl).'

    const systemPrompt = buildSecureSystemPrompt(
      contextString,
      weatherString,
      injectionAnalysis.riskLevel
    )

    const isolatedUserPrompt = encapsulateUserPrompt(userMessage)

    // -------------------------------------------------------------------------
    // Generation (Panggil Gemini API Server-Side)
    // -------------------------------------------------------------------------
    let rawAiResponse = ''
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      if (dariKb) {
        rawAiResponse = `Berdasarkan data resmi Knowledge Base SIMANTRI (${sumber.map((s) => s.title).join(', ')}):\n\n${
          finalDocs[0]?.summary || finalDocs[0]?.content.slice(0, 400)
        }\n\nSaran:\n- Silakan pastikan kondisi lahan dan drainase memadai.\n- Konsultasikan dengan penyuluh pertanian setempat.`
      } else {
        rawAiResponse = `Halo! Pertanyaan Anda terkait "${userMessage}" saat ini belum tercakup spesifik dalam basis data lokal SIMANTRI. Namun secara umum untuk budidaya bawang merah, disarankan memperhatikan kelembaban tanah, drainase, dan rotasi tanaman.\n\nSaran:\n- Periksa kondisi riil di lahan sawah.\n- Hubungi PPL / Penyuluh pertanian terdekat.`
      }
    } else {
      const CANDIDATE_MODELS = [
        'gemini-3.5-flash',
        'gemini-3.7-flash',
        'gemini-3.1-pro-preview',
        'gemini-flash-latest',
        'gemini-2.5-pro',
      ]

      const genAI = new GoogleGenerativeAI(apiKey)
      let generated = false

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: isolatedUserPrompt }] }],
            systemInstruction: systemPrompt,
          })
          const text = result.response.text()
          if (text && text.trim().length > 0) {
            rawAiResponse = text.trim()
            generated = true
            break
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} failed, trying next candidate:`, modelErr)
        }
      }

      if (!generated) {
        if (dariKb) {
          rawAiResponse = `Berdasarkan data resmi Knowledge Base SIMANTRI (${sumber.map((s) => s.title).join(', ')}):\n\n${
            finalDocs[0]?.summary || finalDocs[0]?.content.slice(0, 500)
          }\n\nSaran:\n- Sesuaikan pola tanam dengan curah hujan setempat.\n- Konsultasikan dengan penyuluh BPP Nganjuk terdekat.`
        } else {
          rawAiResponse = `Halo! Mengenai "${userMessage}", secara umum dalam budidaya bawang merah Nganjuk, pastikan drainase bedengan dibuat optimal dan perhatikan kondisi cuaca sebelum pemupukan.\n\nSaran:\n- Cek kondisi kelembaban tanah lahan.\n- Hubungi Penyuluh Pertanian Lapangan (PPL) setempat.`
        }
      }
    }

    // -------------------------------------------------------------------------
    // LAYER 5: OUTPUT SECURITY & SENSITIVE INFORMATION REDACTION
    // -------------------------------------------------------------------------
    const outputSecurity = sanitizeAiOutput(rawAiResponse)
    const finalAiResponse = outputSecurity.sanitizedOutput

    // -------------------------------------------------------------------------
    // Logging (Simpan ke chat_logs)
    // -------------------------------------------------------------------------
    let logId: string | null = null
    try {
      const { data: logData, error: logError } = await supabase
        .from('chat_logs')
        .insert({
          user_id: user?.id ?? null,
          message: userMessage,
          response: finalAiResponse,
        })
        .select('id')
        .single()

      if (!logError && logData) {
        logId = logData.id
      }
    } catch (logErr) {
      console.warn('Logging to chat_logs skipped or failed:', logErr)
    }

    return NextResponse.json({
      data: {
        id: logId,
        response: finalAiResponse,
        sumber: sumber,
        dari_kb: dariKb,
        security: {
          status: 'cleared',
          risk_level: injectionAnalysis.riskLevel,
          redacted: outputSecurity.redactedCount > 0,
        },
      },
      reply: finalAiResponse,
      response: finalAiResponse,
      sumber: sumber,
      dari_kb: dariKb,
      chat_id: logId,
      error: null,
    })
  } catch (error: unknown) {
    console.error('API /api/chat error:', error)
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan internal server'
    return NextResponse.json(
      { data: null, error: { message: msg, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
