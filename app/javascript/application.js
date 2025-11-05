import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

const appName = "Inertia Playground";
import TodosIndex from "./Pages/Todos/Index.jsx";

const pages = {
  "Todos/Index": TodosIndex,
};

createInertiaApp({
  title: (title) => (title ? `${title} | ${appName}` : appName),
  resolve: (name) => {
    const page = pages[name];
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
