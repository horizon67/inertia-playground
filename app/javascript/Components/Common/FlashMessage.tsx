import React from "react";

interface FlashMessageProps {
  notice?: string;
  alert?: string;
}

export default function FlashMessage({ notice, alert }: FlashMessageProps) {
  return (
    <>
      {notice && (
        <div className="mt-4 rounded-md border border-sky-500/50 bg-sky-500/10 px-4 py-2 text-sm text-sky-100">
          {notice}
        </div>
      )}
      {alert && (
        <div className="mt-4 rounded-md border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
          {alert}
        </div>
      )}
    </>
  );
}

