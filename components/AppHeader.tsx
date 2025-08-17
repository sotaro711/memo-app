'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AppHeader() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="/memos" className="text-lg font-semibold">Memo App</a>
        <button
          onClick={logout}
          className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
