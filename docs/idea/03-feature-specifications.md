# Feature Specifications

## 機能仕様詳細

このドキュメントでは、Kaleido AI Musicの各機能について詳細な仕様を定義します。

---

## 1. 音楽ライブラリ・ギャラリー機能

### 概要
AI生成音楽をカード形式で一覧表示し、ユーザーがブラウズできる機能。

### 主要機能
- レスポンシブグリッドレイアウト(スマホ1列、タブレット2列、PC3-4列)
- 無限スクロール または ページネーション
- カテゴリ別・タグ別フィルタリング
- ソート機能(新着順、人気順、ダウンロード数順)

### 音楽カード表示内容
- サムネイル画像(正方形、アスペクト比1:1)
- タイトル(最大2行、オーバーフロー時は省略記号)
- カテゴリバッジ
- 再生ボタン(オーバーレイ)
- 再生回数アイコン
- ダウンロード数アイコン

### ユーザーインタラクション
- カードクリック → 音楽詳細ページへ遷移
- 再生ボタンクリック → インラインで音楽再生開始
- サムネイルホバー(PC) → 拡大アニメーション

### 技術実装
- **コンポーネント**: `MusicCard.tsx`, `MusicGrid.tsx`
- **データ取得**: Server Component(SSR)で初期20件取得
- **ページネーション**: URLクエリパラメータ(`?page=2`)
- **レイアウト**: CSS Grid / Tailwind CSS

---

## 2. 音楽再生機能

### 概要
ブラウザ上で音楽を再生できるインライン音楽プレイヤー。

### 主要機能
- 再生/一時停止
- シークバー(クリックでジャンプ)
- ボリューム調整
- 現在の再生時間 / 総時間表示
- 次の曲/前の曲(将来的)

### プレイヤーUI配置
- **音楽カード内**: ミニプレイヤー(再生/一時停止のみ)
- **音楽詳細ページ**: フル機能プレイヤー
- **固定フッター**: グローバルプレイヤー(将来的)

### ユーザーインタラクション
- 再生ボタン → 音楽再生開始
- シークバードラッグ → 再生位置変更
- ボリュームスライダー → 音量調整

### 技術実装
- **コンポーネント**: `MusicPlayer.tsx` (Client Component)
- **API**: Web Audio API / HTML5 `<audio>`
- **状態管理**: React useState
- **音楽ソース**: Vercel Blob Storage URL

### 再生フロー
1. ユーザーが再生ボタンをクリック
2. `<audio>` 要素にファイルURLを設定
3. `audio.play()` で再生開始
4. `onTimeUpdate` イベントで再生時間を更新
5. シークバーをリアルタイムで更新

---

## 3. 音楽詳細ページ

### 概要
個別の音楽の詳細情報を表示し、視聴・ダウンロードができるページ。

### 表示内容
- **サムネイル画像**(大サイズ)
- **タイトル**(h1)
- **カテゴリバッジ**
- **タグ一覧**(クリックでタグフィルター)
- **生成AI名**(例: "Suno AI", "Udio")
- **音楽プレイヤー**(フル機能)
- **ダウンロードボタン**
- **説明文**(マークダウン対応、将来的)
- **統計情報**:
  - 再生回数
  - ダウンロード数
  - アップロード日時
- **関連音楽**(同じカテゴリの音楽、将来的)

### ユーザーインタラクション
- タグクリック → タグでフィルタリングした音楽ライブラリへ
- ダウンロードボタン → 音楽ファイルのダウンロード開始
- カテゴリクリック → カテゴリページへ

### 技術実装
- **ページ**: `/music/[id]/page.tsx` (Dynamic Route)
- **データ取得**: `GET /api/music/[id]` (Server Component)
- **SEO**: メタタグ設定(title, description, og:image)

---

## 4. ダウンロード機能

### 概要
音楽ファイルをユーザーのデバイスにダウンロードできる機能。

### 主要機能
- ワンクリックダウンロード
- ダウンロード数のカウント
- ファイル形式: MP3(主)、WAV(将来的)

### ユーザーインタラクション
1. ダウンロードボタンをクリック
2. ブラウザのダウンロードダイアログが表示
3. ファイル保存先を選択してダウンロード
4. ダウンロード数が+1される

### 技術実装
- **API**: `GET /api/download/[id]`
- **処理フロー**:
  1. 音楽IDを受け取る
  2. データベースから音楽情報を取得
  3. ダウンロード数をインクリメント
  4. Vercel Blobからファイルを取得
  5. `Content-Disposition: attachment` ヘッダーでファイルを返す

```typescript
// api/download/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const music = await db.query.musicTracks.findFirst({
    where: eq(musicTracks.id, params.id),
  });

  // ダウンロード数インクリメント
  await db.update(musicTracks)
    .set({ download_count: music.download_count + 1 })
    .where(eq(musicTracks.id, params.id));

  // ファイルストリーム返却
  const response = await fetch(music.file_url);
  return new Response(response.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${music.title}.mp3"`,
      'Content-Type': 'audio/mpeg',
    },
  });
}
```

---

## 5. カテゴリ・タグシステム

### 概要
音楽をカテゴリとタグで分類し、フィルタリング可能にする機能。

### カテゴリ
- **固定カテゴリ**(管理者が事前定義):
  - ポップ (Pop)
  - ロック (Rock)
  - エレクトロニック (Electronic)
  - クラシック (Classical)
  - アンビエント (Ambient)
  - ジャズ (Jazz)
  - ヒップホップ (Hip Hop)
  - その他 (Other)

### タグ
- **フリータグ**(アップロード時に任意追加):
  - 例: "relaxing", "energetic", "sad", "happy", "cinematic", "lo-fi"
  - 各音楽に複数タグを設定可能

### フィルタリング機能
- カテゴリフィルター: 1つのみ選択可能
- タグフィルター: 複数選択可能(AND条件)
- リセットボタン: すべてのフィルターをクリア

### 技術実装
- **コンポーネント**: `CategoryFilter.tsx`, `TagFilter.tsx`
- **データベース**:
  - `categories` テーブル: カテゴリマスター
  - `tags` テーブル: タグマスター
  - `music_tags` テーブル: 音楽とタグの中間テーブル
- **クエリ**: URLクエリパラメータ(`?category=ambient&tags=relaxing,chill`)

---

## 6. 検索機能

### 概要
キーワードで音楽を検索できる機能。

### 検索対象
- 音楽タイトル
- 説明文
- タグ
- カテゴリ名

### 検索UI
- **検索バー**: ヘッダーに固定表示
- **プレースホルダー**: "音楽を検索..."
- **リアルタイム検索**: 入力中に候補を表示(将来的)
- **検索ボタン** または **Enterキー** で検索実行

### 検索結果
- 音楽ライブラリと同じグリッドレイアウト
- 検索キーワードをハイライト表示(将来的)
- 検索結果0件時のメッセージ表示

### 技術実装
- **コンポーネント**: `SearchBar.tsx`
- **API**: `GET /api/music?q=keyword`
- **データベースクエリ**: LIKE検索またはフルテキスト検索

```typescript
// 例: Drizzle ORMでの検索クエリ
const results = await db.query.musicTracks.findMany({
  where: or(
    like(musicTracks.title, `%${keyword}%`),
    like(musicTracks.description, `%${keyword}%`)
  ),
});
```

---

## 7. ソート機能

### 概要
音楽一覧の並び順を変更できる機能。

### ソートオプション
- **新着順** (Latest): `created_at DESC` (デフォルト)
- **人気順** (Popular): `play_count DESC`
- **ダウンロード数順** (Most Downloaded): `download_count DESC`
- **タイトル順** (A-Z): `title ASC` (将来的)

### ソートUI
- ドロップダウンメニュー(モバイル対応)
- 現在のソート順をハイライト表示

### 技術実装
- **コンポーネント**: `SortDropdown.tsx`
- **URLクエリ**: `?sort=popular`
- **データベースクエリ**: ORDER BY句を動的に変更

---

## 8. 音楽アップロード機能(管理者向け)

### 概要
管理者がAI生成音楽をアップロードできる機能。

### アップロードフォーム
- **音楽ファイル**: ドラッグ&ドロップ または ファイル選択
  - 対応形式: MP3, WAV
  - 最大サイズ: 10MB
- **サムネイル画像**: 正方形推奨
  - 対応形式: JPG, PNG
  - 最大サイズ: 2MB
- **タイトル**: 必須、最大100文字
- **説明**: 任意、最大1000文字
- **カテゴリ**: ドロップダウンで選択
- **タグ**: カンマ区切りで入力(例: "relaxing, chill, ambient")
- **生成AI名**: テキスト入力(例: "Suno AI")

### バリデーション
- ファイル形式チェック
- ファイルサイズチェック
- 必須項目チェック
- タイトルの重複チェック(警告)

### アップロード処理フロー
1. フォーム送信
2. クライアントサイドバリデーション
3. ファイルをVercel Blobにアップロード
4. メタデータをデータベースに保存
5. 成功メッセージ表示 → 音楽詳細ページへリダイレクト

### 認証
- **環境変数**: `ADMIN_PASSWORD`
- 簡易的なパスワード認証(初期段階)
- 将来的には本格的な認証システムへ移行

### 技術実装
- **ページ**: `/upload/page.tsx` (Client Component)
- **API**: `POST /api/upload` (ファイルアップロード)
- **ストレージ**: Vercel Blob Storage

```typescript
// 例: アップロード処理
async function handleUpload(formData: FormData) {
  // ファイルアップロード
  const musicFile = formData.get('music') as File;
  const thumbnailFile = formData.get('thumbnail') as File;

  const musicUrl = await uploadMusic(musicFile);
  const thumbnailUrl = await uploadThumbnail(thumbnailFile);

  // データベース保存
  await db.insert(musicTracks).values({
    title: formData.get('title'),
    description: formData.get('description'),
    category_id: formData.get('category_id'),
    file_url: musicUrl,
    thumbnail_url: thumbnailUrl,
    generated_by: formData.get('generated_by'),
    // ...
  });
}
```

---

## 9. 統計機能

### 概要
音楽の再生回数・ダウンロード数を記録・表示する機能。

### 記録するデータ
- **再生回数** (play_count): 音楽が再生された回数
- **ダウンロード数** (download_count): 音楽がダウンロードされた回数

### カウント処理
- **再生回数**: 音楽が再生開始されたタイミングでカウント
  - 実装方法: プレイヤーの `onPlay` イベントで `POST /api/music/[id]/play`
- **ダウンロード数**: ダウンロードボタンクリック時にカウント
  - 実装方法: ダウンロードAPI内でインクリメント

### 表示場所
- 音楽カード: アイコン+数値(例: 👁 1.2k)
- 音楽詳細ページ: 詳細な統計情報

### 技術実装
- **データベース**: `play_count`, `download_count` カラム(Integer)
- **API**: `POST /api/music/[id]/play` (再生カウント)

---

## 10. レスポンシブデザイン

### 概要
スマートフォン・タブレット・PCすべてのデバイスで快適に利用できるデザイン。

### ブレークポイント
- **スマホ**: `< 768px` - 1カラム
- **タブレット**: `768px - 1024px` - 2カラム
- **PC**: `> 1024px` - 3-4カラム

### モバイルファースト設計
- スマホでの利用を最優先
- タップ領域を十分に確保(最低44x44px)
- 読みやすいフォントサイズ(本文16px以上)

### タッチ最適化
- スワイプジェスチャー(将来的)
- タッチフィードバック(ボタン押下時のアニメーション)
- ピンチズーム無効化(UI要素のみ)

---

## 11. パフォーマンス最適化

### 画像最適化
- **next/image** コンポーネント使用
- 遅延読み込み(Lazy Loading)
- WebP形式への自動変換

### 音楽ファイル最適化
- ストリーミング再生(バッファリング)
- プログレッシブダウンロード

### コード最適化
- コード分割(Dynamic Import)
- Server Componentsの活用
- クライアントサイドJavaScriptの最小化

---

## 12. 将来的な機能(スコープ外)

### ユーザー認証
- サインアップ/ログイン
- マイページ
- お気に入り機能

### ソーシャル機能
- コメント・レビュー
- いいね機能
- シェア機能

### プレイリスト機能
- カスタムプレイリスト作成
- プレイリスト共有

### AI音楽生成統合
- サイト内でのAI音楽生成
- プロンプトベースの音楽生成

### 収益化
- 有料ダウンロード
- サブスクリプションモデル
- 広告表示
