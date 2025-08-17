// components/AuthForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSubmit } from "./useAuthSubmit";
import { toastInfo, toastSuccess } from "./Toast";

export default function AuthForm() {
  const { signIn, signUp } = useAuthSubmit();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "login") {
        const { user, session } = await signIn(email, password);
        if (user || session) {
          toastSuccess("ログインしました");
          router.replace("/memos");
          return;
        }
        // 失敗時は useAuthSubmit 側で toastError 済み
      } else {
        const { user, session } = await signUp(email, password);
        if (session || user) {
          // メール確認OFFのプロジェクトはそのまま入れる
          toastSuccess("サインアップに成功しました");
          router.replace("/memos");
        } else {
          // メール確認ONの場合はセッションが無い
          toastInfo("確認メールを送信しました", "メール内のリンクで有効化してください");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 p-4">
      <h1 className="text-xl font-semibold">{mode === "login" ? "ログイン" : "サインアップ"}</h1>
      <input
        className="w-full rounded border p-2"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full rounded border p-2"
        placeholder="••••••••"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60">
        {loading ? "送信中…" : "送信"}
      </button>
      <div className="text-sm">
        {mode === "login" ? (
          <button type="button" className="underline" onClick={() => setMode("signup")}>
            新規登録へ
          </button>
        ) : (
          <button type="button" className="underline" onClick={() => setMode("login")}>
            ログインへ
          </button>
        )}
      </div>
    </form>
  );
}
