import { router } from "@inertiajs/react";
import { useState, useEffect, FormEventHandler } from "react";
import { Todo, TodoFormData } from "../types";

const emptyForm: TodoFormData = { title: "", description: "" };

export function useTodoEdit(serverEditingId: number | null, todos: Todo[]) {
  const [editingId, setEditingId] = useState<number | null>(serverEditingId);
  const [editData, setEditData] = useState<TodoFormData>(emptyForm);

  useEffect(() => {
    if (serverEditingId) {
      const todo = todos.find((item) => item.id === serverEditingId);
      if (todo) {
        setEditingId(serverEditingId);
        setEditData({
          title: todo.title ?? "",
          description: todo.description ?? "",
        });
      }
    }
  }, [serverEditingId, todos]);

  const startEdit = (todo: Todo): void => {
    setEditingId(todo.id);
    setEditData({
      title: todo.title ?? "",
      description: todo.description ?? "",
    });
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditData(emptyForm);
  };

  const submitEdit: FormEventHandler = (event) => {
    event.preventDefault();
    if (!editingId) return;

    router.put(
      `/todos/${editingId}`,
      { ...editData },
      {
        preserveScroll: true,
        onSuccess: () => {
          cancelEdit();
        },
      }
    );
  };

  return {
    editingId,
    editData,
    setEditData,
    startEdit,
    cancelEdit,
    submitEdit,
  };
}

