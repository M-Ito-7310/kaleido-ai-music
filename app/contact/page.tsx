import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Mail, MessageSquare, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'お問い合わせ | Kaleido AI Music',
  description:
    'Kaleido AI Musicへのお問い合わせフォームです。ご質問、ご要望などお気軽にお問い合わせください。',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            お問い合わせ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kaleido AI
            Musicに関するご質問、ご要望、不具合報告などがございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {/* お問い合わせ内容の例 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-purple-600" />
            こんな時にご利用ください
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>サービスに関するご質問</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>新機能のご要望</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>不具合・エラーの報告</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>その他のご意見・ご感想</span>
            </li>
          </ul>
        </div>

        {/* お問い合わせフォーム */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center mb-6">
            <MessageSquare className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">
              お問い合わせフォーム
            </h2>
          </div>
          <ContactForm />
        </div>

        {/* 注意事項 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            ご注意ください
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • お問い合わせ内容によっては、回答にお時間をいただく場合がございます
            </li>
            <li>
              •
              ご入力いただいたメールアドレス宛に返信させていただきますので、正確にご入力ください
            </li>
            <li>
              •
              送信いただいた情報は、お問い合わせ対応以外の目的では使用いたしません
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
