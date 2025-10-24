import Link from 'next/link'

export const metadata = {
  title: '利用規約 - Kaleido AI Music',
  description: 'Kaleido AI Musicサービス利用規約',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center">利用規約</h1>
      <p className="text-center text-gray-600 mb-12">
        最終更新日: 2025年10月25日
      </p>

      <div className="space-y-8">
        {/* 1. はじめに */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">1. はじめに</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              本利用規約（以下「本規約」といいます）は、Kaleido Future（屋号、以下「当社」といいます）が運営するKaleido AI Music（以下「当サービス」といいます）の利用条件を定めるものです。
              ユーザーの皆様（以下「ユーザー」といいます）には、本規約に同意した上で当サービスをご利用いただきます。
            </p>
          </div>
        </div>

        {/* 2. 規約への同意 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">2. 規約への同意</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              ユーザーは、当サービスを利用することにより、本規約に同意したものとみなされます。
              本規約に同意できない場合は、当サービスをご利用いただけません。
            </p>
            <p>
              未成年者が当サービスを利用する場合は、保護者の同意を得た上でご利用ください。
            </p>
          </div>
        </div>

        {/* 3. サービスの内容 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">3. サービスの内容</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当サービスは、AI生成音楽を展示・視聴・ダウンロードできる音楽ライブラリプラットフォームです。
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>AI生成音楽の視聴</li>
              <li>音楽ファイルの無料ダウンロード</li>
              <li>ジャンル・ムードによる検索機能</li>
              <li>音楽ライブラリの閲覧</li>
            </ul>
          </div>
        </div>

        {/* 4. 音楽の利用 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">4. 音楽の利用</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4.1 利用許諾</h3>
              <p>
                当サービスで提供されるすべての音楽は、個人利用・商用利用を問わず無料でご利用いただけます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4.2 利用可能範囲</h3>
              <p>以下の用途でご利用いただけます：</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>動画制作（YouTube、TikTok、Instagram等）のBGM</li>
                <li>ポッドキャスト、ラジオ番組のBGM</li>
                <li>プレゼンテーション、イベントのBGM</li>
                <li>ゲーム、アプリケーションのBGM</li>
                <li>その他の創作活動</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4.3 禁止事項</h3>
              <p>以下の行為は禁止されています：</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>音楽ファイルを再配布・販売する行為</li>
                <li>音楽を自分の作品として主張する行為</li>
                <li>音楽を他の音楽配信サービスにアップロードする行為</li>
                <li>公序良俗に反する用途での使用</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. 知的財産権 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">5. 知的財産権</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当サービスで提供されるすべての音楽、コンテンツ、ロゴ、デザインなどの知的財産権は、
              当社または正当な権利者に帰属します。
            </p>
            <p>
              ユーザーは、本規約で許諾された範囲内でのみ、音楽を利用することができます。
            </p>
          </div>
        </div>

        {/* 6. 禁止行為 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">6. 禁止行為</h2>
          <div className="space-y-4 text-gray-600">
            <p>ユーザーは、以下の行為を行ってはなりません：</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サービスまたは第三者の知的財産権、肖像権、プライバシー権、名誉、その他の権利を侵害する行為</li>
              <li>当サービスのサーバーまたはネットワークに過度な負荷をかける行為</li>
              <li>当サービスの運営を妨害する行為</li>
              <li>不正アクセス行為</li>
              <li>自動化ツール（ボット、スクレイピングツールなど）を使用して大量にダウンロードする行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </div>
        </div>

        {/* 7. 免責事項 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">7. 免責事項</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">7.1 サービスの提供</h3>
              <p>
                当サービスは、現状有姿で提供されます。
                当社は、サービスの正確性、完全性、有用性、安全性、継続性について、いかなる保証も行いません。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">7.2 損害賠償</h3>
              <p>
                当サービスの利用により生じた損害（直接損害、間接損害、逸失利益など）について、
                当社は一切の責任を負いません。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">7.3 サービスの中断・終了</h3>
              <p>
                当社は、事前の通知なく、当サービスの全部または一部を中断、変更、終了することができます。
                これにより生じた損害について、当社は一切の責任を負いません。
              </p>
            </div>
          </div>
        </div>

        {/* 8. 規約の変更 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">8. 規約の変更</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              当社は、必要に応じて本規約を変更することができます。
              規約変更後、ユーザーが当サービスを継続して利用した場合、変更後の規約に同意したものとみなされます。
            </p>
            <p>
              重要な変更がある場合は、当サービス上で事前に通知します。
            </p>
          </div>
        </div>

        {/* 9. 準拠法・管轄裁判所 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">9. 準拠法・管轄裁判所</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              本規約は、日本法に準拠し、日本法に従って解釈されるものとします。
            </p>
            <p>
              当サービスに関連する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </div>
        </div>

        {/* 10. お問い合わせ */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">10. お問い合わせ</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              本規約に関するご質問やご不明な点がございましたら、メールにてご連絡ください：
            </p>
            <div className="text-center mt-4">
              <a
                href="mailto:kaleidoaimusic_support@kaleidofuture.com"
                className="text-purple-600 hover:text-purple-700 hover:underline font-mono"
              >
                kaleidoaimusic_support@kaleidofuture.com
              </a>
            </div>
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
