import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactNotification } from '@/lib/email'

// 問い合わせフォームのバリデーションスキーマ
const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .max(30, 'お名前は30文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  subject: z
    .string()
    .min(1, '件名を入力してください')
    .max(100, '件名は100文字以内で入力してください'),
  message: z
    .string()
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = contactSchema.parse(body)

    // メール送信
    await sendContactNotification(validatedData)

    return NextResponse.json({
      success: true,
      message:
        'お問い合わせを送信しました。ご連絡いただきありがとうございます。',
    })
  } catch (error) {
    console.error('Contact form error:', error)

    // Zodバリデーションエラー
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
        },
        { status: 400 }
      )
    }

    // その他のエラー
    return NextResponse.json(
      {
        success: false,
        message:
          'お問い合わせの送信に失敗しました。時間をおいて再度お試しください。',
      },
      { status: 500 }
    )
  }
}
