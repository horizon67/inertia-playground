import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { useTodoForm } from "../../Hooks/useTodoForm";
import { useTodoEdit } from "../../Hooks/useTodoEdit";
import { useTodos } from "../../Hooks/useTodos";
import { useFlashMessage } from "../../Hooks/useFlashMessage";
import TodoForm from "../../Components/Todos/TodoForm";
import TodoList from "../../Components/Todos/TodoList";
import FlashMessage from "../../Components/Common/FlashMessage";
import { TodosIndexProps } from "../../types";

export default function TodosIndex({
  todos = [],
  form = null,
  editing_id = null,
}: TodosIndexProps) {
  const { app } = usePage<TodosIndexProps>().props;
  const { notice, alert } = useFlashMessage();
  const formHook = useTodoForm(form);
  const { editingId, editData, setEditData, startEdit, cancelEdit, submitEdit } =
    useTodoEdit(editing_id, todos);
  const { toggleCompleted, removeTodo } = useTodos();

  return (
    <>
      <Head title="TODO一覧" />
      <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <header className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-sky-400">{app?.name}</p>
            <h1 className="text-3xl font-semibold text-slate-50">TODO一覧</h1>
            <p className="text-sm text-slate-400">
              Inertia.js + React + Rails で構築したシンプルなTODOアプリです。
            </p>
            <FlashMessage notice={notice} alert={alert} />
          </header>

          <TodoForm formHook={formHook} />

          <TodoList
            todos={todos}
            editingId={editingId}
            editData={editData}
            setEditData={setEditData}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            submitEdit={submitEdit}
            toggleCompleted={toggleCompleted}
            removeTodo={removeTodo}
          />
        </div>
      </div>
    </>
  );
}

