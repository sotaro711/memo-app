"use client";
import React, { useEffect } from "react";
import { ToastProvider, useToast } from "../components/Toast";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // グローバルエラーは layout をバイパスするため、ここでも Provider を張る
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-white text-gray-900 antialiased">
        <ToastProvider>
          <ErrorBody error={error} reset={reset} />
        </ToastProvider>
        <div id="toast-root" />
      </body>
    </html>
  );
}

function ErrorBody({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { error: pushError } = useToast();
  useEffect(() => {
    // 開発中はメッセージも出す（本番はタイトルのみなどに調整可）
    pushError(
      "エラーが発生しました",
      process.env.NODE_ENV === "development" ? error.message : undefined,
      5000
    );
    // デバッグ用ログ
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error, pushError]);

  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">問題が発生しました</h1>
      <p className="text-gray-600">
        一時的な問題の可能性があります。再試行をお試しください。
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          再試行
        </button>
        <a
          href="/memos"
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          メモ一覧へ戻る
        </a>
      </div>
      {process.env.NODE_ENV === "development" ? (
        <pre className="whitespace-pre-wrap rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
          {String(error.stack || error.message)}
        </pre>
      ) : null}
    </div>
  );
}
