import { usePage } from "@inertiajs/react";

export function useFlashMessage() {
  const { flash = {} } = usePage().props;

  return {
    notice: flash.notice,
    alert: flash.alert,
  };
}

