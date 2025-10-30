# Phuc Pham — Portfolio (React + Vite + MUI)

Single-page portfolio designed for GitHub Pages. Dark, card-first UI with sticky sidebar and top tabs.

## Tech
- React 18 + Vite
- MUI v5 + Emotion
- react-router-dom (HashRouter)
- Static JSON content in `src/data/*`

## Local dev
```bash
pnpm install
pnpm dev
```

## Build
```bash
pnpm build
pnpm preview
```

## GitHub Pages
- `package.json` includes `homepage`, `predeploy`, and `deploy` scripts.
- Uses Hash Router so browser refresh works on GitHub Pages.

Deploy from your machine:
```bash
pnpm deploy
```
This builds to `dist/` then publishes it to the `gh-pages` branch via `gh-pages`.

### Optional: GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Publish to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Content editing
All text is in JSON under `src/data/`. Update files and rebuild. Images under `assets/` are optional; the UI will show placeholders if missing.
