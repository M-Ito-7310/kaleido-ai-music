# Phase 4: 検索・フィルター機能

**ステータス**: 🔴 未着手
**担当**: AIエージェント
**見積もり時間**: 1-2日
**実績時間**: -
**依存**: Phase 3
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

音楽ライブラリに検索・フィルター・ソート機能を実装します。ユーザーがキーワード検索、ジャンルフィルター、タグフィルター、ソート(新着順、人気順、ダウンロード順)を使って目的の音楽を見つけやすくします。

## ✅ タスクチェックリスト

### フィルターコンポーネント
- [ ] src/components/filters/SearchBar.tsxを作成
  - [ ] 検索入力フィールド
  - [ ] 検索アイコン
  - [ ] クリアボタン
  - [ ] デバウンス処理(500ms)
  - [ ] モバイル最適化
- [ ] src/components/filters/GenreFilter.tsxを作成
  - [ ] ジャンルチップ(ボタン形式)
  - [ ] 複数選択可能
  - [ ] 選択状態の視覚的フィードバック
  - [ ] 「すべて」オプション
- [ ] src/components/filters/TagFilter.tsxを作成
  - [ ] タグチップ(ボタン形式)
  - [ ] 複数選択可能
  - [ ] 選択状態の視覚的フィードバック
- [ ] src/components/filters/SortSelector.tsxを作成
  - [ ] ドロップダウンまたはボタングループ
  - [ ] ソートオプション(新着順、人気順、ダウンロード順)
  - [ ] 昇順/降順切り替え
- [ ] src/components/filters/FilterPanel.tsxを作成
  - [ ] SearchBar統合
  - [ ] GenreFilter統合
  - [ ] TagFilter統合
  - [ ] SortSelector統合
  - [ ] フィルタークリアボタン
  - [ ] モバイルで折りたたみ可能

### 状態管理
- [ ] src/hooks/useMusics.tsを作成
  - [ ] API呼び出し
  - [ ] ローディング状態管理
  - [ ] エラーハンドリング
  - [ ] ページネーション管理
  - [ ] キャッシング(React Query or SWR検討)
- [ ] src/hooks/useFilters.tsを作成
  - [ ] 検索キーワード状態
  - [ ] ジャンルフィルター状態
  - [ ] タグフィルター状態
  - [ ] ソート状態
  - [ ] URLクエリパラメータ連携

### APIクエリ対応
- [ ] src/app/library/page.tsxを更新
  - [ ] FilterPanel統合
  - [ ] useMusics、useFilters統合
  - [ ] URLクエリパラメータ読み取り
  - [ ] フィルター変更時のAPI再呼び出し
  - [ ] ページネーション対応
- [ ] src/app/api/musics/route.tsを更新(必要に応じて)
  - [ ] 検索クエリ対応(title、artist、description)
  - [ ] ジャンルフィルター対応
  - [ ] タグフィルター対応
  - [ ] ソート対応(createdAt、playCount、downloadCount)

### ページネーション
- [ ] src/components/ui/Pagination.tsxを作成
  - [ ] ページ番号ボタン
  - [ ] 前へ/次へボタン
  - [ ] 現在のページ表示
  - [ ] 総ページ数表示
  - [ ] モバイル最適化(シンプルなUI)

### URLクエリパラメータ連携
- [ ] クエリパラメータの読み取り・書き込み
  - [ ] ?q={keyword} - 検索キーワード
  - [ ] ?genre={genre} - ジャンル
  - [ ] ?tag={tag} - タグ
  - [ ] ?sort={sort} - ソート
  - [ ] ?page={page} - ページ番号
- [ ] ブラウザの戻る/進むボタン対応
- [ ] URL共有機能(フィルター状態を保持)

## 📦 成果物

- [ ] src/components/filters/SearchBar.tsx
- [ ] src/components/filters/GenreFilter.tsx
- [ ] src/components/filters/TagFilter.tsx
- [ ] src/components/filters/SortSelector.tsx
- [ ] src/components/filters/FilterPanel.tsx
- [ ] src/components/ui/Pagination.tsx
- [ ] src/hooks/useMusics.ts
- [ ] src/hooks/useFilters.ts
- [ ] src/app/library/page.tsx(更新)
- [ ] src/app/api/musics/route.ts(更新)

## 🔗 関連ドキュメント

- [機能仕様](../../idea/03-feature-specifications.md)
- [UIデザイン方針](../../idea/05-ui-design.md)

## 🎯 完了条件

- [ ] 検索バーでキーワード検索が正常に動作
- [ ] ジャンルフィルターで絞り込みが正常に動作
- [ ] タグフィルターで絞り込みが正常に動作
- [ ] ソートが正常に動作(新着順、人気順、ダウンロード順)
- [ ] ページネーションが正常に動作
- [ ] URLクエリパラメータが正しく反映される
- [ ] ブラウザの戻る/進むボタンが正常に動作
- [ ] モバイルでフィルターパネルが使いやすい
- [ ] フィルター変更時にローディング状態が表示される

## 🧪 テスト項目

- [ ] 検索キーワード入力でリアルタイム検索(デバウンス)
- [ ] ジャンル選択で音楽が絞り込まれる
- [ ] タグ選択で音楽が絞り込まれる
- [ ] ソート変更で順序が変わる
- [ ] ページネーション

ボタンでページが切り替わる
- [ ] URLを直接入力してフィルター状態が復元される
- [ ] URLをコピー&シェアして同じフィルター状態が再現される
- [ ] フィルタークリアですべてのフィルターがリセットされる
- [ ] モバイルで折りたたみパネルが動作する
- [ ] 検索結果が0件の場合に適切なメッセージが表示される

## 📝 メモ・進捗コメント

### 注意事項
- デバウンス処理で無駄なAPI呼び出しを削減
- モバイルではフィルターパネルを折りたたみ可能にする
- URLクエリパラメータでフィルター状態を保持
- ページネーションは無限スクロールではなくページ番号方式(シンプルさ優先)

### 技術的な決定事項
- デバウンスはlodash.debounceまたはカスタムフック
- URL操作はNext.js routerのuseSearchParams、useRouter使用
- React QueryまたはSWRでキャッシングとローディング状態管理(検討)
- フィルター状態はURL Syncで管理(リロード対応)

### パフォーマンス最適化
- 検索デバウンス処理
- ジャンル・タグはプリロード
- ページネーションでデータ量制限

### 次のPhaseへの引き継ぎ
- Phase 5でダウンロード機能を完全実装
- フィルター機能は今後も拡張可能な設計

---

**Phase 4完了後の状態**: ユーザーが音楽を簡単に検索・発見できる機能が整う
