'use client';

import type { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AppHeader from '@/components/AppHeader';

export default function MemosLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </AuthGuard>
  );
}
