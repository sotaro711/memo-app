"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/Toast";

export default function DeleteButton({ memoId, className }: { memoId: string; className?: string }) {
  const router = useRouter();
  const { success, error } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (deleting) return;
    if (!confirm("このメモを削除します。よろしいですか？")) return;
    setDeleting(true);
    try {
      const { error: e } = await supabase.from("memos").delete().eq("id", memoId);
      if (e) throw e;
      success("削除しました");
      router.push("/memos");
    } catch (e: unknown) {
      error("削除に失敗しました", e instanceof Error ? e.message : undefined);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={deleting}
      className={className ?? "rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"}
    >
      {deleting ? "削除中..." : "削除"}
    </button>
  );
}
