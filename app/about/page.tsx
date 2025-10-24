import Link from 'next/link'

export const metadata = {
  title: 'About - Kaleido AI Music',
  description: 'Kaleido AI Musicについて',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        About Kaleido AI Music
      </h1>
      <p className="text-center text-gray-600 mb-12">
        AI生成音楽を、もっと身近に。
      </p>

      <div className="space-y-8">
        {/* サービス概要 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">サービス概要</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Kaleido AI Musicは、AI生成音楽を展示・ダウンロードできる音楽ライブラリプラットフォームです。
              誰でも無料でAI生成された高品質な音楽を聴いたり、ダウンロードすることができます。
            </p>
            <p>
              私たちは、AI技術によって生成された音楽を通じて、
              クリエイターやリスナーに新しい音楽体験を提供することを目指しています。
            </p>
          </div>
        </div>

        {/* ミッション */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">ミッション</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              AI生成音楽の可能性を広げ、誰もが自由に音楽を楽しめる世界を創造します。
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>高品質なAI生成音楽を無料で提供</li>
              <li>クリエイターとリスナーをつなぐプラットフォームの構築</li>
              <li>音楽制作の民主化と新しい創造性の支援</li>
              <li>AI技術と音楽の融合による新しい価値の創出</li>
            </ul>
          </div>
        </div>

        {/* 主な機能 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">主な機能</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🎵 音楽ライブラリ</h3>
              <p>
                様々なジャンル・ムードのAI生成音楽を自由に視聴・検索できます。
                お気に入りの曲を見つけて、あなたのプロジェクトに活用してください。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">⬇️ 無料ダウンロード</h3>
              <p>
                すべての音楽を無料でダウンロード可能。
                動画制作、ポッドキャスト、プレゼンテーションなど、様々な用途にご利用いただけます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🔍 高度な検索</h3>
              <p>
                ジャンル、ムード、テンポなどの条件で音楽を検索。
                あなたのプロジェクトにぴったりの音楽を素早く見つけられます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🎨 シンプルで美しいUI</h3>
              <p>
                直感的で使いやすいインターフェースで、ストレスなく音楽を探索できます。
                レスポンシブデザインにより、PC・タブレット・スマートフォンに対応しています。
              </p>
            </div>
          </div>
        </div>

        {/* 技術スタック */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">技術スタック</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Kaleido AI Musicは、最新のWeb技術を活用して構築されています：
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Next.js 14</strong> - React フレームワーク（App Router）</li>
              <li><strong>TypeScript</strong> - 型安全な開発</li>
              <li><strong>Tailwind CSS</strong> - モダンなスタイリング</li>
              <li><strong>Vercel</strong> - デプロイ・ホスティング</li>
              <li><strong>AI Music Generation</strong> - 高品質な音楽生成技術</li>
            </ul>
          </div>
        </div>

        {/* 運営者情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">運営者情報</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>運営:</strong> Kaleido Future（屋号）
            </p>
            <p>
              <strong>お問い合わせ:</strong>{' '}
              <a
                href="mailto:kaleidoaimusic_support@kaleidofuture.com"
                className="text-purple-600 hover:text-purple-700 hover:underline"
              >
                kaleidoaimusic_support@kaleidofuture.com
              </a>
            </p>
          </div>
        </div>

        {/* リンク */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">関連リンク</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/terms"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
