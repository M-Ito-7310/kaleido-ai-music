# Phase 7: 仕上げ・デプロイ - 詳細実装ガイド

**Phase**: 7/7
**推定時間**: 1日
**前提条件**: Phase 1-6完了
**次のステップ**: 本番運用

---

## 目次

1. [概要](#概要)
2. [UI/UX最終調整](#uiux最終調整)
3. [バグフィックス](#バグフィックス)
4. [環境変数設定](#環境変数設定)
5. [Vercelデプロイ](#vercelデプロイ)
6. [本番環境確認](#本番環境確認)
7. [監視とメンテナンス](#監視とメンテナンス)
8. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 7は最終段階です。UI/UXの細部を調整し、バグを修正し、Vercelに本番デプロイします。

### このPhaseで実現すること

- UI/UXポリッシュ
- バグフィックス
- Vercelデプロイ設定
- 環境変数の本番設定
- 本番環境での動作確認
- 監視設定

---

## UI/UX最終調整

### ステップ 1: ローディング状態の改善

**ファイル名**: `app/library/loading.tsx`

```typescript
export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダースケルトン */}
        <div className="mb-8">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="mt-2 h-5 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* 検索バースケルトン */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 max-w-md h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* フィルタースケルトン */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* グリッドスケルトン */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### ステップ 2: エラー処理の改善

**ファイル名**: `app/error.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          エラーが発生しました
        </h1>
        <p className="text-gray-600 mb-6">
          申し訳ございません。予期しないエラーが発生しました。
          <br />
          もう一度お試しください。
        </p>
        <Button onClick={reset}>再試行</Button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              エラー詳細
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
```

**ファイル名**: `app/not-found.tsx`

```typescript
import Link from 'next/link';
import { Home, Music } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <Music className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              <Home className="mr-2 h-4 w-4" />
              ホームへ
            </Button>
          </Link>
          <Link href="/library">
            <Button variant="outline">
              <Music className="mr-2 h-4 w-4" />
              ライブラリへ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### ステップ 3: アクセシビリティ改善

**チェックリスト:**

- [ ] すべての画像に適切なalt属性
- [ ] フォーカス可能な要素に視覚的フィードバック
- [ ] キーボードナビゲーションが機能
- [ ] ARIAラベルの追加
- [ ] 色のコントラスト比が4.5:1以上

**ファイル名**: `components/ui/Button.tsx`（フォーカススタイル強化）

```typescript
const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed ' +
  'touch-feedback no-tap-highlight';
```

---

## バグフィックス

### ステップ 4: よくあるバグの修正

**1. 音楽プレイヤーのメモリリーク防止:**

```typescript
// components/music/MusicPlayer.tsx
useEffect(() => {
  return () => {
    // コンポーネントアンマウント時にクリーンアップ
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    playerRef.current?.destroy();
  };
}, []);
```

**2. 検索のレースコンディション防止:**

```typescript
// components/filters/SearchBar.tsx
useEffect(() => {
  const controller = new AbortController();

  const search = async () => {
    try {
      await debouncedSearch(searchQuery);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Search aborted');
      }
    }
  };

  search();

  return () => {
    controller.abort();
  };
}, [searchQuery, debouncedSearch]);
```

**3. 画像読み込みエラーのハンドリング:**

```typescript
// すべてのImageコンポーネントにエラーハンドリングを追加
<Image
  src={music.imageUrl}
  alt={music.title}
  fill
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.png';
  }}
/>
```

### ステップ 5: 型エラーの解消

**コマンド:**
```bash
npm run type-check
```

**すべての型エラーを修正:**

```typescript
// 型アサーションの適切な使用
const data = await response.json() as ApiResponse<Music>;

// オプショナルチェイニングの使用
const duration = music?.duration ?? 0;

// nullチェックの追加
if (!music) {
  return notFound();
}
```

---

## 環境変数設定

### ステップ 6: 本番環境変数の準備

**ファイル名**: `.env.production.example`

```bash
# Neon PostgreSQL（本番用）
DATABASE_URL="postgresql://..."

# Vercel Blob Storage（本番用）
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# アプリケーションURL（本番用）
NEXT_PUBLIC_APP_URL="https://kaleido-ai-music.vercel.app"

# Analytics（オプション）
NEXT_PUBLIC_GA_ID=""
```

### ステップ 7: 環境変数のバリデーション

**ファイル名**: `lib/env.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated');
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment configuration');
  }
}
```

---

## Vercelデプロイ

### ステップ 8: GitHubリポジトリ作成

```bash
# .gitignoreの確認
cat .gitignore

# 初回コミット
git add .
git commit -m "Initial commit: Kaleido AI Music完成版"

# GitHubリポジトリ作成（ブラウザで実行）
# https://github.com/new

# リモートリポジトリ追加
git remote add origin https://github.com/yourusername/kaleido-ai-music.git
git branch -M main
git push -u origin main
```

### ステップ 9: Vercelアカウント設定

1. https://vercel.com にアクセス
2. GitHubアカウントでサインアップ/ログイン
3. 「Import Project」をクリック
4. GitHubリポジトリを選択

### ステップ 10: Vercelプロジェクト設定

**Build & Development Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
```
DATABASE_URL = postgresql://...
BLOB_READ_WRITE_TOKEN = vercel_blob_rw_...
NEXT_PUBLIC_APP_URL = https://kaleido-ai-music.vercel.app
```

### ステップ 11: デプロイ実行

```bash
# ローカルでビルドテスト
npm run build

# 成功したらVercelにプッシュ
git push origin main
```

**デプロイステータス確認:**
- Vercelダッシュボードでビルドログを確認
- エラーがあれば修正してプッシュ

---

## 本番環境確認

### ステップ 12: デプロイ後の動作確認

**チェックリスト:**

1. **ランディングページ**
   - [ ] ページが正しく表示される
   - [ ] すべてのリンクが動作する
   - [ ] 画像が読み込まれる

2. **音楽ライブラリ**
   - [ ] 音楽一覧が表示される
   - [ ] フィルターが動作する
   - [ ] 検索が動作する
   - [ ] ページネーションが動作する

3. **音楽詳細**
   - [ ] 音楽詳細が表示される
   - [ ] 音楽プレイヤーが動作する
   - [ ] ダウンロードが動作する

4. **アップロード**
   - [ ] アップロードフォームが表示される
   - [ ] ファイルアップロードが動作する
   - [ ] データベースに保存される

5. **パフォーマンス**
   - [ ] Lighthouseスコア確認
   - [ ] ページロード速度確認

### ステップ 13: データベースマイグレーション

**本番データベースのセットアップ:**

```bash
# 環境変数を本番用に切り替え
export DATABASE_URL="postgresql://production-url..."

# マイグレーション実行
npm run db:push

# カテゴリデータのシード
npx tsx scripts/seed-categories.ts
```

---

## 監視とメンテナンス

### ステップ 14: Vercel Analytics設定

1. Vercelダッシュボードで「Analytics」タブ
2. Enableをクリック
3. 無料プランを選択

### ステップ 15: エラー監視

**Sentry統合（オプション）:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**設定ファイル**: `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### ステップ 16: パフォーマンス監視

**Vercel Speed Insights:**

```bash
npm install @vercel/speed-insights
```

**ファイル名**: `app/layout.tsx`（追加）

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## カスタムドメイン設定（オプション）

### ステップ 17: ドメイン追加

1. Vercelダッシュボードで「Settings」→「Domains」
2. ドメインを入力（例: kaleido-music.com）
3. DNSレコードを設定

**DNSレコード例:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 成果物チェックリスト

### コード品質

- [ ] TypeScript型エラー0件
- [ ] ESLint警告が許容範囲内
- [ ] すべてのテストが通過
- [ ] コメントが適切に記述されている

### UI/UX

- [ ] ローディング状態が実装されている
- [ ] エラー処理が適切
- [ ] アクセシビリティが確保されている
- [ ] モバイルで快適に動作

### デプロイ

- [ ] Vercelデプロイ成功
- [ ] 環境変数が正しく設定されている
- [ ] データベースマイグレーション完了
- [ ] 本番環境で動作確認済み

### 監視

- [ ] Vercel Analytics有効化
- [ ] エラー監視設定（オプション）
- [ ] パフォーマンス監視設定

---

## 次のステップ

**本番運用:**
- 定期的なバックアップ
- セキュリティアップデート
- 新機能の追加
- ユーザーフィードバックの収集

---

## まとめ

Phase 7で、Kaleido AI Musicプロジェクトが完成しました！

**達成したこと:**
- ✅ UI/UX最終調整
- ✅ バグフィックス
- ✅ 環境変数設定
- ✅ Vercelデプロイ
- ✅ 本番環境確認
- ✅ 監視設定

**所要時間:** 約1日（8時間）

**プロジェクト合計:**
- 全7 Phase完了
- 合計開発時間: 9-12日
- 本番環境でアクセス可能

おめでとうございます！プロジェクトが完成しました🎉

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
