'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toastError } from '@/components/Toast';
export default function NewMemo() {
  const r = useRouter();
  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      const user_id = user.user?.id;
      if (!user_id) return r.replace('/login');
      const { data, error } = await supabase
        .from('memos')
        .insert({ title: '', content: '', user_id })
        .select('id')
        .single();
      if (error || !data) {
        toastError('メモの作成に失敗しました', error?.message);
        return r.replace('/memos');
      }
      r.replace(`/memos/${data.id}`);
    })();
  }, [r]);
  return null;
}