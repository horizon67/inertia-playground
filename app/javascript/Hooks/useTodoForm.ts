import { useForm } from "@inertiajs/react";
import { useEffect, FormEventHandler } from "react";
import { TodoFormData } from "../types";

const emptyForm: TodoFormData = { title: "", description: "" };

export function useTodoForm(initialForm: TodoFormData | null = null) {
  const defaults = initialForm ? { ...emptyForm, ...initialForm } : emptyForm;
  const form = useForm(defaults);

  useEffect(() => {
    form.setData({
      title: defaults.title ?? "",
      description: defaults.description ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults.title, defaults.description]);

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    form.post("/todos", {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return {
    ...form,
    handleSubmit,
  };
}

