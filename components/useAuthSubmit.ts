"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

function pick(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
}
function formatAuthError(e: unknown): string {
  if (!e) return "不明なエラー";
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === "string") return e;
  const parts = ["message", "code", "details", "hint"]
    .map((k) => pick(e, k))
    .filter((v): v is string => typeof v === "string");
  return parts.length ? parts.join(" | ") : JSON.stringify(e);
}

export function useAuthSubmit() {
  const router = useRouter();
  const { error: toastError, success } = useToast();

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toastError("ログインに失敗しました", formatAuthError(error));
      return { ok: false as const, data: null as typeof data };
    }
    router.push("/memos");
    return { ok: true as const, data };
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
      },
    });
    if (error) {
      toastError("サインアップに失敗しました", formatAuthError(error));
      return { ok: false as const, data: null as typeof data };
    }
    success("確認メールを送信しました");
    return { ok: true as const, data };
  }

  return { signIn, signUp };
}
