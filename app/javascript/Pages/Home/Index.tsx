import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { HomeIndexProps } from "../../types";
import FlashMessage from "../../Components/Common/FlashMessage";
import { useFlashMessage } from "../../Hooks/useFlashMessage";

export default function HomeIndex({ links }: HomeIndexProps) {
  const { app } = usePage<HomeIndexProps>().props;
  const { notice, alert } = useFlashMessage();

  return (
    <>
      <Head title="ホーム" />
      <div className="min-h-screen bg-slate-950 pb-16 text-slate-100">
        <header className="bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-wide text-sky-400">{app?.name}</p>
            <h1 className="text-3xl font-semibold text-slate-50">機能ハブ</h1>
            <p className="text-sm text-slate-400">
              Inertia.js + Rails の各機能へアクセスできます。必要なカードをクリックしてください。
            </p>
          </div>
        </header>

        <main className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <FlashMessage notice={notice} alert={alert} />

          <section className="grid gap-6 md:grid-cols-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 transition hover:border-sky-500/60 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <div className="flex items-start gap-4">
                  {link.icon && (
                    <span className="text-3xl transition group-hover:scale-110" aria-hidden="true">
                      {link.icon}
                    </span>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-50 group-hover:text-sky-300">
                      {link.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">{link.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-sky-400">
                  <span>機能へ移動</span>
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}

