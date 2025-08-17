'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Logout() {
  const r = useRouter();
  useEffect(() => { supabase.auth.signOut().finally(() => r.replace('/login')); }, [r]);
  return null;
}
