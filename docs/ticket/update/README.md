# チケット管理システム

Kaleido AI Musicプロジェクトの開発進捗を管理するためのチケットシステムです。

## 📁 ディレクトリ構造

```
docs/ticket/
├── README.md                    # このファイル
├── initial/                     # 初期構築用チケット(Phase 1-7)
│   ├── README.md
│   ├── PROGRESS.md
│   └── phase-*.md (7ファイル)
├── bug/                         # バグ修正チケット
│   ├── README.md
│   ├── PROGRESS.md
│   └── bug-{番号}-{説明}.md
├── feature/                     # 機能追加チケット
│   ├── README.md
│   ├── PROGRESS.md
│   └── feature-{番号}-{説明}.md
└── enhancement/                 # 改善チケット
    ├── README.md
    ├── PROGRESS.md
    └── enhancement-{番号}-{説明}.md
```

## 📊 チケットカテゴリ

### 🏗️ [initial/](initial/) - 初期構築チケット
プロジェクトの初期構築時に使用されるPhase 1-7のチケットです。
初期プレリリースまでの実装タスクを管理します。

- **対象**: Phase 1-7の初期構築タスク
- **状態**: 実装中
- **参照**: [initial/README.md](initial/README.md)

### 🐛 [bug/](bug/) - バグ修正チケット
本番環境や開発中に発見されたバグの修正を管理します。

- **命名規則**: `bug-001-description.md`
- **優先度**: Critical / High / Medium / Low
- **参照**: [bug/README.md](bug/README.md)

### ✨ [feature/](feature/) - 機能追加チケット
新しい機能の追加や要望を管理します。

- **命名規則**: `feature-001-description.md`
- **優先度**: High / Medium / Low
- **参照**: [feature/README.md](feature/README.md)

### 🔧 [enhancement/](enhancement/) - 改善チケット
既存機能の改善・最適化・リファクタリングを管理します。

- **命名規則**: `enhancement-001-description.md`
- **カテゴリ**: Performance / Refactoring / UX / Security / Code Quality
- **参照**: [enhancement/README.md](enhancement/README.md)

## 📊 チケットステータス

各チケットは以下のステータスを持ちます:

- 🔴 **未着手 (TODO)**: まだ開始していない
- 🟡 **進行中 (IN PROGRESS)**: 現在作業中
- 🟢 **完了 (DONE)**: 実装・テスト完了
- 🔵 **レビュー待ち (REVIEW)**: レビュー依頼中
- ⚫ **ブロック (BLOCKED)**: 他の作業待ち

## 🚀 Claudeカスタムコマンド

プロジェクト管理を効率化するためのカスタムコマンドが利用可能です:

### 進捗確認コマンド
- `/check-progress` - プロジェクト全体の進捗状況を確認
- `/ticket-status` - 全カテゴリのチケット進捗を表示
- `/list-tickets` - 全チケットの一覧を表示

### Phase管理コマンド
- `/start-phase {番号}` - 指定したPhaseの実装を開始
- `/next-phase` - 次のPhaseを自動判定して開始

### チケット管理コマンド
- `/ticket` - 新しいチケット(バグ/機能/改善)を作成
- `/start-bug {番号}` - バグチケットの修正を開始
- `/start-feature {番号}` - 機能追加チケットの実装を開始
- `/start-enhancement {番号}` - 改善チケットの実装を開始
- `/complete-bug {番号}` - バグチケットを完了
- `/complete-feature {番号}` - 機能追加チケットを完了
- `/complete-enhancement {番号}` - 改善チケットを完了

## 🎯 使い方

### 1. プロジェクト開始時

```bash
# 進捗を確認
/check-progress

# Phase 1を開始
/start-phase 1

# または、次のPhaseを自動開始
/next-phase
```

### 2. 各Phaseの実装

各コマンドは以下を自動実行します:
1. チケットファイルの読み込み
2. ステータスを「進行中」に更新
3. 実装タスクの実行支援
4. **開発サーバー起動+ブラウザでの視覚的確認**
5. チケットステータスを「完了」に更新
6. PROGRESS.mdの更新
7. Gitコミットの自動作成

### 3. バグや追加機能の管理

```bash
# 新しいチケットを作成
/ticket

# バグ修正を開始
/start-bug 1

# 機能追加を開始
/start-feature 1
```

## 📝 チケット番号の採番ルール

各カテゴリで独立した連番を使用します:

```
bug-001-player-not-working.md
bug-002-download-error.md
feature-001-playlist-feature.md
feature-002-comment-system.md
enhancement-001-performance-optimization.md
enhancement-002-mobile-ux-improvement.md
```

## 🔄 ワークフロー

### Phase実装フロー
1. `/start-phase {番号}` でPhase開始
2. チケットのタスクに従って実装
3. 開発サーバーで動作確認
4. 自動的にステータス更新+Gitコミット作成
5. `/next-phase` で次のPhaseへ

### バグ修正フロー
1. `/ticket` でバグチケット作成
2. `/start-bug {番号}` で修正開始
3. 問題箇所の特定と修正
4. 動作確認
5. `/complete-bug {番号}` で完了

### 機能追加フロー
1. `/ticket` で機能追加チケット作成
2. `/start-feature {番号}` で実装開始
3. 設計→実装→テスト
4. 動作確認
5. `/complete-feature {番号}` で完了

## 📈 統計情報の確認

各カテゴリの `PROGRESS.md` で以下の情報を確認できます:

- 全体進捗率
- カテゴリ別/優先度別の件数
- 平均対応時間
- 現在対応中のタスク
- 完了済みタスク

## 🎯 進捗管理のベストプラクティス

1. **こまめな更新**: タスク完了時は即座にチェック
2. **詳細な記録**: メモセクションに問題点や解決策を記録
3. **実績時間の記録**: 見積精度向上のため実績時間を記録
4. **定期レビュー**: 週次でPROGRESS.mdを確認
5. **優先度の見直し**: 状況に応じて優先度を調整

## 🔗 関連ドキュメント

- [初期構築チケット](initial/README.md) - Phase 1-7の実装タスク
- [バグ修正チケット](bug/README.md) - バグ管理ガイド
- [機能追加チケット](feature/README.md) - 機能追加ガイド
- [改善チケット](enhancement/README.md) - 改善管理ガイド

---

**Kaleido AI Music** - AI生成音楽を、もっと身近に。
