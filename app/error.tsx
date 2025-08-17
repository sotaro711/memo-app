// app/error.tsx
"use client";
import React from "react";
import Link from "next/link";
import { ToastProvider } from "../components/Toast";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <ToastProvider />
        <main className="mx-auto max-w-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">エラーが発生しました</h2>
          <p className="text-sm text-slate-600">{error?.message ?? "Unknown error"}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => reset()}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              再試行
            </button>
            <Link href="/memos" className="underline">
              一覧へ戻る
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
