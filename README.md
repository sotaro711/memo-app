# メモアプリ（Next.js + Supabase）

- 本番URL: https://memo-4hc2u3hww-sotaros-projects-c9c9e44e.vercel.app  
- リポジトリ: https://github.com/sotaro711/memo-app  
- 技術: Next.js 15 / React 19 / TypeScript / Tailwind / Supabase / ESLint+Prettier

本人のみ CRUD 可能なメモアプリです。  
1秒停止の**オートセーブ**、**検索（デバウンス/件数/失敗は1回のみトースト）**、Skeleton/エラーページ/グローバルトーストを実装しています。

---

## 🚀 クイックスタート（ローカル）

前提: Node.js 18.18+（推奨 20 系）

```bash
npm ci
# .env.local を作成（下記の環境変数）
npm run typecheck
npm run lint
npm run dev   # http://localhost:3000
```

## `.env.local`（例）

```ini
NEXT_PUBLIC_SUPABASE_URL=＜Supabase Project URL＞
NEXT_PUBLIC_SUPABASE_ANON_KEY=＜anon public key＞
```
Vercel では Project Settings → Environment Variables に同キーを Production/Preview/Development 全てへ登録し、Redeploy してください。

## 🗄️ Supabase 初期化（1回だけ）
Supabase ダッシュボード → SQL Editor → `supabase/schema.sql` の内容を実行

- memos テーブル作成
- updated_at トリガ
- RLS 有効化 & 「本人のみ」ポリシー
- （任意）Auth → Providers → Email で Confirm email を OFF（開発を楽に）
- Auth → URL Configuration
  - Site URL に本番URL
  - Additional Redirect URLs に本番URL と http://localhost:3000 を追加

## 🧩 主な機能
- **認証**: ログイン/サインアップ/ログアウト、未ログインは /login へ
- **RLS**: 本人のみ SELECT/INSERT/UPDATE/DELETE 可能
- **一覧**: 自分のメモのみ、更新日降順、検索（title/content ilike、300ms デバウンス、件数表示）
- **新規作成**: /memos/new → 空メモ作成 → /memos/[id] へ遷移
- **編集**: タイトル/本文、入力停止 1秒で自動保存、保存中… インジケータ
- **削除**: 確認 → 成功トースト → 一覧へ
- **トースト**: toastSuccess/toastError/toastInfo のグローバルAPI（CustomEvent）
  - 検索失敗は "最新リクエストのみ + 2秒クールダウン" で1回だけ
  - Provider は CSR マウント後のみ portal（Hydration差分回避）
- **エラー体験**: Error Boundary / 404 / Skeleton

## ✅ チェックリスト準拠（要点）
- セットアップ/TypeScript/Tailwind/ESLint+Prettier … 完了
- Supabase 設定 & 環境変数 … 完了
- DB 設計（memos）& RLS … 完了
- 認証（ログイン/サインアップ/ログアウト、未ログインガード）… 完了
- メモ機能（一覧・検索・新規→編集・1秒オートセーブ・削除）… 完了
- UI/UX（レスポンシブ、Skeleton、トースト、エラーページ）… 完了
- 品質（npm run typecheck && npm run lint && npm run build 通過）… 完了
- 追加検討（タグ/共有/エクスポート/MD/音声/ダークモード）… 未実施（MVP後）

## 🔎 5分スモークテスト
- `/login`：サインアップ/ログイン → 自動で /memos
- `/memos`：一覧表示（降順）／検索入力（300ms後に再取得、件数表示）
- Offline で検索：「メモの取得に失敗しました」トーストが 1回だけ
- `/memos/new` → `/memos/[id]`：入力停止1秒で保存、「保存中…」→消える
- `/memos/[id]`：削除 → 成功トースト → 一覧へ
- RLS：別アカで他人の `/memos/[id]` 直打ち → 参照不可（トースト）

## 🛠️ スクリプト
```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "typecheck": "tsc -p tsconfig.json --noEmit"
}
```

## ライセンス / 作者
- License: MIT（必要に応じて変更）
- Author: 安藤颯太郎（GitHub: https://github.com/sotaro711）