import { router } from "@inertiajs/react";
import { Todo } from "../types";

export function useTodos() {
  const toggleCompleted = (todo: Todo): void => {
    router.put(
      `/todos/${todo.id}`,
      { completed: !todo.completed },
      { preserveScroll: true, preserveState: true }
    );
  };

  const removeTodo = (todo: Todo): void => {
    if (!confirm(`「${todo.title}」を削除しますか？`)) return;

    router.delete(`/todos/${todo.id}`, {
      preserveScroll: true,
    });
  };

  return {
    toggleCompleted,
    removeTodo,
  };
}

