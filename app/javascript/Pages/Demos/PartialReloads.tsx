import React, { useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import type { DemosPartialReloadsProps } from "../../types";

export default function DemosPartialReloads({
  posts,
  posts_loaded_at,
  categories,
  categories_loaded_at,
  filters,
  total_posts,
}: DemosPartialReloadsProps) {
  const { app } = usePage<DemosPartialReloadsProps>().props;
  const currentCategory = filters?.category ?? "";

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "すべて" },
      ...categories.map((categoryName) => ({ value: categoryName, label: categoryName })),
    ],
    [categories],
  );

  const toDateTimeLabel = (value?: string | null) => {
    if (!value) return "未取得";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleString("ja-JP");
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const url = value ? `/demos/partial-reloads?category=${encodeURIComponent(value)}` : "/demos/partial-reloads";

    router.visit(url, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: ["posts", "posts_loaded_at", "filters"],
    });
  };

  const reloadPosts = () => {
    router.reload({
      only: ["posts", "posts_loaded_at"],
    });
  };

  const reloadCategories = () => {
    router.reload({
      only: ["categories", "categories_loaded_at"],
    });
  };

  return (
    <>
      <Head title="Partial Reloads デモ" />
      <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-sky-400">{app?.name}</p>
            <h1 className="text-3xl font-semibold text-slate-50">Partial Reloads デモ</h1>
            <p className="text-sm text-slate-400">
              <code className="rounded bg-slate-900 px-1 py-[1px] text-xs text-sky-300">only</code>{" "}
              オプションで必要なデータだけを部分的に再取得できます。カテゴリ選択時は投稿データのみ、各ボタンはそれぞれ対応するデータのみを再取得します。
            </p>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-medium text-slate-300">
                  カテゴリで絞り込む
                </label>
                <select
                  id="category"
                  name="category"
                  value={currentCategory}
                  onChange={handleCategoryChange}
                  className="w-48 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value || "all"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                <button
                  type="button"
                  onClick={reloadPosts}
                  className="rounded-md border border-sky-500/60 px-3 py-2 text-xs font-medium text-sky-300 transition hover:bg-sky-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  投稿だけ再読み込み
                </button>
                <button
                  type="button"
                  onClick={reloadCategories}
                  className="rounded-md border border-emerald-500/60 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  カテゴリだけ再読み込み
                </button>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-500">投稿取得タイミング</dt>
                <dd className="mt-2 text-sm text-slate-200">{toDateTimeLabel(posts_loaded_at)}</dd>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-500">カテゴリ取得タイミング</dt>
                <dd className="mt-2 text-sm text-slate-200">{toDateTimeLabel(categories_loaded_at)}</dd>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-500">投稿総数</dt>
                <dd className="mt-2 text-2xl font-semibold text-sky-300">{total_posts}</dd>
              </div>
            </dl>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">投稿一覧</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/40"
                >
                  <header className="space-y-1">
                    <span className="inline-flex items-center rounded-full border border-sky-500/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-sky-300">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-50">{post.title}</h3>
                  </header>
                  {post.body && <p className="text-sm leading-relaxed text-slate-400">{post.body}</p>}
                  <footer className="mt-auto flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>公開日: {post.published_on ?? "未設定"}</span>
                    <span>更新: {toDateTimeLabel(post.updated_at)}</span>
                  </footer>
                </article>
              ))}
              {posts.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                  条件に一致する投稿はありません。
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

