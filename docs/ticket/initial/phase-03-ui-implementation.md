# Phase 3: UI実装

**ステータス**: 🔴 未着手
**担当**: AIエージェント
**見積もり時間**: 2-3日
**実績時間**: -
**依存**: Phase 2
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

ユーザーが音楽を視聴・閲覧するための主要UIを実装します。ランディングページ、音楽ライブラリページ、音楽詳細ページ、音楽プレイヤーコンポーネントを作成し、レスポンシブデザインで美しいUIを構築します。

## ✅ タスクチェックリスト

### 共通UIコンポーネント
- [ ] src/components/ui/Button.tsxを作成
  - [ ] 5バリアント(primary、secondary、outline、ghost、danger)
  - [ ] 3サイズ(sm、md、lg)
  - [ ] ローディング状態
- [ ] src/components/ui/Card.tsxを作成
  - [ ] シャドウ、ボーダー、ホバーエフェクト
- [ ] src/components/ui/Modal.tsxを作成
  - [ ] アクセシビリティ対応
  - [ ] Escキー対応
- [ ] src/components/ui/Spinner.tsxを作成
  - [ ] 3サイズ
- [ ] src/components/ui/Input.tsxを作成
  - [ ] 検索用Input
- [ ] src/components/ui/Badge.tsxを作成
  - [ ] タグ・ジャンル表示用

### レイアウトコンポーネント
- [ ] src/components/layout/Header.tsxを作成
  - [ ] ロゴ
  - [ ] ナビゲーションメニュー
  - [ ] モバイルハンバーガーメニュー
- [ ] src/components/layout/Footer.tsxを作成
  - [ ] コピーライト
  - [ ] リンク
- [ ] src/components/layout/Container.tsxを作成
  - [ ] レスポンシブコンテナ

### 音楽関連コンポーネント
- [ ] src/components/music/MusicCard.tsxを作成
  - [ ] サムネイル画像
  - [ ] タイトル、アーティスト
  - [ ] ジャンル、タグバッジ
  - [ ] 再生ボタン
  - [ ] ダウンロードボタン
  - [ ] 再生回数、ダウンロード数表示
  - [ ] ホバーエフェクト
- [ ] src/components/music/MusicGrid.tsxを作成
  - [ ] レスポンシブグリッドレイアウト(1/2/3/4カラム)
  - [ ] ローディング状態
  - [ ] 空状態表示
- [ ] src/components/music/MusicPlayer.tsxを作成
  - [ ] 再生/一時停止ボタン
  - [ ] シークバー
  - [ ] 現在時刻/総時間表示
  - [ ] ボリュームコントロール
  - [ ] Web Audio API使用
  - [ ] モバイル最適化
- [ ] src/components/music/MusicDetails.tsxを作成
  - [ ] 大きなサムネイル
  - [ ] タイトル、アーティスト、説明
  - [ ] ジャンル、タグ
  - [ ] 作成日、再生回数、ダウンロード数
  - [ ] 再生ボタン、ダウンロードボタン

### ページ実装
- [ ] src/app/page.tsxを作成(ランディングページ)
  - [ ] ヒーローセクション
  - [ ] 特徴紹介(3-4項目)
  - [ ] 新着音楽プレビュー
  - [ ] CTAボタン(ライブラリへ遷移)
  - [ ] レスポンシブデザイン
- [ ] src/app/library/page.tsxを作成(音楽ライブラリ)
  - [ ] MusicGrid表示
  - [ ] ページネーション
  - [ ] ローディング状態
  - [ ] API /api/musics呼び出し
  - [ ] レスポンシブデザイン
- [ ] src/app/music/[id]/page.tsxを作成(音楽詳細)
  - [ ] MusicDetails表示
  - [ ] MusicPlayer統合
  - [ ] API /api/musics/[id]呼び出し
  - [ ] 動的ルーティング
  - [ ] レスポンシブデザイン
- [ ] src/app/layout.tsxを更新
  - [ ] Header、Footer統合
  - [ ] メタデータ設定
  - [ ] Google Fonts統合(Noto Sans JP)
- [ ] src/app/globals.cssを更新
  - [ ] カスタムスクロールバー
  - [ ] アニメーション定義
  - [ ] 音楽プレーヤー用スタイル

### ユーティリティ関数
- [ ] src/lib/utils.tsを作成
  - [ ] cn() - clsx関数
  - [ ] formatDuration() - 秒数→mm:ss変換
  - [ ] formatDate() - 日付フォーマット
  - [ ] formatCount() - 再生回数フォーマット(1.2k等)

## 📦 成果物

- [ ] src/components/ui/ (6コンポーネント)
- [ ] src/components/layout/ (3コンポーネント)
- [ ] src/components/music/ (4コンポーネント)
- [ ] src/app/page.tsx (ランディング)
- [ ] src/app/library/page.tsx (ライブラリ)
- [ ] src/app/music/[id]/page.tsx (詳細)
- [ ] src/app/layout.tsx (レイアウト)
- [ ] src/app/globals.css (グローバルスタイル)
- [ ] src/lib/utils.ts (ユーティリティ)

## 🔗 関連ドキュメント

- [UIデザイン方針](../../idea/05-ui-design.md)
- [機能仕様](../../idea/03-feature-specifications.md)

## 🎯 完了条件

- [ ] npm run buildでTypeScriptエラーが0件
- [ ] ランディングページが美しく表示される
- [ ] 音楽ライブラリページでグリッド表示が正常に動作
- [ ] 音楽詳細ページで音楽プレイヤーが正常に動作
- [ ] すべてのページがモバイルで快適に閲覧できる
- [ ] API呼び出しが正常に動作
- [ ] ローディング状態が適切に表示される
- [ ] エラー状態が適切にハンドリングされる

## 🧪 テスト項目

- [ ] ランディングページが正常に表示される
- [ ] ライブラリページで音楽一覧が取得・表示される
- [ ] MusicCardがクリック可能で詳細ページに遷移
- [ ] 音楽詳細ページで音楽が再生できる
- [ ] シークバーでシーク操作ができる
- [ ] ボリュームコントロールが機能する
- [ ] ダウンロードボタンが機能する
- [ ] レスポンシブデザインが正常に動作(320px～)
- [ ] Chrome、Safari、Firefoxで正常に動作
- [ ] iOSとAndroidで正常に動作

## 📝 メモ・進捗コメント

### 注意事項
- モバイルファースト設計を徹底
- 音楽プレイヤーはモバイルで使いやすいUI
- 画像読み込みは遅延読み込み(Lazy Loading)
- アクセシビリティを考慮(ARIA属性)

### 技術的な決定事項
- Web Audio APIでカスタム音楽プレイヤー実装
- TailwindでユーティリティファーストUI
- Next.js Image最適化を活用
- React Server ComponentsとClient Componentsを適切に使い分け

### デザイン方針
- カラー: 音楽に合うグラデーション、鮮やかなアクセントカラー
- フォント: Noto Sans JP(読みやすい)
- レイアウト: シンプルで直感的
- アニメーション: 控えめで滑らか

### 次のPhaseへの引き継ぎ
- Phase 4で検索・フィルター機能を追加
- Phase 5でダウンロード機能を完全実装

---

**Phase 3完了後の状態**: ユーザーが音楽を視聴・閲覧できる完全なUIが整う
