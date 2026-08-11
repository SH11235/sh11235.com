# sh11235.com

SH11235 のホームページ。将棋関連の自作ソフトウェア (rshogi / CSA 対局インフラ / ラム将棋 / tatara / nnue-lab) をドリルダウン相関図で一瞥できる。

Astro の静的出力を Cloudflare Workers (static assets) で配信する。

## 構成

- `src/pages/index.astro` — トップ (相関図 + 一瞥カード)
- `src/components/Drilldown.astro` — ドリルダウン相関図 (全体 → rshogi crates → tools パイプライン)。vanilla JS + SVG、スプリング遷移
- `src/content/articles/*.md` — 記事。frontmatter (`title` / `date` / `description?`) 付き markdown を置いて push すると一覧と詳細ページが生成される
- `src/styles/global.css` — デザイントークン (胡粉白 / 墨 / 黄楊 / 朱) と全スタイル

## 開発

```sh
pnpm install
pnpm dev
```

## デプロイ

main への push で GitHub Actions が build + `wrangler deploy` する
(repository secrets: `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`)。手動なら:

```sh
pnpm deploy
```

## 記事の追加

```sh
cat > src/content/articles/my-post.md << 'MD'
---
title: 記事タイトル
date: 2026-08-11
---
本文 (markdown)
MD
git add . && git commit && git push   # → CD で https://sh11235.com/articles/my-post/ が生える
```
