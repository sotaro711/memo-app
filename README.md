# Memo App

Next.js 15 + Supabase で構築されたメモアプリケーションです。オートセーブ、検索機能、認証システムを備えています。

## 機能

- 🔐 **認証システム**: Supabase Auth (メール認証)
- 📝 **メモ管理**: CRUD操作、オートセーブ機能
- 🔍 **検索機能**: タイトル・本文の横断検索
- 🛡️ **セキュリティ**: Row Level Security (RLS) による権限制御
- 📱 **レスポンシブ**: モバイル対応UI

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

これらの値は Supabase プロジェクトの **Settings → API** から取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## デプロイ

このプロジェクトは Vercel での自動デプロイに対応しています。

1. GitHub リポジトリに push
2. Vercel で GitHub リポジトリをインポート
3. 環境変数を設定 (Production & Preview)
4. Supabase の Site URL を本番URLに設定

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **スタイリング**: Tailwind CSS 4
- **バックエンド**: Supabase
- **認証**: Supabase Auth
- **デプロイ**: Vercel
- **言語**: TypeScript

## 主要なファイル構成

```
app/
├── login/page.tsx           # ログインページ
├── memos/
│   ├── layout.tsx          # 認証ガード + ヘッダー
│   ├── page.tsx            # メモ一覧 (検索機能付き)
│   ├── new/page.tsx        # 新規メモ作成
│   └── [id]/page.tsx       # メモ詳細・編集
components/
├── AuthGuard.tsx           # 認証ガード
├── AppHeader.tsx           # アプリケーションヘッダー
├── SearchBar.tsx           # 検索バー
└── AutoSaveIndicator.tsx   # オートセーブ状態表示
lib/
└── supabaseClient.ts       # Supabase クライアント設定
```

## 環境変数設定例

`.env.local.example`:
```bash
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```