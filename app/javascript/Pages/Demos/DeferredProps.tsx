import React from "react";
import { Deferred, Head, router, usePage } from "@inertiajs/react";
import type { DemosDeferredPropsProps } from "../../types";

export default function DemosDeferredProps({
  posts,
  posts_loaded_at,
  stats,
  stats_generated_at,
  category_breakdown,
}: DemosDeferredPropsProps) {
  const { app } = usePage<DemosDeferredPropsProps>().props;
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const toDateTimeLabel = (value?: string | null) => {
    if (!value) return "未取得";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleString("ja-JP");
  };

  const reloadDeferredData = () => {
    router.reload({
      only: ["stats", "stats_generated_at", "category_breakdown"],
      onStart: () => setIsRefreshing(true),
      onFinish: () => setIsRefreshing(false),
    });
  };

  return (
    <>
      <Head title="Deferred Props デモ" />
      <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-sky-400">{app?.name}</p>
            <h1 className="text-3xl font-semibold text-slate-50">Deferred Props デモ</h1>
            <p className="text-sm text-slate-400">
              初回レンダリング時は投稿一覧のみを表示し、集計情報は{" "}
              <code className="rounded bg-slate-900 px-1 py-[1px] text-xs text-sky-300">InertiaRails.defer</code>{" "}
              で遅延取得します。
            </p>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">最新の投稿</h2>
                <p className="text-sm text-slate-400">
                  投稿データは初回リクエストで取得され、{toDateTimeLabel(posts_loaded_at)} に更新されました。
                </p>
              </div>
              <button
                type="button"
                onClick={reloadDeferredData}
            disabled={isRefreshing}
            className="rounded-md border border-sky-500/60 px-3 py-2 text-xs font-medium text-sky-300 transition hover:bg-sky-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500 disabled:hover:bg-transparent"
              >
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400"
                />
                <span>再取得中…</span>
              </span>
            ) : (
              "遅延データを再取得"
            )}
              </button>
            </header>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex h-full flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-5"
                >
                  <header className="space-y-1">
                    <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-50">{post.title}</h3>
                  </header>
                  {post.body && <p className="text-sm leading-relaxed text-slate-400">{post.body}</p>}
                  <footer className="mt-auto text-xs text-slate-500">
                    公開日: {post.published_on ?? "未設定"}
                  </footer>
                </article>
              ))}
              {posts.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                  投稿データがまだ登録されていません。
                </p>
              )}
            </div>
          </section>

          <Deferred
            data={["stats", "stats_generated_at", "category_breakdown"]}
            fallback={
          <section className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-400">
            <div className="flex items-center gap-3 text-slate-200" aria-live="polite">
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400"
              />
              <span>集計情報を読み込んでいます…</span>
            </div>
              </section>
            }
          >
            <section className="rounded-2xl border border-emerald-600/40 bg-emerald-900/20 p-6 shadow-lg shadow-emerald-900/40">
              <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-emerald-200">投稿の集計情報</h2>
                  <p className="text-sm text-emerald-100/70">
                    {stats_generated_at ? `${toDateTimeLabel(stats_generated_at)} に再計算されました。` : "集計情報を取得しました。"}
                  </p>
                </div>
              </header>

              {stats ? (
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-4">
                    <dt className="text-xs uppercase tracking-wide text-emerald-300/70">投稿数</dt>
                    <dd className="mt-2 text-2xl font-semibold text-emerald-200">{stats.total_posts}</dd>
                  </div>
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-4">
                    <dt className="text-xs uppercase tracking-wide text-emerald-300/70">カテゴリ数</dt>
                    <dd className="mt-2 text-2xl font-semibold text-emerald-200">{stats.categories}</dd>
                  </div>
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-4">
                    <dt className="text-xs uppercase tracking-wide text-emerald-300/70">最新公開日</dt>
                    <dd className="mt-2 text-sm text-emerald-100">{stats.latest_published_on ?? "未設定"}</dd>
                  </div>
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-4">
                    <dt className="text-xs uppercase tracking-wide text-emerald-300/70">最終更新</dt>
                    <dd className="mt-2 text-sm text-emerald-100">{stats.most_recent_created_at ? toDateTimeLabel(stats.most_recent_created_at) : "未取得"}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-6 text-sm text-emerald-100/80">集計情報はまだ取得されていません。</p>
              )}

              {category_breakdown && category_breakdown.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-200/80">カテゴリ内訳</h3>
                  <ul className="space-y-2 text-sm text-emerald-100/90">
                    {category_breakdown.map((item) => (
                      <li
                        key={item.category}
                        className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-950/60 px-4 py-2"
                      >
                        <span>{item.category}</span>
                        <span>
                          {item.count} 件 <span className="text-xs text-emerald-200/70">({item.percentage}%)</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </Deferred>
        </div>
      </div>
    </>
  );
}

