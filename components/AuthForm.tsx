/* eslint-disable react/button-has-type */
"use client";
import React, { FormEvent, useState } from "react";
// 同じフォルダ内の相対パスに変更して解決を安定化
import { useAuthSubmit } from "./useAuthSubmit";

export default function AuthForm() {
  const { signIn, signUp } = useAuthSubmit();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="flex rounded-xl border p-1">
        <button
          className={`flex-1 rounded-lg px-3 py-2 text-sm ${
            mode === "login" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
          }`}
          onClick={() => setMode("login")}
        >
          ログイン
        </button>
        <button
          className={`flex-1 rounded-lg px-3 py-2 text-sm ${
            mode === "signup" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
          }`}
          onClick={() => setMode("signup")}
        >
          サインアップ
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border p-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">メールアドレス</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="w-full rounded-xl border p-3 outline-none focus:ring"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">パスワード</label>
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="w-full rounded-xl border p-3 outline-none focus:ring"
            placeholder="•••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "送信中..." : mode === "login" ? "ログイン" : "サインアップ"}
        </button>

        {mode === "signup" ? (
          <p className="pt-1 text-xs text-gray-500">
            登録後、メールの確認リンクからログインしてください。
          </p>
        ) : null}
      </form>
    </div>
  );
}
