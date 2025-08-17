"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ToastKind = "success" | "error" | "info";
type ToastItem = {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
};

// ❶ グローバル発火API（どこからでも使える）
export function toastSuccess(title: string, message?: string) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: { kind: "success", title, message } }));
}
export function toastError(title: string, message?: string) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: { kind: "error", title, message } }));
}
export function toastInfo(title: string, message?: string) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: { kind: "info", title, message } }));
}

// ❷ Provider（#toast-root にポータル描画）
export function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let idSeq = 1;
    const onToast = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { kind: ToastKind; title: string; message?: string };
      const item: ToastItem = { id: idSeq++, kind: detail.kind, title: detail.title, message: detail.message };
      setItems((prev) => [...prev, item]);
      // 自動で4秒後に消える
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== item.id)), 4000);
    };
    window.addEventListener("app:toast", onToast as EventListener);
    return () => {
      window.removeEventListener("app:toast", onToast as EventListener);
    };
  }, []);

  const body = (
    <div className="fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-xl p-3 shadow-lg text-white animate-in fade-in slide-in-from-top-2",
            t.kind === "success" ? "bg-emerald-600" : t.kind === "info" ? "bg-slate-700" : "bg-rose-600",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="font-semibold">{t.title}</div>
          {t.message ? <div className="text-sm opacity-90">{t.message}</div> : null}
        </div>
      ))}
    </div>
  );

  if (!mounted) return null;

  const root = typeof document !== "undefined" ? document.getElementById("toast-root") : null;
  return root ? createPortal(body, root) : body;
}
