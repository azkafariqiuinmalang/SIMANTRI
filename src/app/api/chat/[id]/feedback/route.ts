import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { data: null, error: { message: 'ID chat log diperlukan', code: 'MISSING_ID' } },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { feedback, feedback_note } = body

    if (!feedback || (feedback !== 'helpful' && feedback !== 'not_helpful')) {
      return NextResponse.json(
        {
          data: null,
          error: {
            message: 'Feedback harus bernilai "helpful" atau "not_helpful"',
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
        { data: null, error: { message: 'Harus login untuk memberikan feedback', code: 'UNAUTHORIZED' } },
        { status: 401 }
      )
    }

    // Update feedback on user's own chat_log
    const { error: updateError } = await supabase
      .from('chat_logs')
      .update({
        feedback,
        feedback_note: feedback_note || null,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating feedback:', updateError)
      return NextResponse.json(
        { data: null, error: { message: updateError.message, code: 'UPDATE_FAILED' } },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: { success: true, feedback },
      error: null,
    })
  } catch (error: unknown) {
    console.error('Feedback PATCH error:', error)
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan sistem'
    return NextResponse.json(
      { data: null, error: { message: msg, code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
