import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";

const emptyForm = { title: "", description: "" };

export function useTodoEdit(serverEditingId, todos) {
  const [editingId, setEditingId] = useState(serverEditingId);
  const [editData, setEditData] = useState(emptyForm);

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

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditData({
      title: todo.title ?? "",
      description: todo.description ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(emptyForm);
  };

  const submitEdit = (event) => {
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

