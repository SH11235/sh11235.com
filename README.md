# sh11235.com

SH11235 のホームページ。将棋関連の自作ソフトウェア (rshogi / CSA 対局インフラ / ラム将棋 / tatara / nnue-lab) を相関図で一瞥できる 1 ページ構成。

静的 HTML 1 枚を Cloudflare Workers (static assets) で配信する。ビルド工程なし。

## 開発

```sh
npx wrangler dev
```

## デプロイ

```sh
npx wrangler deploy
```
