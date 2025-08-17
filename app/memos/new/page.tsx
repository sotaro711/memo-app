'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';

export default function MemoNewPage() {
  const router = useRouter();

  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 入力が空なら保存しない。初回は INSERT、以後 UPDATE
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    setStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        if (!id) {
          const { data, error } = await supabase
            .from('memos')
            .insert({ title, content })
            .select('id')
            .single<{ id: string }>();

          if (error || !data?.id) throw error ?? new Error('failed to insert');
          setId(data.id);
        } else {
          const { error } = await supabase
            .from('memos')
            .update({ title, content })
            .eq('id', id);
          if (error) throw error;
        }

        setStatus('saved');
        setLastSavedAt(new Date());
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [title, content, id]);

  const goDetail = () => {
    if (id) router.push(`/memos/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">新規メモ（自動保存）</h1>
        <AutoSaveIndicator status={status} lastSavedAt={lastSavedAt} />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-gray-600">タイトル</label>
        <input
          className="w-full rounded-xl border p-3 outline-none focus:ring"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm text-gray-600">本文</label>
        <textarea
          className="h-[50vh] w-full rounded-xl border p-3 outline-none focus:ring"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="本文を入力"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/memos')}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          ← 一覧へ
        </button>

        <button
          onClick={goDetail}
          disabled={!id}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          title={id ? '保存済みの詳細ページへ' : 'まずは入力して自動保存を完了させてください'}
        >
          詳細ページへ →
        </button>
      </div>
    </div>
  );
}