import { router } from "@inertiajs/react";

export function useTodos() {
  const toggleCompleted = (todo) => {
    router.put(
      `/todos/${todo.id}`,
      { completed: !todo.completed },
      { preserveScroll: true, preserveState: true }
    );
  };

  const removeTodo = (todo) => {
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

