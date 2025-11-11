# Inertia Playground

Inertia.js + React + Rails を使った実験的なサンプルアプリケーションです。複数の機能を試作しています。

## 技術スタック

- **Backend**: Ruby on Rails 8.0.3
- **Frontend**: React 19.2.0 + Inertia.js
- **Styling**: Tailwind CSS 4.1
- **Package Manager**: Bun
- **Database**: SQLite3

## セットアップ

### 前提条件

- Docker & Docker Compose

### 起動方法

```bash
# コンテナを起動
docker-compose up

# 初回のみ、データベースのセットアップ
docker-compose exec app bin/rails db:create db:migrate
```

アプリケーションは http://localhost:3030 で起動します。

## プロジェクト構成

```
app/
├── controllers/        # Railsコントローラ（Inertiaレスポンスを返す）
├── models/             # Active Recordモデル
├── services/           # ビジネスロジックをまとめたサービス層
├── views/              # レイアウト・共有ビュー（Inertiaと併用）
└── javascript/
    ├── Pages/          # Inertia.js ページコンポーネント
    ├── Components/     # 再利用可能な React コンポーネント
    ├── Hooks/          # フロントエンドのカスタムフック
    └── Utils/          # ユーティリティ関数

config/
├── routes.rb           # InertiaページやAPIのルーティング定義
```

## 主な機能

- TODOの作成・編集・削除
- 完了状態の切り替え、バリデーションエラー・フラッシュメッセージ表示
- レシート画像のアップロードと RubyLLM によるテキスト抽出
- 抽出結果の構造化保存と解析履歴の Inertia.js ページ表示

Inertia.js の Rails アダプタについては [inertiajs/inertia-rails](https://github.com/inertiajs/inertia-rails) を参照してください。

## 開発

### JavaScriptのビルド

```bash
bun run build          # 本番用ビルド
bun run build:css      # CSSのビルド
```

### データベース

```bash
bin/rails db:migrate   # マイグレーション実行
bin/rails console      # Railsコンソール
```
