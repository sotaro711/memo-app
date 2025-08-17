import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">ページが見つかりません</h1>
      <p className="text-gray-600">
        URL が間違っているか、削除された可能性があります。
      </p>
      <div>
        <Link
          href="/memos"
          className="inline-block rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          メモ一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
