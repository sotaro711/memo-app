"use client";
import React from "react";

export default function MemosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Toast は ToastGlobalEvents で一元管理（ここでは重複させない）
  // eslint-disable-next-line no-console
  console.error(error);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">メモの読み込みに失敗しました</h2>
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
          一覧へ戻る
        </a>
      </div>
    </div>
  );
}
