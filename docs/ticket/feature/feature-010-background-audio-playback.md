# Feature #010: バックグラウンド音楽再生対応

**ステータス**: 🟡 進行中
**優先度**: Medium
**担当**: AIエージェント
**作成日**: 2025-10-30
**開始日時**: 2025-10-30 23:45
**完了日**: -

## ✨ 機能概要

画面スリープ時やアプリがバックグラウンドに移行した際も音楽再生を継続できる機能を実装します。現在は画面がスリープ状態になると音楽が停止してしまうため、ユーザー体験を向上させるためのバックグラウンド再生機能が必要です。

## 🎯 目的・背景

現在、音楽を再生している最中に画面がスリープ状態になると曲が停止してしまい、ユーザーが継続して音楽を楽しむことができません。この問題を解決し、以下を実現します：

- 画面スリープ中も音楽再生を継続
- 他のアプリに切り替えた際も再生を継続
- ロック画面での再生コントロール対応
- モバイルデバイスでの快適な音楽視聴体験の提供

## 📋 主要機能

1. **バックグラウンド再生**: 画面スリープ時・他アプリ使用時も音楽再生を継続
2. **Media Session API対応**: ブラウザのメディアコントロール、通知領域での操作対応
3. **ロック画面コントロール**: モバイルデバイスのロック画面での再生/一時停止/次/前の操作
4. **再生状態の維持**: アプリ復帰時に再生位置や状態を正確に復元

## 🔧 技術仕様

### データ構造
- 既存の音楽プレイヤー状態管理の拡張
- 再生セッション情報の保持

### API設計
- Media Session API の統合
- Wake Lock API の活用（オプション）
- Service Worker の活用（PWA対応の場合）

### UI/UXデザイン
- ロック画面でのメディアコントロール表示
- 通知エリアでの再生情報表示
- アルバムアートの表示対応
- 再生/一時停止/次へ/前へボタンの提供

### 依存関係
- Media Session API（標準Web API）
- 既存の音楽プレイヤーコンポーネント
- 状態管理システム（Redux/Context等）

## ✅ 実装タスク

### バックエンド
- [x] 必要に応じてセッション管理の強化 - Media Session API実装済み
- [x] 再生状態の永続化機能 - IndexedDB履歴機能実装済み

### フロントエンド
- [x] Media Session API の統合実装 - lib/audio/mediaSession.ts 実装済み
- [x] メタデータ設定（タイトル、アーティスト、アルバムアート）
- [x] アクションハンドラの実装（play, pause, seekbackward, seekforward, previoustrack, nexttrack）
- [x] 音楽プレイヤーコンポーネントの更新 - GlobalPlayer.tsx に統合済み
- [x] 再生状態管理の強化 - PlayerContext で完全管理
- [x] バックグラウンド時の音声再生継続処理 - HTMLAudioElement + Web Audio API
- [x] Wake Lock API の検討・実装（オプション） - lib/audio/wakeLock.ts 実装完了

### テスト
- [ ] デスクトップブラウザでの動作確認 - 本番環境でテスト予定
- [ ] モバイルブラウザでの動作確認 - 本番環境でテスト予定
- [ ] ロック画面での操作テスト - 本番環境でテスト予定
- [ ] 通知領域での操作テスト - 本番環境でテスト予定
- [ ] 画面スリープ時の再生継続確認 - 本番環境でテスト予定
- [ ] バッテリー消費の確認 - 本番環境でテスト予定

## 📦 成果物

- [x] Media Session API統合コード - lib/audio/mediaSession.ts
- [x] Wake Lock API統合コード - lib/audio/wakeLock.ts
- [x] 更新された音楽プレイヤーコンポーネント - components/music/GlobalPlayer.tsx
- [ ] バックグラウンド再生対応のドキュメント - 本番テスト後に作成予定
- [ ] テスト結果レポート - 本番環境テスト後に作成予定

## 🎯 完了条件

- [ ] 画面スリープ時も音楽が再生し続けること
- [ ] ロック画面でメディアコントロールが表示され操作可能なこと
- [ ] 通知領域でメディア情報が表示され操作可能なこと
- [ ] アルバムアート、曲名、アーティスト名が正しく表示されること
- [ ] 再生/一時停止/次へ/前への操作が正常に動作すること
- [ ] アプリ復帰時に再生状態が正しく維持されていること
- [ ] 主要ブラウザ（Chrome, Safari, Firefox）で動作すること
- [ ] モバイルデバイス（iOS Safari, Android Chrome）で動作すること

## 🧪 テスト計画

### 単体テスト
- [ ] Media Session APIのメタデータ設定テスト
- [ ] アクションハンドラの動作テスト
- [ ] 再生状態管理のテスト

### 統合テスト
- [ ] 音楽プレイヤーとMedia Session APIの連携テスト
- [ ] 状態管理システムとの統合テスト

### E2Eテスト
- [ ] 音楽再生 → 画面スリープ → 再生継続の確認
- [ ] ロック画面での操作シナリオ
- [ ] 他アプリへの切り替え → 音楽再生継続の確認
- [ ] アプリ復帰時の状態復元確認

### ブラウザテスト
- [ ] Chrome（デスクトップ）
- [ ] Safari（デスクトップ）
- [ ] Firefox（デスクトップ）
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### デバイステスト
- [ ] iPhone（iOS最新版）
- [ ] Android端末（最新版）
- [ ] タブレット端末

## 📝 メモ

### 実装詳細
実装日: 2025-10-30 23:45
実装者: AIエージェント

#### 既存実装の確認
コードベースを分析した結果、バックグラウンド音楽再生機能は既にほぼ完全に実装されていました：
- Media Session API統合済み（lib/audio/mediaSession.ts）
- GlobalPlayerでの活用済み（components/music/GlobalPlayer.tsx）
- HTMLAudioElement-based Playerで安定した再生管理

#### 追加実装
- **Wake Lock API機能追加**: lib/audio/wakeLock.ts を新規作成
- **GlobalPlayerへの統合**: Wake Lock機能をオプションとして統合
- デフォルトでは無効（バッテリー消費を考慮）

#### 作成したファイル
- lib/audio/wakeLock.ts - Wake Lock API統合コード

#### 修正したファイル
- components/music/GlobalPlayer.tsx - Wake Lock機能統合、再生状態管理強化

#### 技術的な決定事項
- Wake Lock APIはオプション機能として実装（バッテリー消費を考慮）
- Media Session APIは既に実装済みで、ロック画面コントロールに対応
- HTMLAudioElementベースのプレイヤーでバックグラウンド再生を実現

#### 注意点
- Media Session APIはほとんどのモダンブラウザでサポートされています
- iOS SafariではPWAとしてインストールされている場合にのみ一部機能が制限される可能性があります
- バックグラウンド再生時のバッテリー消費に注意が必要です
- ユーザーのブラウザ設定や端末の省電力モードの影響を受ける可能性があります
- Wake Lock APIは画面をオンのままにするため、バッテリー消費が増える（デフォルト無効）

## 🔗 関連

- 関連Issue: -
- 関連PR: -
- 参考資料:
  - [Media Session API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)
  - [Wake Lock API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- デザインモックアップ: -
