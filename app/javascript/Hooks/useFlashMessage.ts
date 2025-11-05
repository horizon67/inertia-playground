import { usePage } from "@inertiajs/react";
import { SharedProps } from "../types";

export function useFlashMessage() {
  const { flash = {} } = usePage<SharedProps>().props;

  return {
    notice: flash.notice,
    alert: flash.alert,
  };
}

