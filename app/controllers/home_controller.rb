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
        }
      ]
    }
  end
end
