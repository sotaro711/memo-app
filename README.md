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