// components/DevNetworkHint.tsx
"use client";
import { useEffect, useState } from "react";

const IS_DEV = process.env.NODE_ENV !== "production";

export default function DevNetworkHint() {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!IS_DEV) return null; // ← 条件分岐はレンダリングで。Hookは常に上で呼ぶ
  return (
    <div className="fixed bottom-3 left-3 rounded bg-black/70 px-3 py-1 text-xs text-white">
      {online ? "Online" : "Offline（DevToolsで切替中）"}
    </div>
  );
}
