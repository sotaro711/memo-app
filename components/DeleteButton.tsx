"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toastError, toastSuccess } from "@/components/Toast";

export default function DeleteButton({
  memoId,
  className = "",
}: { memoId: string; className?: string }) {
  const router = useRouter();

  const onClick = async () => {
    const ok = window.confirm("このメモを削除します。よろしいですか？");
    if (!ok) return;
    try {
      const { error } = await supabase.from("memos").delete().eq("id", memoId);
      if (error) throw error;
      toastSuccess("削除しました");
      router.push("/memos");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toastError("削除に失敗しました", msg);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 hover:bg-gray-50 ${className}`}
    >
      削除
    </button>
  );
}
