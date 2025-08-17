"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/**
 * Usage:
 *  const { success, error, info, warning, push } = useToast();
 *  success("保存しました");
 *  error("保存に失敗しました", "ネットワークを確認してください");
 */

type Variant = "default" | "success" | "error" | "warning" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: Variant;
  duration?: number; // ms
};

type ToastItem = ToastInput & { id: string; createdAt: number };

type ToastContextValue = {
  push: (t: ToastInput) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function clsx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function ToastCard({ t, onClose }: { t: ToastItem; onClose: (id: string) => void }) {
  const { id, title, description, variant = "default" } = t;
  const base =
    "pointer-events-auto w-full sm:w-96 rounded-xl shadow-lg p-3 sm:p-4 border text-sm sm:text-base";
  const palette: Record<Variant, string> = {
    default: "bg-white/90 backdrop-blur border-gray-200 text-gray-900",
    success: "bg-white/90 backdrop-blur border-emerald-200 text-emerald-900",
    error: "bg-white/90 backdrop-blur border-rose-200 text-rose-900",
    warning: "bg-white/90 backdrop-blur border-amber-200 text-amber-900",
    info: "bg-white/90 backdrop-blur border-sky-200 text-sky-900",
  };
  const barPalette: Record<Variant, string> = {
    default: "bg-gray-300",
    success: "bg-emerald-400",
    error: "bg-rose-400",
    warning: "bg-amber-400",
    info: "bg-sky-400",
  };
  return (
    <div role="status" aria-live="polite" className={clsx(base, palette[variant])}>
      <div className="flex items-start gap-3">
        <div className={clsx("mt-1 h-2 w-2 rounded-full", barPalette[variant])} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold leading-tight truncate">{title}</div>
          {description ? (
            <div className="text-gray-600 text-sm leading-snug mt-1 line-clamp-3">
              {description}
            </div>
          ) : null}
        </div>
        <button
          aria-label="Close"
          onClick={() => onClose(id)}
          className="shrink-0 rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const getContainer = () =>
    typeof document !== "undefined"
      ? (document.getElementById("toast-root") as HTMLElement | null)
      : null;

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: ToastInput) => {
      const id = crypto.randomUUID();
      const duration = t.duration ?? 3000;
      const item: ToastItem = { ...t, id, createdAt: Date.now() };
      setToasts((prev) => [item, ...prev].slice(0, 6));
      if (duration > 0) {
        window.setTimeout(() => remove(id), duration);
      }
    },
    [remove]
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      push,
      success: (title, description, duration) =>
        push({ title, description, duration, variant: "success" }),
      error: (title, description, duration) =>
        push({ title, description, duration, variant: "error" }),
      info: (title, description, duration) =>
        push({ title, description, duration, variant: "info" }),
      warning: (title, description, duration) =>
        push({ title, description, duration, variant: "warning" }),
    }),
    [push]
  );

  useEffect(() => {
    // Hydration mismatch を避けるため、マウント後にのみポータルを描画
    setIsMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {isMounted && getContainer()
        ? createPortal(
            <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 p-4 sm:p-6">
              <div className="mt-auto flex w-full flex-col items-end gap-2">
                {toasts.map((t) => (
                  <ToastCard key={t.id} t={t} onClose={remove} />
                ))}
              </div>
            </div>,
            getContainer()!
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}
