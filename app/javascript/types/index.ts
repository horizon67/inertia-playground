// Inertia.jsの型定義
import { Page, PageProps } from "@inertiajs/core";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  description: string;
}

export interface SharedProps extends PageProps {
  flash: {
    notice?: string;
    alert?: string;
  };
  app: {
    name: string;
  };
}

export interface TodosIndexProps extends SharedProps {
  todos: Todo[];
  form?: TodoFormData | null;
  editing_id?: number | null;
  errors?: Record<string, string>;
}

export type InertiaPage<T extends PageProps = PageProps> = Page<T>;

