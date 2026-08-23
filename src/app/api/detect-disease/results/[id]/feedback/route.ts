import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resultId } = await params

    if (!resultId) {
      return NextResponse.json(
        { data: null, error: { message: 'ID hasil deteksi wajib disertakan', code: 'MISSING_ID' } },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { farmer_feedback, farmer_correction_note } = body

    if (!farmer_feedback || (farmer_feedback !== 'sesuai' && farmer_feedback !== 'tidak_sesuai')) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: 'Feedback harus bernilai "sesuai" atau "tidak_sesuai"',
            code: 'INVALID_FEEDBACK',
          },
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { data: null, error: { message: 'Harus login untuk mengirimkan feedback', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    // Verify ownership via cv_detections relation
    const { data: resultRecord, error: fetchError } = await supabase
      .from('cv_detection_results')
      .select('id, detection_id, detection:cv_detections!cv_detection_results_detection_id_fkey(user_id)')
      .eq('id', resultId)
      .single()

    if (fetchError || !resultRecord) {
      return NextResponse.json(
        { data: null, error: { message: 'Hasil deteksi tidak ditemukan', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const detectionOwnerId = (resultRecord.detection as { user_id?: string } | null)?.user_id
    if (detectionOwnerId && detectionOwnerId !== user.id) {
      return NextResponse.json(
        { data: null, error: { message: 'Hanya pengunggah foto yang dapat memberi feedback', code: 'FORBIDDEN' } },
        { status: 403 }
      )
    }

    // Update feedback
    const { error: updateError } = await supabase
      .from('cv_detection_results')
      .update({
        farmer_feedback,
        farmer_correction_note: farmer_correction_note || null,
        feedback_by: user.id,
        feedback_at: new Date().toISOString(),
      })
      .eq('id', resultId)

    if (updateError) {
      console.error('Error updating farmer feedback:', updateError)
      return NextResponse.json(
        { data: null, error: { message: updateError.message, code: 'UPDATE_FAILED' } },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: { success: true, result_id: resultId, farmer_feedback },
      error: null,
    })
  } catch (error: unknown) {
    console.error('CV feedback error:', error)
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan sistem'
    return NextResponse.json(
      { data: null, error: { message: msg, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
