class HomeController < ApplicationController
  def index
    render inertia: "Home/Index", props: {
      links: [
        {
          name: "TODO一覧",
          description: "Inertia.js + Railsで作成したTODO管理機能。",
          href: todos_path,
          icon: "📝"
        },
        {
          name: "レシート解析",
          description: "RubyLLMを利用したレシート画像の解析と履歴表示。",
          href: receipts_path,
          icon: "🧾"
        },
        {
          name: "Partial Reloads デモ",
          description: "Inertia.jsのonlyオプションで部分的に投稿データを再取得するサンプルです。",
          href: demos_partial_reloads_path,
          icon: "♻️"
        },
        {
          name: "Deferred Props デモ",
          description: "InertiaRails.deferで遅延取得される集計情報の表示例です。",
          href: demos_deferred_props_path,
          icon: "⏳"
        }
      ]
    }
  end
end
