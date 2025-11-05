import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import TodosIndex from "./Pages/Todos/Index";

const appName = "Inertia Playground";

const pages = {
  "Todos/Index": TodosIndex,
};

createInertiaApp({
  title: (title) => (title ? `${title} | ${appName}` : appName),
  resolve: (name) => {
    const page = pages[name as keyof typeof pages];
    if (!page) {
      throw new Error(`ページ "${name}" が見つかりません。`);
    }
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: "#38bdf8",
    showSpinner: false,
  },
});

