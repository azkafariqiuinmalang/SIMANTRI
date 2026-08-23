import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const CV_CLASS_REFERENCE: Record<
  string,
  { category: 'disease' | 'anatomy' | 'healthy'; displayName: string | null }
> = {
  Antranoksa: { category: 'disease', displayName: 'Antraknosa' },
  Antraknosa: { category: 'disease', displayName: 'Antraknosa' },
  'Daun-Bawang': { category: 'anatomy', displayName: null },
  Moler: { category: 'disease', displayName: 'Moler' },
  Moleh: { category: 'disease', displayName: 'Moler' },
  'Pucuk-Daun': { category: 'anatomy', displayName: null },
  Sehat: { category: 'healthy', displayName: 'Sehat' },
  Trotol: { category: 'disease', displayName: 'Trotol' },
}

interface RawDetectionItem {
  predicted_class: string
  display_name: string | null
  category: 'disease' | 'anatomy' | 'healthy' | 'unknown'
  confidence: number
  bbox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { data: null, error: { message: 'Harus login untuk menggunakan deteksi penyakit', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { data: null, error: { message: 'File foto tanaman wajib diunggah', code: 'MISSING_FILE' } },
        { status: 400 }
      )
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { data: null, error: { message: 'Ukuran foto maksimal 10MB', code: 'FILE_TOO_LARGE' } },
        { status: 400 }
      )
    }

    // 1. Upload foto ke Supabase Storage (bucket: plant-photos)
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const fileBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('plant-photos')
      .upload(fileName, fileBuffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      })

    let imageUrl = ''
    if (uploadError) {
      console.warn('Storage upload note:', uploadError.message)
      // Fallback preview URL if bucket permission requires direct public
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/plant-photos/${fileName}`
    } else {
      const { data: publicUrlData } = supabase.storage
        .from('plant-photos')
        .getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    }

    // 2. Insert ke tabel cv_detections (sesi upload)
    const { data: detectionRecord, error: detectionError } = await supabase
      .from('cv_detections')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        model_version: 'yolov8-simantri-v1',
      })
      .select('id')
      .single()

    if (detectionError || !detectionRecord) {
      console.error('Error inserting cv_detections:', detectionError)
      return NextResponse.json(
        { data: null, error: { message: 'Gagal mencatat sesi deteksi di database', code: 'DB_ERROR' } },
        { status: 500 }
      )
    }

    const detectionId = detectionRecord.id

    // 3. Kirim gambar ke FastAPI YOLOv8
    const cvApiUrl = process.env.CV_MODEL_API_URL || 'http://localhost:8001'
    let fastApiResponse: {
      detections: RawDetectionItem[]
      total_objects: number
      has_disease: boolean
      all_healthy: boolean
    } | null = null

    try {
      const mlFormData = new FormData()
      mlFormData.append('file', new Blob([fileBuffer], { type: file.type || 'image/jpeg' }), file.name)

      const res = await fetch(`${cvApiUrl}/detect`, {
        method: 'POST',
        body: mlFormData,
      })

      if (!res.ok) {
        throw new Error(`FastAPI return status ${res.status}`)
      }

      fastApiResponse = await res.json()
    } catch (mlErr: unknown) {
      console.error('FastAPI YOLOv8 error:', mlErr)
      const errorMsg =
        mlErr instanceof Error
          ? mlErr.message
          : 'Layanan model deteksi AI (YOLOv8) tidak dapat dihubungi'

      return NextResponse.json(
        {
          data: null,
          error: {
            message: `Layanan deteksi Computer Vision lokal (${cvApiUrl}) belum aktif atau gagal merespons. Pastikan server FastAPI telah dijalankan di port 8001. (${errorMsg})`,
            code: 'CV_SERVICE_UNAVAILABLE',
          },
        },
        { status: 503 }
      )
    }

    const rawDetections = fastApiResponse?.detections || []

    // 4. Simpan SETIAP objek ke cv_detection_results
    const resultsToInsert = rawDetections.map((item) => {
      const ref = CV_CLASS_REFERENCE[item.predicted_class] || {
        category: 'unknown',
        displayName: item.predicted_class,
      }

      return {
        detection_id: detectionId,
        predicted_class: item.predicted_class,
        confidence: item.confidence,
        bbox_x: item.bbox?.x ?? null,
        bbox_y: item.bbox?.y ?? null,
        bbox_width: item.bbox?.width ?? null,
        bbox_height: item.bbox?.height ?? null,
        status: 'unreviewed',
        display_name: ref.displayName,
        category: ref.category,
      }
    })

    const savedResults: {
      result_id: string
      predicted_class: string
      display_name: string | null
      category: string
      confidence: number
      bbox?: { x: number; y: number; width: number; height: number }
    }[] = []

    if (resultsToInsert.length > 0) {
      const dbPayload = resultsToInsert.map((r) => ({
        detection_id: r.detection_id,
        predicted_class: r.predicted_class,
        confidence: r.confidence,
        bbox_x: r.bbox_x,
        bbox_y: r.bbox_y,
        bbox_width: r.bbox_width,
        bbox_height: r.bbox_height,
        status: 'unreviewed',
      }))

      const { data: insertedData, error: resultsInsertError } = await supabase
        .from('cv_detection_results')
        .insert(dbPayload)
        .select('id, predicted_class, confidence, bbox_x, bbox_y, bbox_width, bbox_height')

      if (resultsInsertError) {
        console.error('Error inserting cv_detection_results:', resultsInsertError)
      } else if (insertedData) {
        insertedData.forEach((row, idx) => {
          const rawItem = resultsToInsert[idx]
          savedResults.push({
            result_id: row.id,
            predicted_class: row.predicted_class,
            display_name: rawItem.display_name,
            category: rawItem.category,
            confidence: Number(row.confidence),
            bbox: {
              x: Number(row.bbox_x || 0),
              y: Number(row.bbox_y || 0),
              width: Number(row.bbox_width || 0),
              height: Number(row.bbox_height || 0),
            },
          })
        })
      }
    }

    // 5. Filter results_for_display (hanya disease dan healthy, hapus anatomy)
    const resultsForDisplay = savedResults.filter(
      (r) => r.category === 'disease' || r.category === 'healthy'
    )

    const hasDisease = resultsForDisplay.some((r) => r.category === 'disease')
    const allHealthy =
      resultsForDisplay.length > 0 &&
      resultsForDisplay.every((r) => r.category === 'healthy')

    return NextResponse.json({
      data: {
        detection_id: detectionId,
        image_url: imageUrl,
        results: savedResults,
        results_for_display: resultsForDisplay,
        disclaimer:
          'Ini adalah dugaan awal sistem. Disarankan konfirmasi langsung ke penyuluh pertanian setempat sebelum mengambil tindakan.',
        has_disease: hasDisease,
        all_healthy: allHealthy,
        total_detected_objects: savedResults.length,
      },
      error: null,
    })
  } catch (error: unknown) {
    console.error('API /api/detect-disease error:', error)
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan internal server'
    return NextResponse.json(
      { data: null, error: { message: msg, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
