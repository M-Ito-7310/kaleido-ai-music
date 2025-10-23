---
description: 指定したPhaseの実装を開始します（チケット更新・Gitコミット自動化）
---

# Phase {{phase_number}} 実装開始

あなたは**Kaleido AI Music**プロジェクトの専属開発エージェントです。Phase {{phase_number}} の実装を完全自動で実行します。

## 📋 実行フロー

### ステップ1: Phase情報の取得と検証

Phase番号: **{{phase_number}}**

Phase番号が1-7の範囲内であることを確認してください。範囲外の場合はエラーメッセージを表示して終了します。

Phase番号を2桁にパディング: `{{phase_number_padded}}` (例: 1 → 01, 7 → 07)

### ステップ2: 関連ドキュメントの読み込み

以下のファイルを読み込んでください：

1. **チケットファイル**:
   - `docs/ticket/phase-{{phase_number_padded}}-*.md` をGlobパターンで検索して読み込み
   - タスクチェックリスト、成果物リスト、完了条件を確認

2. **実装ドキュメント**:
   - `docs/implementation/20251023_{{phase_number_padded}}-*.md` をGlobパターンで検索して読み込み
   - 詳細な実装手順、完全なコード例を確認

3. **進捗ダッシュボード**:
   - `docs/ticket/PROGRESS.md` を読み込み
   - 現在の進捗状況を確認

### ステップ3: チケットステータス更新（進行中）

チケットファイル (`docs/ticket/phase-{{phase_number_padded}}-*.md`) を以下のように更新：

```markdown
**ステータス**: 🟡 進行中
**開始日時**: [現在の日時を記録]
```

**必ず実際にファイルを編集してステータスを更新してください。**

### ステップ4: 実装タスクの実行

実装ドキュメントとチケットのタスクチェックリストに従って、以下を実行：

#### Phase {{phase_number}} の主な実装内容

チケットファイルに記載されている**すべてのタスク**を順番に実行してください：

1. 必要なファイルをすべて作成
2. 実装ドキュメントのコード例を参照して完全なコードを実装
3. 設定ファイルを作成（該当する場合）
4. 依存パッケージのインストール（該当する場合）
5. ディレクトリ構造の作成（該当する場合）

**重要**:
- すべてのコードは実装ドキュメントの完全なコード例に基づいて作成
- TypeScriptの型定義を完全に実装
- コメントは日本語で記述
- エラーハンドリングを適切に実装

### ステップ5: 動作確認

チケットの「完了条件」セクションに記載されているすべての項目を確認：

1. ファイルが正しく作成されているか確認
2. TypeScriptコンパイルエラーがないか確認（`npm run build` または型チェック）
3. 該当する場合、開発サーバーを起動して動作確認（`npm run dev`）
4. 各完了条件を1つずつチェック

**完了条件をすべて満たしていない場合は、エラーを修正してから次に進んでください。**

### ステップ6: チケットステータス更新（完了）

すべての完了条件を満たしたら、以下を実行：

#### 6-1. チケットファイル更新（必須5工程）

**⚠️ 重要: 以下の5工程すべてを必ず実施すること**

`docs/ticket/phase-{{phase_number_padded}}-*.md` を以下の順序で更新：

**工程1: ステータス・日時の更新**
```markdown
**ステータス**: 🟢 完了
**完了日時**: [現在の日時を記録]
**実績時間**: [開始から完了までの実際の時間]
```

**工程2: タスクチェックリスト更新（`## ✅ タスクチェックリスト`セクション）**
- 完了した各タスクを `- [ ]` → `- [x]` に更新
- **全項目を必ず確認してチェックすること**
- 未完了のタスクがあれば、その理由をメモセクションに記録

**工程3: 成果物チェックリスト更新（`## 📦 成果物`セクション）**
- 作成した各成果物を `- [ ]` → `- [x]` に更新
- **全項目を必ず確認してチェックすること**
- 未作成の成果物があれば、その理由をメモセクションに記録

**工程4: 完了条件・テスト項目の更新**
- `## 🎯 完了条件` セクションの各項目を `- [ ]` → `- [x]` に更新
- `## 🧪 テスト項目` セクションの各項目を `- [ ]` → `- [x]` に更新
- **全項目を必ず確認してチェックすること**

**工程5: メモセクションへの記録（`## 📝 メモ・進捗コメント`セクション）**
- 実装時の成功点、工夫した点、決定事項を記録
- Git commit情報（コミットハッシュ、コミットメッセージ）を記録
- 次のPhaseへの引き継ぎ事項を明記
- 問題点や注意事項があれば記録

**検証コマンド（工程完了後に実行）:**
```bash
# チケットファイル内に未チェック項目がないことを確認
grep -c "\- \[ \]" docs/ticket/phase-{{phase_number_padded}}-*.md
# → 出力が 0 であることを確認（すべてチェック済み）
```

#### 6-2. PROGRESS.md更新

`docs/ticket/PROGRESS.md` を以下のように更新：

1. **全体進捗バー**を更新:
   ```
   進捗: ███████░░░░░░░░░░░ X% (Y/7 Phase)
   ```
   Phase {{phase_number}} を 🟢 完了 に変更

2. **Phase別詳細ステータス表**を更新:
   - Phase {{phase_number}} のステータスを 🟢 完了 に
   - 実績時間を記録
   - 進捗率を100%に

3. **マイルストーン進捗**を更新（該当する場合）

4. **最近の更新履歴**セクションに新しいエントリを追加:
   ```markdown
   ### [現在の日時]
   - ✅ Phase {{phase_number}} 完了: [Phase名]
     - [主な実装内容を箇条書き]
   ```

5. **現在の優先タスク**セクションを更新:
   - 完了したPhaseにチェックマーク
   - 次のPhaseを「今日やること」に追加

**必ず実際にファイルを編集してPROGRESS.mdを更新してください。**

### ステップ7: Gitコミット作成

Phase {{phase_number}} の実装が完全に完了したら、以下のコミットメッセージでGitコミットを作成：

#### Phase別コミットメッセージテンプレート

**Phase 1の場合**:
```
feat(setup): initial Next.js 14 project setup

- Initialize Next.js 14 with App Router
- Configure TypeScript with strict mode
- Setup Tailwind CSS with custom configuration
- Add dependencies (Prisma, etc.)
- Create project directory structure
- Configure ESLint and Prettier

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Phase 2の場合**:
```
feat(api): implement database schema and API routes

- Setup Prisma schema for tracks table
- Create database connection
- Implement API endpoints for CRUD operations
- Add data validation with Zod
- Setup error handling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Phase 3の場合**:
```
feat(ui): implement main UI components

- Create TrackList component with grid layout
- Add TrackCard component with metadata display
- Implement AudioPlayer component
- Add responsive design support
- Setup Tailwind styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Phase 4の場合**:
```
feat(search): implement search and filter functionality

- Add SearchBar component with real-time search
- Implement FilterPanel with multiple criteria
- Add search algorithm for tracks
- Create filter logic for genres/moods
- Optimize search performance

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Phase 5の場合**:
```
feat(download): implement download functionality

- Add download button to TrackCard
- Implement file download logic
- Add progress indicator
- Create download queue system
- Add error handling for downloads

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Phase 6の場合**:
```
feat(mobile): optimize for mobile devices

- Improve responsive design
- Add touch gestures support
- Optimize mobile layout
- Improve mobile performance
- Add PWA support

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Phase 7の場合**:
```
feat(deploy): finalize and deploy to Vercel

- Configure Vercel project
- Setup environment variables
- Deploy to production
- Verify deployment
- Add final optimizations

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**実行コマンド**:
```bash
git add .
git commit -m "[上記のコミットメッセージをヒアドキュメントで]"
```

### ステップ8: 完了レポート

Phase {{phase_number}} の実装が完了したら、以下の形式でレポートを出力：

```markdown
## ✅ Phase {{phase_number}} 完了レポート

### 📋 実装内容
- [実装した主な機能や成果物を箇条書き]

### 📦 作成ファイル
- [作成したファイルのリスト]

### ✅ 完了条件チェック
- [x] 条件1
- [x] 条件2
- ...

### 📊 進捗状況
- 全体進捗: X% (Y/7 Phase完了)
- 実績時間: Xm (見積もり: Y-Zm)

### 🎯 次のステップ
Phase {{next_phase_number}} の実装を開始できます。

次のPhaseを開始するには: `/start-phase {{next_phase_number}}`
または: `/next-phase`
```

---

## ⚠️ 重要な注意事項

1. **必ず実装ドキュメントの完全なコード例を使用**してください
2. **チケットステータスとPROGRESS.mdは必ず更新**してください
3. **完了条件をすべて満たしてから次に進んで**ください
4. **Gitコミットは必ず作成**してください
5. **エラーが発生した場合は、修正してから次に進んで**ください

---

## 🚀 実行開始

上記の手順に従って、Phase {{phase_number}} の実装を開始してください。
