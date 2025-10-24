# Enhancement #002: ホームページのボタンスタイル統一

**ステータス**: 🔴 未着手
**カテゴリ**: UX
**優先度**: Medium
**担当**: 未割当
**作成日**: 2025-10-25
**完了日**: -

## 🔧 改善概要

ホームページのヒーローセクションにある2つのCTAボタン（「ライブラリを見る」と「音楽をアップロード」）のデザインスタイルを統一し、視覚的な一貫性を向上させる。

## 🎯 目的・背景

### なぜこの改善が必要か

1. **デザインの一貫性**
   - 現在、隣接する2つのボタンが異なるスタイルで表示されている
   - 「ライブラリを見る」: プライマリーボタン（塗りつぶし）
   - 「音楽をアップロード」: テキストリンク
   - この不統一により、ユーザーがどちらを優先的にクリックすべきか混乱する可能性がある

2. **UX向上**
   - 両方のアクションが重要なCTAであるため、同等の視覚的重要度を持たせるべき
   - プライマリー/セカンダリーの明確な階層構造を持たせることで、ユーザーの行動を適切に誘導できる

3. **アクセシビリティ**
   - テキストリンクはボタンに比べてクリック可能領域が小さく、タップしにくい
   - 両方をボタン形式にすることで、モバイルユーザーの操作性が向上する

## 📊 現状の問題点

### 現在の実装（app/page.tsx:19-33）

```tsx
<div className="mt-10 flex items-center justify-center gap-x-6">
  <Link
    href="/library"
    className="rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors flex items-center gap-2"
  >
    ライブラリを見る
    <ArrowRight className="h-5 w-5" />
  </Link>
  <Link
    href="/upload"
    className="text-base font-semibold leading-7 text-gray-900 hover:text-primary-600 transition-colors"
  >
    音楽をアップロード <span aria-hidden="true">→</span>
  </Link>
</div>
```

### 具体的な問題

1. **視覚的な不統一**
   - 「ライブラリを見る」: 目立つプライマリーボタン
   - 「音楽をアップロード」: 控えめなテキストリンク
   - スタイルの差が大きすぎる

2. **視覚的階層の欠如**
   - どちらも重要なアクションだが、視覚的重要度が大きく異なる
   - ユーザーがアップロード機能を見逃す可能性がある

3. **タップ領域の不一致**
   - ボタンは十分なパディングがあるが、テキストリンクは文字部分のみ
   - モバイルでの操作性が低下

4. **アイコン表現の不統一**
   - 「ライブラリを見る」: Lucideの`<ArrowRight>`コンポーネント
   - 「音楽をアップロード」: テキストベースの矢印 `→`

## 💡 改善後の期待値

### 改善後のデザイン案

**推奨案**: プライマリー + セカンダリーボタンの組み合わせ

```tsx
<div className="mt-10 flex items-center justify-center gap-x-6">
  {/* プライマリーボタン */}
  <Link
    href="/library"
    className="rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors flex items-center gap-2"
  >
    ライブラリを見る
    <ArrowRight className="h-5 w-5" />
  </Link>

  {/* セカンダリーボタン（アウトライン） */}
  <Link
    href="/upload"
    className="rounded-lg border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 hover:border-primary-600 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors flex items-center gap-2"
  >
    音楽をアップロード
    <ArrowRight className="h-5 w-5" />
  </Link>
</div>
```

**代替案**: 両方をソリッドボタンにする（プライマリー + グレー背景）

```tsx
{/* セカンダリーボタン（グレー背景） */}
<Link
  href="/upload"
  className="rounded-lg bg-gray-100 px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-colors flex items-center gap-2"
>
  音楽をアップロード
  <ArrowRight className="h-5 w-5" />
</Link>
```

### 期待される効果

1. **デザインの一貫性向上**
   - 両方のボタンが同じ形式（ボタン要素）になる
   - パディング、角丸、フォントサイズが統一される

2. **視覚的階層の明確化**
   - プライマリー（塗りつぶし）とセカンダリー（アウトライン/グレー）で優先度を表現
   - ユーザーに主要なアクション（ライブラリ閲覧）を推奨しつつ、アップロードも見やすく配置

3. **操作性の向上**
   - 両方のボタンが十分なタップ領域を持つ
   - モバイルでのタップミスが減少

4. **アクセシビリティ向上**
   - フォーカス状態が明確になる
   - キーボードナビゲーションが改善される

## 🔧 改善方法

### アプローチ

**推奨**: プライマリー（bg-primary-600）+ セカンダリー（アウトライン）の組み合わせ

理由:
- ユーザーに「まずはライブラリを見る」という明確な誘導ができる
- アップロードボタンも十分に目立つ
- 現代的なUIデザインのベストプラクティスに準拠
- Tailwind CSSの標準的なパターンで実装可能

### 技術的な詳細

1. **セカンダリーボタンのクラス設計**
   - ベース: `rounded-lg border-2 border-gray-300 px-6 py-3`
   - フォント: `text-base font-semibold text-gray-900`
   - ホバー: `hover:border-primary-600 hover:text-primary-600`
   - フォーカス: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`
   - トランジション: `transition-colors`
   - レイアウト: `flex items-center gap-2`

2. **アイコンの統一**
   - テキストベースの矢印 `→` を Lucide の `<ArrowRight>` コンポーネントに変更
   - サイズ: `h-5 w-5` で統一

3. **レスポンシブ対応**
   - 現在のレイアウトを維持（`flex items-center justify-center gap-x-6`）
   - 小画面では必要に応じて縦並びに変更可能（将来的な改善）

## ✅ 実装タスク

- [ ] [app/page.tsx](app/page.tsx) のヒーローセクション（19-33行目）を修正
- [ ] 「音楽をアップロード」ボタンをテキストリンクからボタン形式に変更
- [ ] セカンダリーボタンのスタイルクラスを追加
- [ ] テキスト矢印 `→` を `<ArrowRight>` コンポーネントに置き換え
- [ ] ブラウザでの視覚的確認
- [ ] モバイル表示の確認
- [ ] フォーカス状態の動作確認
- [ ] ビルドテスト実行

## 📦 変更対象ファイル

- [ ] [app/page.tsx](app/page.tsx) - ヒーローセクションのボタンスタイル統一（19-33行目）

## 🧪 ビフォー・アフター比較

| 指標 | Before | After | 改善 |
|------|--------|-------|------|
| ボタン形式の統一 | ❌ 不統一（ボタン+テキストリンク） | ✅ 統一（両方ボタン） | ✅ 向上 |
| タップ領域 | 不均一 | 均一（両方とも十分な領域） | ✅ 向上 |
| アイコン表現 | 不統一（Lucide+テキスト） | 統一（両方Lucide） | ✅ 向上 |
| 視覚的階層 | 曖昧 | 明確（プライマリー/セカンダリー） | ✅ 向上 |
| アクセシビリティ | 中 | 高 | ✅ 向上 |
| モバイル操作性 | 中 | 高 | ✅ 向上 |

## 🎯 完了条件

- [ ] すべての実装タスクが完了
- [ ] 改善効果が視覚的に確認できる
- [ ] 既存機能に影響がないことを確認
- [ ] ビルドが成功する
- [ ] デザインの一貫性が確保されている

## 🧪 テスト項目

- [ ] デスクトップブラウザでの表示確認
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] モバイル表示確認
  - [ ] iPhone Safari
  - [ ] Android Chrome
  - [ ] タブレット
- [ ] 操作性確認
  - [ ] ホバー状態が正しく表示される
  - [ ] フォーカス状態が正しく表示される
  - [ ] クリック/タップが正常に動作する
- [ ] アクセシビリティ確認
  - [ ] キーボードナビゲーションが正常
  - [ ] フォーカスインジケーターが視認できる
  - [ ] タブオーダーが適切

## 📝 メモ

### デザイン決定事項

- プライマリー/セカンダリーの色の組み合わせは既存のデザインシステム（`tailwind.config.ts`の`primary`色）に準拠
- アウトラインボタンの境界線は `border-2` で視認性を確保
- ホバー時の色変化は `hover:border-primary-600 hover:text-primary-600` で統一感を演出

### 将来的な改善案

- レスポンシブデザインの強化（小画面では縦並び、大画面では横並び）
- ダークモード対応時の色の調整
- アニメーション効果の追加（フェードイン、スライドインなど）

### 参考資料

- [Tailwind CSS Button Components](https://tailwindui.com/components/marketing/elements/buttons)
- [Lucide Icons - ArrowRight](https://lucide.dev/icons/arrow-right)

## 🔗 関連

- 関連Issue: -
- 関連PR: -
- 関連チケット: -
- 参考資料:
  - [Material Design - Buttons](https://m3.material.io/components/buttons/overview)
  - [Nielsen Norman Group - Primary vs Secondary Actions](https://www.nngroup.com/articles/primary-secondary-actions/)
