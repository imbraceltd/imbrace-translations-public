# imbrace-translations

Translation files for **en**, **zh**, **cn**.

Edit locally with watch mode; the public JSON files are published via **GitHub Pages**
(push to `main` deploys automatically — no S3 needed).

## Structure

```
locale/
  en/   error.json  menu.json  pages.json  ...   ← source files, split per domain
  zh/   ...
  cn/   ...
dist/
  en.json  zh.json  cn.json                       ← output: all files of each language merged
```

Each language has several JSON files split by domain. The builder merges every
`locale/<lang>/*.json` into a single `dist/<lang>.json`.

## Usage

Build once:

```bash
npm run build
```

Watch — editing any file under `locale/` rebuilds `dist/` instantly:

```bash
npm run watch
```

> Requires Node 18+ (uses built-ins only, no `npm install` needed).

## Adding / editing translations

1. Open the relevant domain file, e.g. `locale/en/menu.json`, then add or edit a key.
2. Repeat for `locale/zh/menu.json` and `locale/cn/menu.json` to keep all languages in sync.
3. If `npm run watch` is running, `dist/` updates automatically. Otherwise run `npm run build`.

Note: if the same key appears in two different domain files, the file read later wins.

## Publish (GitHub Pages)

On every push to `main`, the workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
runs `node builder.mjs` and publishes the `dist/` folder to GitHub Pages. The JSON files
are served flat:

```
https://<user|org>.github.io/<repo>/en.json
https://<user|org>.github.io/<repo>/zh.json
https://<user|org>.github.io/<repo>/cn.json
```

The frontend just fetches these URLs instead of the old S3 bucket.

**One-time setup after creating the repo on GitHub:** Settings → Pages → Build and deployment →
Source = **GitHub Actions**.
