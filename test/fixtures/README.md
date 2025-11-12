# Fixtures Documentation

このディレクトリには、テストデータおよび初期データ（シードデータ）として使用されるfixtureファイルが含まれています。

## Fixtures一覧

### posts.yml
- ブログ投稿のサンプルデータ
- 開発環境での動作確認用

### prompt_templates.yml
- レシート解析用のプロンプトテンプレート
- 4種類のテンプレート：
  - `default_receipt`: 標準的なレシート解析プロンプト（デフォルト）
  - `detailed_receipt`: 詳細な指示とフォーマット例付き
  - `english_receipt`: 英語レシート対応版
  - `minimal_receipt`: 必要最小限の情報抽出用（高速処理）

## 使用方法

### テストでの利用
```ruby
# テストファイル内で
fixtures :prompt_templates

# fixtureデータへのアクセス
template = prompt_templates(:default_receipt)
```

### シードデータとしての利用
```bash
# データベースセットアップ時に自動的に読み込まれます
bin/rails db:seed

# または
bin/rails db:setup
```

## 注意事項

### プロンプトテンプレート
- `is_default: true`は各カテゴリで1つだけ設定してください
- `metadata`フィールドはYAML形式で構造化データを保存できます
- 新しいプロンプトを追加する場合は、既存の形式に従ってください

### フィクスチャーの更新
fixtureを更新した場合、以下のコマンドで反映させます：
```bash
# データベースをリセットして再構築
bin/rails db:reset

# または既存データを維持したまま追加
bin/rails db:seed
```

## プロンプトテンプレートのカスタマイズ

新しいプロンプトテンプレートを追加する場合：

1. `prompt_templates.yml`に新しいエントリを追加
2. 必要なフィールドを設定：
   - `name`: ユニークな名前
   - `category`: "receipt", "invoice", "general"のいずれか
   - `content`: プロンプト本文
   - `enabled`: 有効/無効フラグ
   - `version`: バージョン番号
   - `is_default`: デフォルトフラグ（カテゴリごとに1つのみ）
   - `metadata`: 追加情報（YAML形式）

3. データベースに反映：
   ```bash
   bin/rails db:seed
   ```
