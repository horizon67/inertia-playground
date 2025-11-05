import React from "react";
import TodoItem from "./TodoItem";
import { Todo, TodoFormData } from "../../types";
import { FormEventHandler } from "react";

interface TodoListProps {
  todos: Todo[];
  editingId: number | null;
  editData: TodoFormData;
  setEditData: React.Dispatch<React.SetStateAction<TodoFormData>>;
  startEdit: (todo: Todo) => void;
  cancelEdit: () => void;
  submitEdit: FormEventHandler;
  toggleCompleted: (todo: Todo) => void;
  removeTodo: (todo: Todo) => void;
}

export default function TodoList({
  todos,
  editingId,
  editData,
  setEditData,
  startEdit,
  cancelEdit,
  submitEdit,
  toggleCompleted,
  removeTodo,
}: TodoListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium text-slate-100">TODOリスト</h2>
      {todos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700 bg-slate-800/50 p-6 text-center text-sm text-slate-400">
          まだTODOはありません。上のフォームから追加してください。
        </p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => {
            const isEditing = editingId === todo.id;

            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                isEditing={isEditing}
                editData={editData}
                setEditData={setEditData}
                startEdit={startEdit}
                cancelEdit={cancelEdit}
                submitEdit={submitEdit}
                toggleCompleted={toggleCompleted}
                removeTodo={removeTodo}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

