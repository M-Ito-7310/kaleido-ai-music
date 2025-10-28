import nodemailer from 'nodemailer'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * 問い合わせメールを管理者に送信する
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<void> {
  // SMTP設定
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // 管理者へのメール内容
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'kaleido_ai_music_contact@kaleidofuture.com',
    to: process.env.ADMIN_EMAIL || 'kaleido_ai_music_contact@kaleidofuture.com',
    replyTo: data.email, // 送信者のメールアドレスに返信できるようにする
    subject: `[Kaleido AI Music] ${data.subject}`,
    text: `
お問い合わせがありました。

名前: ${data.name}
メールアドレス: ${data.email}
件名: ${data.subject}

メッセージ:
${data.message}
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #667eea; }
    .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #667eea; }
    .message-box { white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>新しいお問い合わせ</h2>
      <p>Kaleido AI Music からお問い合わせがありました。</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">お名前</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">メールアドレス</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">件名</div>
        <div class="value">${data.subject}</div>
      </div>
      <div class="field">
        <div class="label">メッセージ</div>
        <div class="value message-box">${data.message}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  }

  // メール送信
  await transporter.sendMail(mailOptions)
}
