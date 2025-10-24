import Link from 'next/link'

export const metadata = {
  title: 'プライバシーポリシー - Kaleido AI Music',
  description: 'Kaleido AI Musicプライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center">プライバシーポリシー</h1>
      <p className="text-center text-gray-600 mb-12">
        最終更新日: 2025年10月25日
      </p>

      <div className="space-y-8">
        {/* 1. はじめに */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">1. はじめに</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Kaleido Future（屋号、以下「当社」といいます）が運営するKaleido AI Music（以下「当サービス」といいます）は、
              ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めます。
              本プライバシーポリシー（以下「本ポリシー」といいます）は、当社がどのような情報を収集し、
              どのように利用・保護するかを説明するものです。
            </p>
          </div>
        </div>

        {/* 2. 収集する情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">2. 収集する情報</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2.1 利用データ</h3>
              <p>
                当サービスの利用に関する以下の情報を自動的に収集します：
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>音楽の再生回数</li>
                <li>ダウンロード回数</li>
                <li>検索キーワード</li>
                <li>ページビュー</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2.2 技術情報</h3>
              <p>
                当サービスの提供・改善のため、以下の技術情報を収集する場合があります：
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>IPアドレス（アクセス制限・スパム対策のため一時的に記録）</li>
                <li>ブラウザの種類とバージョン</li>
                <li>デバイス情報（PC、モバイルなど）</li>
                <li>アクセス日時</li>
                <li>リファラー情報</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. 情報の利用目的 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">3. 情報の利用目的</h2>
          <div className="space-y-4 text-gray-600">
            <p>収集した情報は、以下の目的で利用します：</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                <strong>サービスの提供</strong>: 音楽の視聴・ダウンロード、検索など、
                当サービスの基本機能の提供
              </li>
              <li>
                <strong>統計分析</strong>: 人気の音楽やジャンルの分析、トレンドの把握
              </li>
              <li>
                <strong>スパム対策</strong>: IPアドレスとレート制限を使用して、不正利用を防止
              </li>
              <li>
                <strong>サービス改善</strong>: 利用データを分析し、サービスの品質向上や新機能開発に活用
              </li>
              <li>
                <strong>法令遵守</strong>: 法律や規制に基づく開示要求への対応
              </li>
            </ul>
          </div>
        </div>

        {/* 4. 情報の共有 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">4. 情報の共有</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4.1 第三者への提供</h3>
              <p>
                当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>ユーザーの同意がある場合</li>
                <li>法律または規制に基づく開示要求がある場合</li>
                <li>サービス提供に必要な範囲で、信頼できる第三者サービス（ホスティング、分析ツールなど）と共有する場合</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4.2 サービスプロバイダー</h3>
              <p>
                当サービスは、以下のような第三者サービスを利用する場合があります：
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Vercel（ホスティング）</li>
                <li>Google Analytics（アクセス解析）</li>
              </ul>
              <p className="mt-2">
                これらのサービスプロバイダーは、各自のプライバシーポリシーに従って情報を処理します。
              </p>
            </div>
          </div>
        </div>

        {/* 5. データのセキュリティ */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">5. データのセキュリティ</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当サービスは、ユーザーの情報を保護するため、以下のセキュリティ対策を実施しています：
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                <strong>HTTPS通信</strong>: すべてのデータ通信は、SSL/TLSで暗号化されます
              </li>
              <li>
                <strong>アクセス制限</strong>: データへのアクセスは、必要最小限の権限に制限されています
              </li>
              <li>
                <strong>レート制限</strong>: APIエンドポイントにレート制限を設定し、不正アクセスを防止
              </li>
            </ul>
            <p className="mt-4">
              ただし、インターネット上でのデータ送信は100%安全ではありません。
              当サービスは合理的なセキュリティ対策を講じていますが、完全な安全性を保証することはできません。
            </p>
          </div>
        </div>

        {/* 6. Cookie・トラッキング */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">6. Cookie・トラッキング</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">6.1 Cookieの使用</h3>
              <p>
                当サービスは、以下の目的でCookieを使用します：
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>ユーザー体験の向上（設定の保存など）</li>
                <li>アクセス解析（利用状況の分析）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">6.2 アナリティクス</h3>
              <p>
                当サービスは、Google Analyticsなどのアナリティクスツールを使用して、サービスの利用状況を分析します。
                これらのツールは、匿名化されたデータを収集し、トレンド分析やサービス改善に活用します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">6.3 Cookieの無効化</h3>
              <p>
                ブラウザの設定でCookieを無効化することができますが、一部の機能が正常に動作しなくなる可能性があります。
              </p>
            </div>
          </div>
        </div>

        {/* 7. 子どものプライバシー */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">7. 子どものプライバシー</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当サービスは、13歳未満の子どもを対象としていません。
              13歳未満の子どもから意図的に個人情報を収集することはありません。
            </p>
            <p>
              13歳未満の子どもの個人情報が収集されていることが判明した場合は、速やかに削除します。
            </p>
          </div>
        </div>

        {/* 8. データ保持期間 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">8. データ保持期間</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当サービスは、サービス提供に必要な期間、ユーザーの情報を保持します。
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>
                <strong>IPアドレス</strong>: レート制限のため最大24時間
              </li>
              <li>
                <strong>アナリティクスデータ</strong>: 最大2年間（匿名化データ）
              </li>
            </ul>
            <p className="mt-4">
              法律で保持が義務付けられている場合は、上記の期間を超えて保持することがあります。
            </p>
          </div>
        </div>

        {/* 9. ポリシーの変更 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">9. ポリシーの変更</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当社は、必要に応じて本ポリシーを変更することがあります。
              重要な変更がある場合は、当サービス上で事前に通知し、ユーザーに確認の機会を提供します。
            </p>
            <p>
              変更後も当サービスを継続して利用する場合、変更後のポリシーに同意したものとみなされます。
            </p>
          </div>
        </div>

        {/* 10. 国際データ転送 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">10. 国際データ転送</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当サービスは、日本国内でホスティングされていますが、一部のサービスプロバイダー（Vercelなど）は、
              日本国外のサーバーを使用する場合があります。
            </p>
            <p>
              ユーザーの情報が日本国外に転送される場合、適切なセキュリティ対策を講じた上で転送します。
            </p>
          </div>
        </div>

        {/* 11. お問い合わせ */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">11. お問い合わせ</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              本ポリシーに関するご質問、その他プライバシーに関するお問い合わせは、メールにてご連絡ください：
            </p>
            <div className="text-center mt-4">
              <a
                href="mailto:kaleidoaimusic_support@kaleidofuture.com"
                className="text-purple-600 hover:text-purple-700 hover:underline font-mono"
              >
                kaleidoaimusic_support@kaleidofuture.com
              </a>
            </div>
            <p className="mt-4 text-center text-sm">
              お問い合わせへの対応には、最大14営業日かかる場合があります。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>以上</p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-purple-600 hover:text-purple-700 hover:underline"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}
