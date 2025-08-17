'use client';

import { use } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';

type MemoRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function MemoEditPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: params は Promise。React.use() で unwrap
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(false);

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初期読み込み
  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('memos')
        .select('id,title,content,updated_at')
        .eq('id', id)
        .single<MemoRow>();
      if (!active) return;
      if (error) {
        console.error(error);
        setStatus('error');
        return;
      }
      setTitle(data?.title ?? '');
      setContent(data?.content ?? '');
      setLoaded(true);
      setStatus('idle');
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // デバウンス付きオートセーブ（1秒）
  useEffect(() => {
    if (!loaded) return;

    setStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const { error } = await supabase.from('memos').update({ title, content }).eq('id', id);
      if (error) {
        console.error(error);
        setStatus('error');
      } else {
        setStatus('saved');
        setLastSavedAt(new Date());
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [title, content, id, loaded]);

  const handleDelete = async () => {
    const ok = window.confirm('このメモを削除しますか？');
    if (!ok) return;
    const { error } = await supabase.from('memos').delete().eq('id', id);
    if (error) {
      alert('削除に失敗しました');
      console.error(error);
      return;
    }
    router.push('/memos');
  };

  const headerTitle = useMemo(() => (title?.trim() ? title : '無題のメモ'), [title]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{headerTitle}</h1>
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
          onClick={handleDelete}
          className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          削除
        </button>
      </div>
    </div>
  );
}
