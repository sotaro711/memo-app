"use client";
import { use as usePromise, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import { type PostgrestError } from "@supabase/supabase-js";
import { toastError } from "@/components/Toast";
import { supabase } from "@/lib/supabaseClient";
import DeleteButton from "@/components/DeleteButton";

type Memo = {
  id: string;
  title: string | null;
  content: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

function formatSupabaseError(err: unknown): string {
  const e = err as Partial<PostgrestError> | undefined;
  const parts = [e?.code, e?.message, e?.details, e?.hint].filter(Boolean);
  return parts.length ? parts.join(" / ") : String(err);
}

// Next.js 15: params は Promise なので use(params) で取り出す
export default function MemoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false); // 日付表示のHydration対策

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  // 初期読み込み
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("memos")
          .select("id,title,content,created_at,updated_at")
          .eq("id", id)
          .single<Pick<Memo, "id" | "title" | "content" | "created_at" | "updated_at">>();
        if (error) throw error;
        if (data) {
          setTitle(data.title ?? "");
          setContent(data.content ?? "");
          setCreatedAt(data.created_at);
          setUpdatedAt(data.updated_at);
        }
      } catch (e: unknown) {
        toastError("メモの読み込みに失敗しました", formatSupabaseError(e));
      }
    })();
    // `toastError` は外部の安定関数なので依存不要
  }, [id]);

  // Hydration差分を避ける：マウント後のみローカル時刻に変換
  useEffect(() => setMounted(true), []);

  // オートセーブ
  useEffect(() => {
    if (!id) return;
    const h = setTimeout(async () => {
      try {
        setSaving(true);
        const { error } = await supabase.from("memos").update({ title, content }).eq("id", id);
        if (error) throw error;
      } catch (e: unknown) {
        toastError("保存に失敗しました", formatSupabaseError(e));
      } finally {
        setSaving(false);
      }
    }, 1000);
    return () => clearTimeout(h);
    // `toastError` は外部の安定関数なので依存不要
  }, [id, title, content]);

  return (
    <main className="mx-auto max-w-3xl p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/memos" className="text-sm underline hover:opacity-80">
            ← メモ一覧へ戻る
          </Link>
          <h1 className="text-xl font-semibold">メモ編集</h1>
        </div>
        <div className="flex items-center gap-3">
          {saving ? <span className="text-sm opacity-70">保存中...</span> : null}
          <DeleteButton memoId={id} />
        </div>
      </div>

      <p className="text-sm text-slate-500">
        作成: <span className="ml-1">{createdAt ? (mounted ? new Date(createdAt).toLocaleString() : createdAt) : "-"}</span>
        <span className="mx-2">/</span>
        最終更新:{" "}
        <span className="ml-1">{updatedAt ? (mounted ? new Date(updatedAt).toLocaleString() : updatedAt) : "-"}</span>
      </p>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="タイトル"
        value={title}
        onChange={onTitleChange}
      />
      <textarea
        className="w-full h-72 rounded-lg border p-3"
        placeholder="内容"
        value={content}
        onChange={onContentChange}
      />
    </main>
  );
}
