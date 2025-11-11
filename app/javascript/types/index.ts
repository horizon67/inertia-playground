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

export interface ReceiptLineItem {
  id: number;
  name: string;
  quantity: number | null;
  unit_price: number | null;
  subtotal: number | null;
  raw_text?: string | null;
}

export interface Receipt {
  id: number;
  store_name: string | null;
  transaction_at: string | null;
  transaction_at_label?: string | null;
  transaction_at_raw?: string | null;
  total_amount: number | null;
  tax_amount: number | null;
  currency: string | null;
  currency_label?: string | null;
  payment_method: string | null;
  raw_text?: string | null;
  raw_response?: Record<string, unknown>;
  chat_id: number;
  analysis_message_id: number | null;
  model?: string | null;
  model_id?: string | null;
  created_at: string;
  image_url?: string | null;
  line_items: ReceiptLineItem[];
}

export interface ReceiptsIndexProps extends SharedProps {
  receipts: Receipt[];
  errors?: Record<string, string>;
}

export interface HomeLink {
  name: string;
  description: string;
  href: string;
  icon?: string;
}

export interface HomeIndexProps extends SharedProps {
  links: HomeLink[];
}

export type InertiaPage<T extends PageProps = PageProps> = Page<T>;

