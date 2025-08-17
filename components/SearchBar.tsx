'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  initial?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  delay?: number; // デバウンスms
};

export default function SearchBar({ initial = '', placeholder = '検索（タイトル・本文）', onChange, delay = 300 }: Props) {
  const [value, setValue] = useState(initial);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => onChange(value.trim()), delay);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [value, onChange, delay]);

  return (
    <div className="flex w-full items-center gap-2 rounded-xl border px-3 py-2">
      <input
        className="w-full outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="text-sm text-gray-500 hover:text-gray-700" onClick={() => setValue('')}>
          クリア
        </button>
      )}
    </div>
  );
}
