"use client";
import { useEffect, useState } from "react";

export default function DevNetworkHint() {
  if (process.env.NODE_ENV !== "development") return null;
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (online) return null;
  return (
    <div className="fixed top-4 right-4 z-[70] rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 shadow">
      DevTools の Network が <b>Offline</b> か回線が切断されています。<br />
      検証が終わったら <b>No throttling（Online）</b> に戻してください。
    </div>
  );
}
