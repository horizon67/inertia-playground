import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import FlashMessage from "../../Components/Common/FlashMessage";
import { useFlashMessage } from "../../Hooks/useFlashMessage";
import { formatDate } from "../../Utils/formatDate";
import { Receipt, ReceiptsIndexProps } from "../../types";

type ReceiptFormState = {
  image: File | null;
};

const currencyFormatter = (currency: string | null | undefined) => {
  try {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: currency || "JPY",
      maximumFractionDigits: 0,
    });
  } catch {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    });
  }
};

export default function ReceiptsIndex({ receipts = [] }: ReceiptsIndexProps) {
  const { app } = usePage<ReceiptsIndexProps>().props;
  const { notice, alert } = useFlashMessage();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, setData, post, processing, progress, reset, errors, setError, clearErrors } =
    useForm<ReceiptFormState>({
      image: null,
    });

  useEffect(() => {
    if (!data.image) {
      setPreviewUrl(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(data.image);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [data.image]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    setData("image", file);
    clearErrors("image");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.image) {
      setError("image", "レシート画像を選択してください。");
      return;
    }

    post("/receipts", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setPreviewUrl(null);
      },
    });
  };

  const hasReceipts = receipts.length > 0;

  return (
    <>
      <Head title="レシート解析" />
      <div className="min-h-screen bg-slate-950 pb-16 text-slate-100">
        <header className="bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-wide text-sky-400">{app?.name}</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-50">レシート解析</h1>
              <p className="text-sm text-slate-400">
                レシート画像をアップロードすると、RubyLLM が内容を構造化して保存します。
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 text-right text-sm text-slate-400 sm:items-end">
              <span>モデル: gpt-4.1</span>
              <span>Powered by RubyLLM</span>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <FlashMessage notice={notice} alert={alert} />

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/50">
            <h2 className="text-lg font-medium text-slate-100">レシートをアップロード</h2>
            <p className="mt-1 text-sm text-slate-400">
              画像ファイル（PNG / JPG / JPEG / WebP）を選択してください。
            </p>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="receipt-image"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  レシート画像
                </label>
                <input
                  id="receipt-image"
                  name="receipt[image]"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full cursor-pointer rounded-md border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 shadow-sm transition hover:border-sky-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                {(errors.image as string | undefined) && (
                  <p className="mt-2 text-sm text-rose-300">{errors.image}</p>
                )}
              </div>

              {previewUrl && (
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
                  <img
                    src={previewUrl}
                    alt="アップロードプレビュー"
                    className="max-h-96 w-full object-contain"
                  />
                </div>
              )}

              {progress && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span>{progress.percentage}%</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center rounded-md bg-sky-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing ? "解析中..." : "解析して保存"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setPreviewUrl(null);
                    clearErrors();
                  }}
                  className="text-sm text-slate-400 transition hover:text-slate-200"
                  disabled={processing}
                >
                  リセット
                </button>
              </div>
            </form>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-100">解析履歴</h2>
              <span className="text-sm text-slate-400">{receipts.length} 件</span>
            </div>

            {!hasReceipts ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
                まだ解析済みのレシートはありません。レシート画像をアップロードして解析を開始してください。
              </div>
            ) : (
              <div className="space-y-6">
                {receipts.map((receipt) => (
                  <ReceiptCard key={receipt.id} receipt={receipt} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

type ReceiptCardProps = {
  receipt: Receipt;
};

function ReceiptCard({ receipt }: ReceiptCardProps) {
  const formatter = useMemo(() => currencyFormatter(receipt.currency), [receipt.currency]);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-lg shadow-slate-950/40 transition hover:border-sky-500/60">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-slate-50">
                {receipt.store_name || "不明な店舗"}
              </h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                #{receipt.id}
              </span>
              {receipt.model && (
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">
                  {receipt.model}
                </span>
              )}
              {typeof receipt.confidence_score === "number" && (
                <ConfidenceBadge
                  level={receipt.confidence_level}
                  label={receipt.confidence_level_label}
                  score={receipt.confidence_score}
                />
              )}
            </div>
            <p className="mt-1 text-sm text-slate-400">
              解析日時: {formatDate(receipt.created_at)} / 取引日時:{" "}
              {receipt.transaction_at_label || receipt.transaction_at_raw || "不明"}
            </p>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <InfoItem label="合計金額" value={formatAmount(formatter, receipt.total_amount)} />
            <InfoItem label="税額" value={formatAmount(formatter, receipt.tax_amount)} />
            <InfoItem label="通貨" value={receipt.currency_label || receipt.currency || "不明"} />
            <InfoItem label="支払方法" value={receipt.payment_method || "不明"} />
          </div>

          <ConfidenceScoreSection receipt={receipt} />

          <div>
            <h4 className="text-sm font-semibold text-slate-200">明細</h4>
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">品目</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">数量</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">単価</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">小計</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {receipt.line_items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-3 text-center text-slate-500" colSpan={4}>
                        明細情報がありません。
                      </td>
                    </tr>
                  ) : (
                    receipt.line_items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-slate-100">{item.name || "不明な品目"}</td>
                        <td className="px-4 py-2 text-right text-slate-200">
                          {item.quantity ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-200">
                          {formatAmount(formatter, item.unit_price)}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-200">
                          {formatAmount(formatter, item.subtotal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {receipt.raw_text && (
            <details className="group mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
              <summary className="cursor-pointer font-semibold text-slate-200 transition group-open:text-sky-300">
                解析結果テキストを表示
              </summary>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-xs text-slate-400">
                {receipt.raw_text}
              </pre>
            </details>
          )}
        </div>

        {receipt.image_url && (
          <div className="relative rounded-xl border border-slate-800 bg-slate-900/60">
            <img
              src={receipt.image_url}
              alt={`${receipt.store_name || "レシート"}の画像`}
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
        )}
      </div>
    </article>
  );
}

type ConfidenceBadgeProps = {
  level: Receipt["confidence_level"];
  label?: string | null;
  score: number;
};

function ConfidenceBadge({ level, label, score }: ConfidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getConfidenceClasses(level)}`}
    >
      <span>{label || "信頼度"}</span>
      <span className="text-sm">{score.toFixed(1)}%</span>
    </span>
  );
}

type ConfidenceScoreSectionProps = {
  receipt: Receipt;
};

function ConfidenceScoreSection({ receipt }: ConfidenceScoreSectionProps) {
  if (receipt.confidence_score == null) {
    return null;
  }

  const breakdownEntries = Object.entries(receipt.confidence_score_breakdown ?? {});
  const metadata = (receipt.analysis_metadata ?? {}) as Record<string, unknown>;
  const durationValue = metadata.duration_seconds;
  const duration =
    typeof durationValue === "number"
      ? durationValue
      : typeof durationValue === "string" && durationValue.trim() !== ""
        ? Number(durationValue)
        : null;
  const model = typeof metadata.model === "string" ? metadata.model : null;
  const promptTemplateName = receipt.prompt_template_name;
  const promptTemplateId =
    typeof metadata.prompt_template_id === "number" ? metadata.prompt_template_id : receipt.prompt_template_id;

  return (
    <section className="mt-4 space-y-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">解析信頼度</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-slate-50">{receipt.confidence_score.toFixed(1)}%</span>
            <ConfidenceBadge level={receipt.confidence_level} label={receipt.confidence_level_label} score={receipt.confidence_score} />
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-400">
            {promptTemplateName && <p>プロンプト: {promptTemplateName}</p>}
            {model && <p>モデル: {model}</p>}
            {Number.isFinite(duration) && duration !== null && <p>解析時間: {duration.toFixed(2)} 秒</p>}
          </div>
        </div>
        {(promptTemplateId || duration !== null || model) && (
          <div className="space-y-1 text-right text-xs text-slate-400">
            {promptTemplateId && <p>テンプレートID: {promptTemplateId}</p>}
            {receipt.chat_id && <p>Chat ID: {receipt.chat_id}</p>}
          </div>
        )}
      </div>

      {breakdownEntries.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {breakdownEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3 transition hover:border-sky-500/40"
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">{confidenceMetricLabel(key)}</p>
              <p className="mt-1 text-lg font-semibold text-slate-100">{value}点</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-100">{value}</p>
    </div>
  );
}

function formatAmount(formatter: Intl.NumberFormat, value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }

  try {
    return formatter.format(value);
  } catch {
    return value.toString();
  }
}

function getConfidenceClasses(level: Receipt["confidence_level"]): string {
  switch (level) {
    case "high":
      return "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200";
    case "medium":
      return "border border-amber-500/40 bg-amber-500/15 text-amber-200";
    case "low":
      return "border border-orange-500/40 bg-orange-500/15 text-orange-200";
    case "very_low":
      return "border border-rose-500/40 bg-rose-500/15 text-rose-200";
    default:
      return "border border-slate-700 bg-slate-800/70 text-slate-300";
  }
}

function confidenceMetricLabel(key: string): string {
  const labels: Record<string, string> = {
    store_name: "店舗名の有無",
    total_amount: "合計金額の有無",
    transaction_at: "取引日時の有無",
    amount_consistency: "金額の整合性",
    line_items_completeness: "明細の充実度",
    tax_validity: "税額の妥当性",
  };

  return labels[key] || key;
}

