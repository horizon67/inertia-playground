# Inertia Playground

Inertia.js + React + Rails で構築したシンプルなTODOアプリケーションです。

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
app/javascript/
├── Pages/           # Inertia.jsのページコンポーネント
├── Components/      # 再利用可能なReactコンポーネント
├── Hooks/           # カスタムReactフック
└── Utils/           # ユーティリティ関数
```

## 主な機能

- TODOの作成・編集・削除
- 完了状態の切り替え
- バリデーションエラーの表示
- フラッシュメッセージの表示

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
