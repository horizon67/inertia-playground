import React from "react";
import { UseFormReturn } from "@inertiajs/react";
import { TodoFormData } from "../../types";

interface TodoFormProps {
  formHook: UseFormReturn<TodoFormData> & {
    handleSubmit: React.FormEventHandler;
  };
}

export default function TodoForm({ formHook }: TodoFormProps) {
  const { data, setData, handleSubmit, processing, reset, errors } = formHook;

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-black/20">
      <h2 className="text-lg font-medium text-slate-100">新規登録</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            タイトル
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            value={data.title}
            onChange={(event) => setData("title", event.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-rose-300">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">
            詳細（任意）
          </label>
          <textarea
            id="description"
            name="description"
            className="mt-1 h-28 w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            value={data.description}
            onChange={(event) => setData("description", event.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-rose-300">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
            onClick={() => reset()}
          >
            リセット
          </button>
          <button
            type="submit"
            disabled={processing}
            className="cursor-pointer rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? "送信中..." : "追加"}
          </button>
        </div>
      </form>
    </section>
  );
}

