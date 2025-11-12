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
  confidence_score?: number | null;
  confidence_level?: "high" | "medium" | "low" | "very_low" | null;
  confidence_level_label?: string | null;
  confidence_score_breakdown?: Record<string, number> | null;
  analysis_metadata?: Record<string, unknown> | null;
  prompt_template_id?: number | null;
  prompt_template_name?: string | null;
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

export interface DemoPost {
  id: number;
  title: string;
  category: string;
  body?: string | null;
  published_on?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemosPartialReloadsProps extends SharedProps {
  filters: {
    category?: string | null;
  };
  posts: DemoPost[];
  posts_loaded_at: string;
  categories: string[];
  categories_loaded_at: string;
  total_posts: number;
}

export interface DemoStats {
  total_posts: number;
  categories: number;
  latest_published_on?: string | null;
  most_recent_created_at?: string | null;
}

export interface DemoCategoryBreakdownItem {
  category: string;
  count: number;
  percentage: number;
}

export interface DemosDeferredPropsProps extends SharedProps {
  posts: DemoPost[];
  posts_loaded_at: string;
  stats?: DemoStats;
  stats_generated_at?: string;
  category_breakdown?: DemoCategoryBreakdownItem[];
}

export type InertiaPage<T extends PageProps = PageProps> = Page<T>;

