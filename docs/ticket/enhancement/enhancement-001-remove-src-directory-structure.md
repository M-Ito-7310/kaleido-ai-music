# Enhancement #001: src/ディレクトリの削除とプロジェクト構造の統一

**ステータス**: 🔴 未着手
**カテゴリ**: Refactoring
**優先度**: High
**担当**: AIエージェント
**作成日**: 2025-10-25
**完了日**: -

## 🔧 改善概要

Next.js 14のApp Routerプロジェクトにおいて、ルート直下の`app/`ディレクトリと`src/app/`ディレクトリが並存している状態を解消し、Next.js公式推奨の単一構造に統一する。

## 🎯 目的・背景

### なぜこの改善が必要か

1. **Next.js公式の推奨に準拠**
   - Next.js公式では`src/app`と`app`の併用は推奨されていない
   - 両方が存在する場合、ルート直下の`app/`が優先されるが、混乱を招く

2. **プロジェクト構造の明確化**
   - 現在の実装はすでにルート直下の構造(`app/`, `lib/`, `types/`, `components/`)で動いている
   - `src/`ディレクトリは古い実装が残っているだけで使用されていない

3. **重複の解消**
   - `lib/`と`src/lib/`が重複
   - `types/`と`src/types/`が重複
   - `app/`と`src/app/`が重複

4. **パスエイリアスとの整合性**
   - `tsconfig.json`の`"@/*": ["./*"]`はルート直下を指している
   - `src/`の存在が混乱を招く可能性がある

## 📊 現状の問題点

### 現在のディレクトリ構造

```
プロジェクトルート/
├── app/              ← 実際に使用されている(完全な実装)
│   ├── layout.tsx    (フル実装、Header/Footer含む)
│   ├── page.tsx      (完全なホームページ)
│   ├── library/
│   ├── music/[id]/
│   ├── about/, terms/, privacy/
│   └── ...
├── src/
│   ├── app/          ← 不要な古いファイル
│   │   ├── layout.tsx (最小限の実装)
│   │   └── page.tsx   (プレースホルダー)
│   ├── lib/          ← 重複(古い実装)
│   │   └── utils.ts  (4関数のみ)
│   └── types/        ← 重複(古い実装)
│       └── music.ts  (基本的な型のみ)
├── components/       ← 実際に使用
├── lib/              ← 実際に使用(完全な実装)
│   ├── audio/, db/, hooks/, storage/
│   └── utils.ts      (6関数、拡張版)
└── types/            ← 実際に使用(完全な実装)
    ├── api.ts
    └── music.ts      (拡張された型定義)
```

### 具体的な問題

1. **ファイルの重複**
   - `src/app/layout.tsx` vs `app/layout.tsx` (内容が異なる、後者が使用されている)
   - `src/app/page.tsx` vs `app/page.tsx` (内容が異なる、後者が使用されている)
   - `src/lib/utils.ts` vs `lib/utils.ts` (内容が異なる、後者が拡張版)
   - `src/types/music.ts` vs `types/music.ts` (内容が異なる、後者が拡張版)

2. **開発者の混乱**
   - どちらのディレクトリを編集すべきか判断に迷う
   - `src/`内のファイルは実際には使用されていない

3. **ビルドパフォーマンス**
   - 不要なファイルがTypeScriptのコンパイル対象になっている可能性

## 💡 改善後の期待値

### 改善後のディレクトリ構造

```
プロジェクトルート/
├── app/              ← 唯一のappディレクトリ
│   ├── layout.tsx
│   ├── page.tsx
│   ├── library/
│   ├── music/[id]/
│   ├── about/, terms/, privacy/
│   └── ...
├── components/       ← UIコンポーネント
├── lib/              ← ユーティリティ、DB、hooks等
│   ├── audio/
│   ├── db/
│   ├── hooks/
│   ├── storage/
│   └── utils.ts
└── types/            ← 型定義
    ├── api.ts
    └── music.ts
```

### 期待される効果

1. **プロジェクト構造が明確になる**
   - Next.jsのルーティングが明確
   - 開発者が迷わない

2. **保守性の向上**
   - ファイルの編集場所が一意に決まる
   - 重複による混乱がなくなる

3. **ビルドパフォーマンスの向上**
   - 不要なファイルスキャンがなくなる

4. **Next.js公式推奨に準拠**
   - ベストプラクティスに従った構造

## 🔧 改善方法

### アプローチ

1. **事前確認**
   - `src/`内のファイルとルート直下のファイルを比較
   - 移行が必要な内容がないことを確認(すでに確認済み)

2. **削除実行**
   - `src/`ディレクトリ全体を削除
   - Git履歴を残すため`git rm -r src`を使用

3. **動作確認**
   - ビルドテスト(`npm run build`)
   - 各ページの動作確認

### 技術的な詳細

- **削除対象**: `src/`ディレクトリ全体
- **保持対象**: ルート直下の`app/`, `components/`, `lib/`, `types/`
- **影響範囲**: なし(src/内のファイルは使用されていない)

## ✅ 実装タスク

- [ ] `src/`ディレクトリ内容の最終確認
- [ ] `src/`ディレクトリの削除(`git rm -r src`)
- [ ] ビルドテスト実行(`npm run build`)
- [ ] 各ページの動作確認
  - [ ] `/` (ホームページ)
  - [ ] `/library` (ライブラリ)
  - [ ] `/music/[id]` (音楽詳細)
  - [ ] `/about` (About)
  - [ ] `/terms` (利用規約)
  - [ ] `/privacy` (プライバシーポリシー)
- [ ] Gitコミット作成

## 📦 変更対象ファイル

- [x] `src/app/layout.tsx` - 削除(不要)
- [x] `src/app/page.tsx` - 削除(不要)
- [x] `src/lib/utils.ts` - 削除(不要、ルート直下が拡張版)
- [x] `src/types/music.ts` - 削除(不要、ルート直下が拡張版)
- [x] `src/`ディレクトリ全体 - 削除

## 🧪 ビフォー・アフター比較

| 指標 | Before | After | 改善 |
|------|--------|-------|------|
| app/ディレクトリ数 | 2個(app/, src/app/) | 1個(app/) | ✅ 統一 |
| lib/ディレクトリ数 | 2個(lib/, src/lib/) | 1個(lib/) | ✅ 統一 |
| types/ディレクトリ数 | 2個(types/, src/types/) | 1個(types/) | ✅ 統一 |
| プロジェクト構造の明確性 | 曖昧 | 明確 | ✅ 向上 |
| Next.js公式推奨準拠 | ❌ 非準拠 | ✅ 準拠 | ✅ 改善 |

## 🎯 完了条件

- [x] すべての実装タスクが完了
- [ ] 改善効果が測定されている(ビルド成功、ページ表示確認)
- [ ] 既存機能に影響がないことを確認
- [ ] ビルドが成功する

## 🧪 テスト項目

- [ ] `npm run build`が成功することを確認
- [ ] 全ページが正常に表示されることを確認
  - [ ] `/` - ホームページ
  - [ ] `/library` - ライブラリページ
  - [ ] `/music/[id]` - 音楽詳細ページ
  - [ ] `/about` - Aboutページ
  - [ ] `/terms` - 利用規約ページ
  - [ ] `/privacy` - プライバシーポリシーページ
- [ ] コンソールエラーがないことを確認
- [ ] インポートエラーがないことを確認

## 📝 メモ

### 事前確認結果

以下の比較を実施済み:

**src/app/ vs app/**
- `src/app/layout.tsx`: 最小限の実装(古い)
- `app/layout.tsx`: フル実装(Header/Footer、メタデータ、PWA対応)
- `src/app/page.tsx`: プレースホルダー(古い)
- `app/page.tsx`: 完全なホームページ実装

**src/lib/ vs lib/**
- `src/lib/utils.ts`: 4関数のみ
- `lib/utils.ts`: 6関数(formatDate、formatCount追加)
- `lib/`: audio、db、hooks、storage等の完全な実装あり

**src/types/ vs types/**
- `src/types/music.ts`: 基本的な型定義のみ
- `types/music.ts`: 拡張された型定義(MusicFilter、MusicStats等)
- `types/api.ts`: src/にはない

**結論**: `src/`内のファイルは全て古い/不完全な実装で、移行が必要なコードはなし

## 🔗 関連

- 関連Issue: -
- 関連PR: -
- 参考資料:
  - [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
  - [Next.js App Router](https://nextjs.org/docs/app)
