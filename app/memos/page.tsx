'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import SearchBar from '@/components/SearchBar';
import { useToast } from '@/components/Toast';

type MemoListItem = {
  id: string;
  title: string | null;
  content: string | null;
  updated_at: string | null;
};

export default function MemosPage() {
  const { error: toastError } = useToast();
  const [query, setQuery] = useState('');
  const [memos, setMemos] = useState<MemoListItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMemos = async (q: string) => {
    setLoading(true);
    try {
      // タイトル or 本文に部分一致（大文字小文字無視）
      // Supabaseの or フィルタはカンマ区切りで条件を列挙
      const like = `%${q.replace(/%/g, '').replace(/_/g, '')}%`;
      let req = supabase
        .from('memos')
        .select('id,title,content,updated_at')
        .order('updated_at', { ascending: false });

      if (q) {
        req = req.or(`title.ilike.${like},content.ilike.${like}`);
      }

      const { data, error } = await req;
      if (error) throw error;
      setMemos(data ?? []);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : undefined;
      toastError('メモの取得に失敗しました', msg);
      setMemos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos('');
  }, []);

  useEffect(() => {
    fetchMemos(query);
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">あなたのメモ</h1>
        <Link
          href="/memos/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar onChange={setQuery} />
        {query && (
          <p className="mt-2 text-sm text-gray-500">
            検索キーワード: <span className="font-medium">{query}</span>
          </p>
        )}
        {!loading && memos && (
          <p className="mt-1 text-xs text-gray-500">{memos.length}件</p>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        </div>
      )}

      {!loading && memos && memos.length === 0 && (
        <p className="text-gray-600">該当するメモがありません。</p>
      )}

      {!loading && memos && memos.length > 0 && (
        <ul className="space-y-4">
          {memos.map((m) => (
            <li key={m.id}>
              <Link
                href={`/memos/${m.id}`}
                className="block rounded-2xl border p-4 hover:bg-gray-50"
              >
                <div className="line-clamp-1 text-lg font-semibold">{m.title || '無題'}</div>
                <div className="line-clamp-1 text-sm text-gray-500">
                  {m.updated_at ? new Date(m.updated_at).toLocaleString() : ''}
                </div>
                {query && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{m.content}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
