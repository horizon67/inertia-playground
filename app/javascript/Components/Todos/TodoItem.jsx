import React from "react";
import { formatDate } from "../../Utils/formatDate";

export default function TodoItem({
  todo,
  isEditing,
  editData,
  setEditData,
  startEdit,
  cancelEdit,
  submitEdit,
  toggleCompleted,
  removeTodo,
}) {
  return (
    <li className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 shadow shadow-black/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 items-start gap-3">
          <button
            type="button"
            onClick={() => toggleCompleted(todo)}
            className={`cursor-pointer mt-1 h-6 w-6 rounded-full border-2 transition ${
              todo.completed
                ? "border-emerald-400 bg-emerald-400/20"
                : "border-slate-600 hover:border-slate-400"
            }`}
            aria-label="完了状態を切り替え"
          />
          <div className="space-y-1">
            {isEditing ? (
              <form className="space-y-2" onSubmit={submitEdit}>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  value={editData.title}
                  onChange={(event) =>
                    setEditData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="タイトル"
                />
                <textarea
                  className="w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  value={editData.description}
                  onChange={(event) =>
                    setEditData((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="詳細"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                    onClick={cancelEdit}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-emerald-400"
                  >
                    保存
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-lg font-medium ${
                      todo.completed ? "text-emerald-300 line-through" : "text-slate-100"
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400">
                    作成: {formatDate(todo.created_at)}
                  </span>
                </div>
                {todo.description && (
                  <p className="text-sm text-slate-300">{todo.description}</p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-400 hover:text-slate-100"
              onClick={() => startEdit(todo)}
            >
              編集
            </button>
          )}
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-rose-500/70 px-3 py-1 text-xs text-rose-200 transition hover:border-rose-400 hover:text-rose-50"
            onClick={() => removeTodo(todo)}
          >
            削除
          </button>
        </div>
      </div>
    </li>
  );
}

