# Memo App (Next.js 15 + Supabase)

本リポジトリは、Next.js (App Router) と Supabase を用いたメモアプリです。
チャット風の開発フローで実装し、RLS/認証/CRUD/検索/オートセーブ/Skeleton/トースト/エラーバウンダリを備えています。

## 構成
- Next.js 15 (Turbopack) / TypeScript / Tailwind CSS / ESLint + Prettier
- Supabase Auth / Postgres (RLS: 所有者のみ閲覧・編集)
- デプロイ: Vercel

## 環境変数
`.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```
Vercelの **Environment Variables** にも同値を設定（Preview/Production）。

## 開発
```bash
npm i
npm run dev
# http://localhost:3000
```

## ビルド
```bash
npm run build
npm start
```

## 主要機能
- 認証 (/login) : ログイン/サインアップ（失敗時はトースト通知）
- メモ (/memos) : 一覧/検索（title & content, ilike, デバウンス）
- 編集 (/memos/[id]) : 1秒デバウンスのオートセーブ、削除（確認ダイアログ＋成功/失敗トースト）
- RLS : 自ユーザーのみメモの参照・更新・削除が可能
- UI : Skeleton ローディング、グローバルトースト、エラーバウンダリ（`app/error.tsx`, `app/memos/error.tsx`, `app/not-found.tsx`）

## 動作確認のポイント
- 取得失敗（一覧）: DevTools Networkを Offline → `/memos` → **「メモの取得に失敗しました」**
- 保存失敗（編集）: `/memos/[id]` を表示 → Offline → 入力を止めて1秒 → **「保存に失敗しました」**
- 認証失敗: `/login` で誤パスワード → **「ログインに失敗しました」**
- 404: `/nope` → not-found 画面

## セキュリティ
- Supabase RLS で `user_id = auth.uid()` のみアクセス許可
- Production のサイトURL/リダイレクトURLを Supabase Auth 設定へ反映

## デプロイ
- `main` へ push → Vercel Production デプロイ
- 必要に応じて不要プロジェクトを削除（Settings → Danger Zone）

## ライセンス
MIT