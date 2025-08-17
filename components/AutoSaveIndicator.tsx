'use client';

import { useMemo } from 'react';

type Props = {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt?: Date | null;
};

export default function AutoSaveIndicator({ status, lastSavedAt }: Props) {
  const text = useMemo(() => {
    switch (status) {
      case 'saving':
        return '保存中…';
      case 'saved':
        return lastSavedAt ? `保存済み（${lastSavedAt.toLocaleTimeString()}）` : '保存済み';
      case 'error':
        return '保存エラー';
      default:
        return '編集中';
    }
  }, [status, lastSavedAt]);

  const dot =
    status === 'saving'
      ? 'animate-pulse bg-yellow-500'
      : status === 'saved'
      ? 'bg-green-500'
      : status === 'error'
      ? 'bg-red-500'
      : 'bg-gray-400';

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
      <span>{text}</span>
    </div>
  );
}
