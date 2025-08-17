'use client'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthForm() {
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setMsg(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        location.href = '/memos'
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('確認メールを送信しました。メール確認後にログインしてください。')
      }
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-xl font-bold">{mode==='signin' ? 'ログイン' : 'サインアップ'}</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email"
               value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)} required/>
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password"
               value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} required/>
        <button className="w-full border rounded px-3 py-2" disabled={loading}>
          {loading ? '送信中…' : (mode==='signin' ? 'ログイン' : '登録')}
        </button>
      </form>
      <button className="text-sm underline" onClick={(e: React.MouseEvent<HTMLButtonElement>) => setMode(mode==='signin'?'signup':'signin')}>
        {mode==='signin' ? 'アカウント作成へ' : 'ログインへ戻る'}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  )
}
